<p align="center">
  <img src="projects/webapp/public/logo.svg" width="30%">
</p>

NETOP (Network Topology) is a web application that provides a visual environment for building network topologies and simulating their behavior. It is inspired by the NetEmul project used in ITMO University's networking course. The frontend is built with Vue and PixiJS, while computationally intensive tasks are handled by WebAssembly modules compiled from C++.

# How to Run

Use `yarn dev:server` to start the server and `yarn dev` to start the frontend.

# Problems Faced & Solutions

## Two Tickers Problem

## CLI Problem

### Context

- A user command consists of:
  - a prefix used to uniquely resolve an entity,
  - a command name used to uniquely resolve a public method of that entity,
  - and space-separated arguments.
- Entities may be nested. For example, a computer may contain multiple network interfaces, while all top-level devices are themselves nested inside a scene.
- An entity is uniquely identified by a fully qualified prefix composed of the identifiers of all parent entities and the identifier of the entity itself.

### Requirements

- Simulation entities must remain completely unaware of the command system and only expose a set of public methods. Therefore, wrapper objects are used to translate commands into simulation entity method calls.
- The user should type as little text as possible.

---

### Approach 1. Flat List

`CommandHandler` stores a flat list of `CallableEntity` wrappers, where each wrapper is associated with a unique prefix. When a new entity is created, a corresponding wrapper must also be created and registered in `CommandHandler`. Likewise, when an entity is removed, its wrapper must be manually unregistered.

As a result, responsibility for command registration is delegated to parent entities.

#### Drawbacks

- Entities become aware of the CLI layer.

---

### Approach 2. User-Defined Aliases

This approach is inspired by bash and assumes that any entity can be uniquely identified by a fully qualified prefix composed of the identifiers of its parent entities and the entity itself:

```txt
scene:<device-id>:<child-device-id>
````

To avoid forcing the user to type long identifiers, an alias system is introduced. An alias maps a short name to a fully qualified prefix:

```txt
cdev0 -> scene:<device-id>:<child-device-id>
```

The original idea was for aliases to be managed through dedicated commands:

```txt
+<alias>:<prefix>
-<alias>:<prefix>
```

With this design, wrappers become static constructs because they are associated with the entity class rather than a specific entity instance, since they no longer need to store a concrete prefix.

#### Advantages

* Entities remain decoupled from the CLI layer.

#### Drawbacks

* After creating each entity, the user must manually create an alias, which will often duplicate the entity's `name` property.

---

### Approach 3 (Final). Nested Entity Resolution + Runtime Path Matching

The final solution was to implement a runtime resolution algorithm that searches for entities using partial paths. Conceptually, this is a BFS traversal over the entity tree.

`CommandHandler` performs a BFS traversal over registered entities and searches for the first subtree matching the provided path:

```txt
eth0:child1 -> sc:pc0:eth0:child1
```

The path therefore does not need to be fully qualified. Resolution starts from the first matching entity and continues relative to that entity for all subsequent path segments.

#### Advantages

* Newly created objects automatically become accessible through runtime resolution.
* Entities remain decoupled from the CLI layer.
* The user still types minimal input.
* No duplication between aliases and entity names.

## Undo/Redo Webapp <> Server Problem

The undo/redo strategy determines how the webapp and server interact. When the user presses Ctrl+Z, changes are undone in reverse order of execution across three categories:

1. **Canvas state changes** (e.g. moving a canvas object) — handled by Konva.
2. **Queued, unsent actions** — removed directly from the socket queue.
3. **Sent actions** — requires a server round-trip.

Each action is atomic and invertible and produces an event. Given an action and the result of its execution, a new inverse action can be derived.

---

### Approach 1. Undo by Action

When action `A` is sent:
1. Add `actionMessage(A)` to the socket queue.
2. Remove from the queue once sent.
3. Add `A` to the local change history.

When undoing:
1. Take `A` from the change history.
2. Add `undoActionMessage(A)` to the socket queue.

**Advantages:**
- Instant Ctrl+Z — no need to wait for a server response. If the action resulted in an error, the server simply ignores the `undoAction`.
- Server manages only its own state — the client holds the action history.

**Disadvantages:**
- Actions like `help` that don't mutate state are still added to history. Since the webapp shouldn't know whether an action is stateful, the only option is to add to history asynchronously (after a server response).
- Lookup by value is ambiguous: `undoActionMessage('sc:new router name arg0 arg1')` — what if the user omitted `name`? `undoActionMessage('sc:new router')` won't match. The server would need to store the full action list to resolve this.

---

### Approach 2. Undo by Result

**Advantages:**
- If the action resulted in an error, it won't be undone.

**Disadvantages:**
- Network packet arrivals are also delivered as `entity.create` events. Since `entity.create` is broadcast, the undo history becomes shared across all users — including simulation events no user directly initiated.
- Unintuitive Ctrl+Z for user A if user B's `entity.create` arrived before the `entity.create` that was the result of user A's action.

---

### Approach 3 (Final). Undo by Event ID

There is no dedicated "undo action" entity — undo is simply an action represented as `!:<event-id>`.

**Flow:**
1. User adds an action to the WebSocket queue.
2. The server responds with an `action response` containing either an `eventId` (`status: ok`) or nothing (`status: failed`).
3. On success, the client signals the socket to process the next action and pushes the `eventId` onto the undo/redo stack.

**Advantages over previous approaches:**
- Non-stateful actions (e.g. `help`) are never added to the stack — only actions whose response contains an `eventId` are recorded. Resolves Approach 1's `help` problem.
- Undo lookup is by `eventId`, not by value — `!:219` is unambiguous regardless of how the original action was typed. Resolves Approach 1's lookup problem.
- If an action fails (`status: failed`), the server emits no event and nothing is added to the stack. Preserves Approach 2's error-safety advantage.
- Server stores events (natural state), not a per-session action buffer (extra burden).

The undo/redo stack is ordered by send timestamp and contains entries of three kinds:

- Canvas state changes (Konva)
- Unsent queued actions
- `eventId` entries from sent action responses — once the corresponding event arrives via broadcast, the entry is enriched with its details.

Each user operates on their own undo/redo stack. To undo another user's action, the `!:<event-id>` command is entered directly in the console.

**Example** *(illustrative, not actual output):*

```
User A — undo/redo stack:
  !:219        → #222 en.delete
  move A at (2, 3)
  sc:new router name1  → #219 en.create

User B — undo/redo stack:
  sc:new router somename1  → #221 en.create
  sc:new router somename2  → #220 en.create

User A — console output:
  !:219        → #222 en.delete
  #221 en.create
  #220 en.create
  sc:new router name1  → #219 en.create
```

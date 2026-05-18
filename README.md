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

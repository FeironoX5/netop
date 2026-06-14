import {
  actionHandler,
  simulationEventSource,
} from '@app/main';
import {
  ClientMessageType,
  ServerMessageType,
  type ClientMessage,
  type ServerMessage,
} from '@netop/types';
import '@/db';
import { TreeUtils } from '@netop/utils';
import { PORT } from '@/config';
import { simulationTreeWalker } from './app/simulation/helpers/simulationTreeWalker';
import { SimulationRegistry } from './app/simulation/SimulationRegistry';

const connections: Set<Bun.ServerWebSocket> = new Set();

const parse = (
  raw: string | Buffer,
): ClientMessage | null => {
  try {
    return JSON.parse(String(raw)) as ClientMessage;
  } catch {
    return null;
  }
};

const process = (message: ClientMessage): ServerMessage => {
  try {
    switch (message.type) {
      case ClientMessageType.Action:
        return {
          type: ServerMessageType.ActionResponse,
          status: 'success',
          result: actionHandler.execute(message.body),
        };
      default:
        return {
          type: ServerMessageType.Error,
          message: 'Unknown message type',
        };
    }
  } catch (e) {
    return {
      type: ServerMessageType.ActionResponse,
      status: 'fail',
      result: e instanceof Error ? e.message : String(e),
    };
  }
};

const send = (
  ws: Bun.ServerWebSocket<unknown>,
  message: ServerMessage,
) => {
  ws.send(JSON.stringify(message));
};

const server = Bun.serve({
  port: PORT,
  routes: {
    '/scene': {
      GET: () => {
        //TODO change
        const flatScene = TreeUtils.flatten({
          root: SimulationRegistry.get().root,
          walker: simulationTreeWalker,
        });
        return Response.json(flatScene);
      },
    },
  },
  websocket: {
    open(ws) {
      connections.add(ws);
    },
    close(ws) {
      connections.delete(ws);
    },
    message: (ws, raw) => {
      console.log(`Received ${raw}`);

      const message = parse(raw);
      if (!message) {
        send(ws, {
          type: ServerMessageType.Error,
          message: 'Invalid JSON message',
        });
        return;
      }

      const response = process(message);
      send(ws, response);
    },
  },
  fetch: (req, server) => {
    if (server.upgrade(req)) return;
    return new Response('Not Found', { status: 404 });
  },
});

console.log(`runs on ${server.port} port`);

simulationEventSource.subscribe((event) => {
  let serverMessage: ServerMessage;
  if (event.scope === 'connection') return;
  switch (event.operation) {
    case 'create':
      serverMessage = {
        type: ServerMessageType.EntityCreate,
        entity: event.data,
      };
      break;
    case 'update':
      serverMessage = {
        type: ServerMessageType.EntityUpdate,
        entity: event.data,
      };
      break;
    case 'delete':
      serverMessage = {
        type: ServerMessageType.EntityDelete,
        path: event.parentPath,
        id: event.data.id,
      };
      break;
    default:
      return;
  }
  for (const ws of connections) {
    send(ws, serverMessage);
  }
});

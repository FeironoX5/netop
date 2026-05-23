import {
  actionHandler,
  scene,
  simulationBus,
} from '@app/main';
import { TreeUtils } from '@app/utils/TreeUtils';
import '@/db';
import {
  ClientMessageType,
  ServerMessageType,
  SimulationEntity,
  type ClientMessage,
  type ServerMessage,
} from '@netop/types';
import { ActionCodec } from '@netop/utils';
import { PORT } from '@/config';

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
        const flatScene =
          TreeUtils.flatten<SimulationEntity>(scene, {
            extract: (e) => e.id,
            join: (s) => s.join(ActionCodec.PATH_DELIMITER),
            children: (e) => e.children ?? [],
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

simulationBus.subscribe((event) => {
  let serverMessage: ServerMessage;
  switch (event.type) {
    case 'create':
      serverMessage = {
        type: ServerMessageType.EntityCreate,
        entity: event.entity,
      };
      break;
    case 'update':
      serverMessage = {
        type: ServerMessageType.EntityUpdate,
        entity: event.entity,
      };
      break;
    case 'delete':
      serverMessage = {
        type: ServerMessageType.EntityDelete,
        path: event.path,
        id: event.id,
      };
      break;
    default:
      return;
  }
  for (const ws of connections) {
    send(ws, serverMessage);
  }
});

import {
  actionHandler,
  simulationUndoHandler,
} from '@app/main';
import { getSimulationSnapshot } from '@app/queries/getSimulationSnapshot';
import {
  ClientMessageType,
  ServerMessageType,
  type ClientMessage,
  type ServerMessage,
} from '@netop/types';
import { ActionCodec } from '@netop/utils';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import '@/db';
import { PORT } from '@/config';
import { CORS_HEADERS, withCors } from '@/utils';

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
          result: simulationUndoHandler.group(() =>
            actionHandler.execute(message.body),
          ),
        };
      default:
        return {
          type: ServerMessageType.Log,
          level: 'error',
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

const sendBroadcast = (message: ServerMessage) => {
  connections.forEach((ws) => {
    ws.send(JSON.stringify(message));
  });
};

const server = Bun.serve({
  port: PORT,
  error: (error) => {
    sendBroadcast({
      type: ServerMessageType.Log,
      level: 'error',
      message: error.message,
    });
    return new Response('Internal Server Error', {
      status: 500,
      headers: CORS_HEADERS,
    });
  },
  routes: {
    '/simulation': {
      GET: withCors(() =>
        Response.json(getSimulationSnapshot()),
      ),
    },
  },
  websocket: {
    open(ws) {
      connections.add(ws);
      sendBroadcast({
        type: ServerMessageType.Log,
        level: 'info',
        message: 'WebSocket client connected',
      });
    },
    close(ws) {
      connections.delete(ws);
    },
    message: (ws, raw) => {
      console.log(`Received ${raw}`);

      const message = parse(raw);
      if (!message) {
        send(ws, {
          type: ServerMessageType.Log,
          level: 'error',
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
    return new Response('Not Found', {
      status: 404,
      headers: CORS_HEADERS,
    });
  },
});

console.log(`runs on ${server.port} port`);

simulationUndoHandler.eventBus.subscribe(
  ({ id, event }) => {
    const serverMessage: ServerMessage = {
      type: ServerMessageType.SimulationEvent,
      id,
      event,
    };
    sendBroadcast(serverMessage);
  },
);

SimulationRegistry.get().eventBus.subscribe((event) => {
  if (event.scope !== 'log') return;

  sendBroadcast({
    type: ServerMessageType.Log,
    level: event.level,
    message: `${ActionCodec.join(event.source)}: ${event.message}`,
  });
});

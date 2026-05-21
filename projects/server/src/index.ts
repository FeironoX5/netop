import { actionHandler } from '@app/main';
import {
  ClientMessageType,
  ServerMessageType,
  type ClientMessage,
  type ServerMessage,
} from '@netop/types';
import { PORT } from '@/config';
import '@/db';

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
  switch (message.type) {
    case ClientMessageType.Ping:
      return { type: ServerMessageType.Pong };
    case ClientMessageType.Console: {
      try {
        const result = actionHandler.execute(message.body);
        return {
          type: ServerMessageType.ConsoleResponse,
          status: 'success',
          result,
          requestId: message.requestId,
        };
      } catch (e) {
        return {
          type: ServerMessageType.ConsoleResponse,
          status: 'fail',
          result:
            e instanceof Error ? e.message : String(e),
          requestId: message.requestId,
        };
      }
    }
    default:
      return {
        type: ServerMessageType.Error,
        message: 'Unknown message type',
        requestId: (message as any).requestId,
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
  routes: { '/scene': { GET: () => new Response('OK') } },
  websocket: {
    open() {},
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

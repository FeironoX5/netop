import { ClientMessage, ServerMessage } from '@netop/types';
import { commandHandler } from './app/main';
import './db';
import './app/main';
import { PORT } from './config';

const parse = (raw: string | Buffer): ClientMessage | null => {
  try {
    return JSON.parse(String(raw)) as ClientMessage;
  } catch {
    return null;
  }
};

const process = (message: ClientMessage): ServerMessage => {
  switch (message.type) {
    case 'ping':
      return { type: 'pong' };
    case 'command':
      const result = commandHandler.executeCommand(message.command);
      return { type: 'commandResult', result: result };
    default:
      return { type: 'error', message: 'Unknown message type' };
  }
};

const send = (ws: Bun.ServerWebSocket, message: ServerMessage) => {
  ws.send(JSON.stringify(message));
};

const server = Bun.serve({
  port: PORT,
  routes: {
    '/scene': {
      GET: () => new Response('OK'),
    },
  },
  websocket: {
    open(ws) {
      send(ws, { type: 'connected' });
    },
    message: (ws, raw) => {
      console.log(`Received ${raw}`);

      const message = parse(raw);
      if (!message) {
        send(ws, {
          type: 'error',
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

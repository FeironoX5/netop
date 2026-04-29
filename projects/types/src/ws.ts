export type ClientMessage = { type: 'ping' } | { type: 'command'; command: string; args: string[] };

export type ServerMessage =
  | { type: 'connected' }
  | { type: 'pong' }
  | { type: 'commandResult'; result: string }
  | { type: 'error'; message: string };

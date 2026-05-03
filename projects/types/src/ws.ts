export enum ClientMessageType {
  Ping = 'ping',
  Command = 'command',
}

export enum ServerMessageType {
  Connected = 'connected',
  Pong = 'pong',
  CommandResult = 'commandResult',
  Error = 'error',
}

export type ClientMessage =
  | { type: ClientMessageType.Ping }
  | { type: ClientMessageType.Command; command: string; args: string[] };

export type ServerMessage =
  | { type: ServerMessageType.Connected }
  | { type: ServerMessageType.Pong }
  | { type: ServerMessageType.CommandResult; result: string }
  | { type: ServerMessageType.Error; message: string };

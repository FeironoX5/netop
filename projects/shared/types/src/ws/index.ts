import type { Action } from '../action';
import type { FlatSimulationEntity } from '../entities';

export enum ClientMessageType {
  Ping = 'ping',
  Console = 'console',
  Action = 'action',
  UndoAction = 'action-undo',
}

export enum ServerMessageType {
  Pong = 'pong',
  ConsoleResponse = 'console-response',
  Error = 'error',
  EntityCreate = 'event-entity-create',
  EntityUpdate = 'event-entity-update',
  EntityDelete = 'event-entity-delete',
}

export type ClientMessage =
  | { type: ClientMessageType.Ping }
  | {
      type: ClientMessageType.Console;
      body: string;
      requestId?: string;
    }
  | {
      type: ClientMessageType.Action;
      action: Action;
      requestId?: string;
    }
  | {
      type: ClientMessageType.UndoAction;
      action: Action;
      requestId?: string;
    };

export type ServerMessage =
  | { type: ServerMessageType.Pong }
  | {
      type: ServerMessageType.ConsoleResponse;
      status: 'success' | 'fail';
      result: string;
      requestId?: string;
    }
  | {
      type: ServerMessageType.Error;
      message: string;
      requestId?: string;
    }
  | {
      type: ServerMessageType.EntityCreate;
      entity: FlatSimulationEntity;
    }
  | {
      type: ServerMessageType.EntityUpdate;
      entity: FlatSimulationEntity;
    }
  | {
      type: ServerMessageType.EntityDelete;
      path: string[];
      id: string;
    };

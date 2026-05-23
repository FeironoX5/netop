import type { FlatSimulationEntity } from '../simulation/entities';

export enum ClientMessageType {
  Action = 'action',
}

export enum ServerMessageType {
  ActionResponse = 'action-response',
  Error = 'error',
  EntityCreate = 'event-entity-create',
  EntityUpdate = 'event-entity-update',
  EntityDelete = 'event-entity-delete',
}

export type ClientMessage = {
  type: ClientMessageType.Action;
  body: string;
};

export type ServerMessage =
  | {
      type: ServerMessageType.ActionResponse;
      status: 'success' | 'fail';
      result: string;
    }
  | { type: ServerMessageType.Error; message: string }
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

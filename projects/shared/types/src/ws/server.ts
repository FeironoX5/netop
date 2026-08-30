import type { Simulation } from '../simulation';

export enum ServerMessageType {
  ActionResponse = 'action-response',
  Status = 'status',
  SimulationEvent = 'simulation-event',
}

export const BROADCAST_SERVER_MESSAGE_TYPES: ReadonlySet<ServerMessageType> =
  new Set([
    ServerMessageType.Status,
    ServerMessageType.SimulationEvent,
  ]);

export type ActionResponseMessage = {
  type: ServerMessageType.ActionResponse;
  status: 'success' | 'fail';
  result: string;
};

export type StatusMessage = {
  type: ServerMessageType.Status;
  status: 'info' | 'error';
  message: string;
};

export type SimulationEventMessage = {
  type: ServerMessageType.SimulationEvent;
  id: number;
  event: Simulation.Event.type;
};

export type SystemMessage =
  | ActionResponseMessage
  | StatusMessage;

export type ServerMessage =
  | SystemMessage
  | SimulationEventMessage;

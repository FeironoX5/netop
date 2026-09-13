import type { Simulation } from '../simulation';

export enum ServerMessageType {
  ActionResponse = 'action-response',
  Log = 'log',
  SimulationEvent = 'simulation-event',
}

export const BROADCAST_SERVER_MESSAGE_TYPES: ReadonlySet<ServerMessageType> =
  new Set([
    ServerMessageType.Log,
    ServerMessageType.SimulationEvent,
  ]);

export type ActionResponseMessage = {
  type: ServerMessageType.ActionResponse;
  status: 'success' | 'fail';
  result: string;
};

export type LogMessage = {
  type: ServerMessageType.Log;
  level: 'info' | 'error';
  message: string;
};

export type SimulationEventMessage = {
  type: ServerMessageType.SimulationEvent;
  id: number;
  event: Simulation.Event.Mutation;
};

export type SystemMessage =
  | ActionResponseMessage
  | LogMessage;

export type ServerMessage =
  | SystemMessage
  | SimulationEventMessage;

import type { Simulation } from '../simulation';

export enum ServerMessageType {
  ActionResponse = 'action-response',
  Error = 'error',
  ConsoleOutput = 'console-output',
  SimulationEvent = 'simulation-event',
}

export const BROADCAST_SERVER_MESSAGE_TYPES: ReadonlySet<ServerMessageType> =
  new Set([ServerMessageType.SimulationEvent]);

export type ActionResponseMessage = {
  type: ServerMessageType.ActionResponse;
  status: 'success' | 'fail';
  result: string;
};

export type ErrorMessage = {
  type: ServerMessageType.Error;
  message: string;
};

export type ConsoleOutputMessage = {
  type: ServerMessageType.ConsoleOutput;
  output: string;
};

export type SimulationEventMessage = {
  type: ServerMessageType.SimulationEvent;
  event: Simulation.Event.type;
};

export type SystemMessage =
  | ActionResponseMessage
  | ErrorMessage
  | ConsoleOutputMessage;

export type ServerMessage =
  | SystemMessage
  | SimulationEventMessage;

import { Simulation } from '@netop/types';

export namespace SimulationEvent {
  export type CreateType = Simulation.Event.CreateEvent;

  export type DeleteType = Simulation.Event.DeleteEvent;

  export type UpdateType =
    | (Simulation.Event.Update & {
        data: Simulation.Event.EntityPayload['data'];
        scope: 'entity';
        parentPath: Simulation.Event.EntityPayload['parentPath'];
        oldData: Simulation.Event.EntityPayload['data'];
      })
    | (Simulation.Event.Update & {
        data: Simulation.Event.ConnectionPayload['data'];
        scope: 'connection';
        oldData: Simulation.Event.ConnectionPayload['data'];
      });

  export type type = CreateType | UpdateType | DeleteType;
}

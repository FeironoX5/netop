import { PathSegment, Simulation } from '@netop/types';

export namespace SimulationEvent {
  type CreateEvent = { operation: 'create' };

  type UpdateEvent = { operation: 'update' };

  type UpdatePayload<P extends Payload> = Omit<
    P,
    'data'
  > & { data: P['data']; oldData: P['data'] };

  type DeleteEvent = { operation: 'delete' };

  type EntityPayload = {
    data: Simulation.Entity;
    scope: 'entity';
    parentPath: PathSegment[];
  };

  type ConnectionPayload = {
    data: Simulation.Connection;
    scope: 'connection';
  };

  type Payload = EntityPayload | ConnectionPayload;

  type CreateType = CreateEvent & Payload;

  type UpdateType =
    | (UpdateEvent & UpdatePayload<EntityPayload>)
    | (UpdateEvent & UpdatePayload<ConnectionPayload>);

  type DeleteType = DeleteEvent & Payload;

  export type type = CreateType | UpdateType | DeleteType;
}

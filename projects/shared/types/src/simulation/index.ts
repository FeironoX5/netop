import type { PathSegment } from '../action';
import { DeviceCategory } from './device';
import { SceneCategory } from './scene';

export * from './device';
export * from './scene';

export namespace Simulation {
  export type Category =
    | DeviceCategory
    | typeof SceneCategory;

  export type Entity = {
    id: string;
    category: Category;
    name?: string;
    children?: Entity[];
    details?: object;
  };

  export type Connection = {
    id: string;
    left: { path: PathSegment[]; port: number };
    right: { path: PathSegment[]; port: number };
    // symbols per tick
    speed: number;
    // ticks to deliver
    delay: number;
  };

  export namespace Event {
    export type Create = { operation: 'create' };
    export type Update = { operation: 'update' };
    export type Delete = { operation: 'delete' };

    export type EntityPayload = {
      data: Simulation.Entity;
      scope: 'entity';
      parentPath: PathSegment[];
    };

    export type ConnectionPayload = {
      data: Simulation.Connection;
      scope: 'connection';
    };

    export type Payload = EntityPayload | ConnectionPayload;

    export type CreateEvent = Create & Payload;
    export type UpdateEvent = Update & Payload;
    export type DeleteEvent = Delete & Payload;

    export type type =
      | CreateEvent
      | UpdateEvent
      | DeleteEvent;
  }
}

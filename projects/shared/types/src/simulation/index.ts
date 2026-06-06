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

  export type Event =
    | {
        type: 'create';
        parentPath: PathSegment[];
        data: Entity;
      }
    | {
        type: 'update';
        parentPath: PathSegment[];
        data: Entity;
        oldData: Entity;
      }
    | {
        type: 'delete';
        parentPath: PathSegment[];
        oldData: Entity;
      };
}

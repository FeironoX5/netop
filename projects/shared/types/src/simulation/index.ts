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
    type: 'duplex';
    left: { path: PathSegment[]; port: number };
    right: { path: PathSegment[]; port: number };
  };
}

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
    direction: 'left' | 'right';
    speed: number;
    delay: number;
  };
}

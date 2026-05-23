import { DeviceType } from './device-type';
import { SceneType } from './scene-type';

export type SimulationEntityType =
  | DeviceType
  | typeof SceneType;

export interface SimulationEntity {
  id: string;
  name: string;
  type: SimulationEntityType;
  children?: SimulationEntity[];
}

export interface FlatSimulationEntity extends SimulationEntity {
  path: string[];
}

export type SimulationEntityEvent =
  | { type: 'create'; entity: FlatSimulationEntity }
  | { type: 'update'; entity: FlatSimulationEntity }
  | { type: 'delete'; path: string[]; id: string };

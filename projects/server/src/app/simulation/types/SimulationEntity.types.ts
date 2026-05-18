import { DeviceType } from './Device.types';
import { SceneType } from './Scene.types';

export type SimulationEntityType =
  | DeviceType
  | typeof SceneType;

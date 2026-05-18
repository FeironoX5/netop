import { DeviceType } from '@netop/types';
import { SceneType } from './Scene.types';

export type SimulationEntityType =
  | DeviceType
  | typeof SceneType;

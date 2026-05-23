import { EntityWrapper } from '@commands/interfaces/EntityWrapper';
import { ComputerWrapper } from '@commands/wrappers/simulation/Computer.wrapper';
import { SceneWrapper } from '@commands/wrappers/simulation/Scene.wrapper';
import {
  DeviceType,
  SceneType,
  SimulationEntity,
} from '@netop/types';
import { TreeUtils } from '@/app/utils/TreeUtils';
import { EntityWrapperMap, ResolverFactory } from './types';

const wrappers: EntityWrapperMap = new Map([
  [DeviceType.COMPUTER, ComputerWrapper],
  [
    SceneType,
    SceneWrapper as EntityWrapper<SimulationEntity>,
  ],
]);

export const getSimulationFactory = (
  root: SimulationEntity,
): ResolverFactory<SimulationEntity> => {
  const resolver = TreeUtils.resolve(root, {
    match: (s, e) => e.id === s || e.name === s,
    children: (e) => e.children ?? [],
    wrap: (e) => {
      const wrapper = wrappers.get(e.type);
      if (!wrapper)
        throw new Error(`No wrapper for ${e.type}`);
      return wrapper;
    },
  });

  return { resolver, wrappers };
};

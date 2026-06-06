import { EntityWrapper } from '@commands/interfaces/EntityWrapper';
import { ComputerWrapper } from '@commands/wrappers/simulation/Computer.wrapper';
import { SceneWrapper } from '@commands/wrappers/simulation/Scene.wrapper';
import {
  DeviceCategory,
  SceneCategory,
} from '@netop/types';
import { SimulationEntity } from '@simulation/SimulationEntity';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import { TreeUtils } from '@/app/utils/TreeUtils';
import { EntityWrapperMap, ResolverFactory } from './types';

const wrappers: EntityWrapperMap = new Map([
  [DeviceCategory.COMPUTER, ComputerWrapper],
  [
    SceneCategory,
    SceneWrapper as EntityWrapper<SimulationEntity>,
  ],
]);

export const getSimulationEntityFactory = (
  root: SimulationEntity,
): ResolverFactory<SimulationEntity> => {
  const resolver = TreeUtils.resolve(root, {
    match: (s, e) => e.id === s || e.name === s,
    children: (e) =>
      e.children.map((c) =>
        SimulationRegistry.getManager(c.category).from(c),
      ),
    wrap: (e) => {
      const wrapper = wrappers.get(e.category);
      if (!wrapper)
        throw new Error(`No wrapper for ${e.category}`);
      return wrapper;
    },
  });

  return { resolver, wrappers };
};

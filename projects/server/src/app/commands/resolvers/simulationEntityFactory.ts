import { EntityWrapper } from '@commands/interfaces/EntityWrapper';
import { ComputerWrapper } from '@commands/wrappers/simulation/Computer.wrapper';
import { SceneWrapper } from '@commands/wrappers/simulation/Scene.wrapper';
import { SimulationEntity } from '@entites/SimulationEntity';
import {
  DeviceCategory,
  SceneCategory,
} from '@netop/types';
import { TreeUtils } from '@netop/utils';
import { simulationTreeWalker } from '@/app/simulation/helpers/simulationTreeWalker';
import { SimulationRegistry } from '@/app/simulation/SimulationRegistry';
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
  const entityResolver = TreeUtils.resolve({
    root: root,
    walker: simulationTreeWalker,
  });

  return {
    resolver: (p) => {
      const entity = entityResolver(p);
      if (!entity) return undefined;
      const wrapper = wrappers.get(entity.category);
      if (!wrapper) return undefined;
      return {
        entity: SimulationRegistry.getManager(
          entity.category,
        ).from(entity),
        wrapper: wrapper,
      };
    },
    wrappers,
  };
};

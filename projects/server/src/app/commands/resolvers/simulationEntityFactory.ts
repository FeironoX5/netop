import { EntityWrapper } from '@commands/interfaces/EntityWrapper';
import { ComputerWrapper } from '@commands/wrappers/simulation/Computer.wrapper';
import { NetworkDeviceWrapper } from '@commands/wrappers/simulation/NetworkDevice.wrapper';
import { SceneWrapper } from '@commands/wrappers/simulation/Scene.wrapper';
import { SimulationEntity } from '@entites/SimulationEntity';
import {
  DeviceCategory,
  SceneCategory,
} from '@netop/types';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import { EntityWrapperMap, ResolverFactory } from './types';

const wrappers: EntityWrapperMap = new Map([
  [DeviceCategory.COMPUTER, ComputerWrapper],
  [
    DeviceCategory.NETWORK_CARD,
    NetworkDeviceWrapper as EntityWrapper<SimulationEntity>,
  ],
  [
    SceneCategory,
    SceneWrapper as EntityWrapper<SimulationEntity>,
  ],
]);

export const getSimulationEntityFactory =
  (): ResolverFactory<SimulationEntity> => ({
    resolver: (p) => {
      const resolved = SimulationRegistry.get().resolve(p);
      if (!resolved) return undefined;
      const wrapper = wrappers.get(
        resolved.entity.category,
      );
      if (!wrapper) return undefined;
      return { entity: resolved.entity, wrapper };
    },
    wrappers,
  });

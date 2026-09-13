import { EntityWrapper } from '@commands/interfaces/EntityWrapper';
import { ComputerWrapper } from '@commands/wrappers/simulation/Computer.wrapper';
import { DataLinkDeviceWrapper } from '@commands/wrappers/simulation/DataLinkDevice.wrapper';
import { NetworkCardWrapper } from '@commands/wrappers/simulation/NetworkCard.wrapper';
import { PhysicalDeviceWrapper } from '@commands/wrappers/simulation/PhysicalDevice.wrapper';
import { PortWrapper } from '@commands/wrappers/simulation/Port.wrapper';
import { RouterWrapper } from '@commands/wrappers/simulation/Router.wrapper';
import { SceneWrapper } from '@commands/wrappers/simulation/Scene.wrapper';
import { SimulationEntity } from '@entites/SimulationEntity';
import {
  DeviceCategory,
  PortCategory,
  SceneCategory,
} from '@netop/types';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import { EntityWrapperMap, ResolverFactory } from './types';

const wrappers: EntityWrapperMap = new Map<
  string,
  EntityWrapper<any>
>([
  [DeviceCategory.COMPUTER, ComputerWrapper],
  [DeviceCategory.ROUTER, RouterWrapper],
  [DeviceCategory.NETWORK_CARD, NetworkCardWrapper],
  [DeviceCategory.HUB, PhysicalDeviceWrapper],
  [DeviceCategory.SWITCH, DataLinkDeviceWrapper],
  [PortCategory.PHYSICAL, PortWrapper],
  [PortCategory.DATA_LINK, PortWrapper],
  [SceneCategory, SceneWrapper],
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

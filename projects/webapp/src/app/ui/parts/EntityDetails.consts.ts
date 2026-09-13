import {
  DeviceCategory,
  PortCategory,
  SceneCategory,
  type Simulation,
} from '@netop/types';

export const ENTITY_CATEGORY_ICON: Record<
  Simulation.Category,
  string
> = {
  [SceneCategory]: 'boxes',
  [DeviceCategory.ROUTER]: 'router',
  [DeviceCategory.SWITCH]: 'network',
  [DeviceCategory.HUB]: 'waypoints',
  [DeviceCategory.COMPUTER]: 'monitor',
  [DeviceCategory.NETWORK_CARD]: 'ethernet-port',
  [PortCategory.PHYSICAL]: 'circle-dot',
  [PortCategory.DATA_LINK]: 'circle-dot',
};

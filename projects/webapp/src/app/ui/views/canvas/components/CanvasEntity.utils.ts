import {
  DeviceCategory,
  type FlatSimulationEntity,
  PortCategory,
  type Simulation,
} from '@netop/types';
import { ActionCodec } from '@netop/utils';
import type { CanvasCellPosition } from '@/app/stores/canvasStore';

export function getParentPath(path: string): string {
  return ActionCodec.join(
    ActionCodec.split(path).slice(0, -1),
  );
}

export function getDirectChildren(
  entities: Map<string, FlatSimulationEntity>,
  parentPath: string,
) {
  return Array.from(entities, ([path, entity]) => ({
    path,
    entity,
  })).filter(
    ({ path }) => getParentPath(path) === parentPath,
  );
}

export function getComputerNetworkCard(
  entities: Map<string, FlatSimulationEntity>,
  path: string,
) {
  return getDirectChildren(entities, path)[0]!;
}

export function getChildIndex(
  entities: Map<string, FlatSimulationEntity>,
  path: string,
): number {
  return getDirectChildren(
    entities,
    getParentPath(path),
  ).findIndex(({ path: childPath }) => childPath === path);
}

export function getComputerPosition(
  entities: Map<string, FlatSimulationEntity>,
  positions: ReadonlyMap<string, CanvasCellPosition>,
  path: string,
): CanvasCellPosition {
  const { path: networkCardPath } = getComputerNetworkCard(
    entities,
    path,
  );
  const position = positions.get(networkCardPath)!;
  return { x: position.x, y: position.y - 1 };
}

export function getPortPosition(
  positions: ReadonlyMap<string, CanvasCellPosition>,
  path: string,
  index: number,
): CanvasCellPosition {
  const position = positions.get(getParentPath(path))!;
  return { x: position.x, y: position.y + index + 1 };
}

export function getDeviceCapText(
  category: Simulation.Category,
): string | undefined {
  switch (category) {
    case DeviceCategory.COMPUTER:
      return 'PC';
    case DeviceCategory.NETWORK_CARD:
      return 'NC';
    case DeviceCategory.HUB:
      return 'H';
    case DeviceCategory.SWITCH:
      return 'S';
    case DeviceCategory.ROUTER:
      return 'R';
    default:
      return;
  }
}

export function isPortCategory(
  category: Simulation.Category,
): boolean {
  return (
    category === PortCategory.PHYSICAL ||
    category === PortCategory.DATA_LINK
  );
}

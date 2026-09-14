import {
  DeviceCategory,
  SceneCategory,
  type FlatSimulationEntity,
} from '@netop/types';
import type { CanvasCellPosition } from '@/app/stores/canvasStore';
import { DEVICE_LAYOUT } from './CanvasView.consts';
import { isPortCategory } from './components/CanvasEntity.utils';

type CanvasEntityEntry = readonly [
  string,
  FlatSimulationEntity,
];

export function getCanvasEntityLayers(
  entities: Map<string, FlatSimulationEntity>,
) {
  const devices: CanvasEntityEntry[] = [];
  const ports: CanvasEntityEntry[] = [];
  const computers: CanvasEntityEntry[] = [];

  entities.forEach((entity, path) => {
    const entry = [path, entity] as const;
    if (entity.category === DeviceCategory.COMPUTER) {
      computers.push(entry);
    } else if (isPortCategory(entity.category)) {
      ports.push(entry);
    } else if (entity.category !== SceneCategory) {
      devices.push(entry);
    }
  });

  return [devices, ports, computers] as const;
}

export function getFreeDevicePosition(
  isAvailable: (position: CanvasCellPosition) => boolean,
): CanvasCellPosition {
  for (let index = 0; ; index += 1) {
    const position = {
      x:
        DEVICE_LAYOUT.origin.x +
        (index % DEVICE_LAYOUT.columns) *
          DEVICE_LAYOUT.gap.x,
      y:
        DEVICE_LAYOUT.origin.y +
        Math.floor(index / DEVICE_LAYOUT.columns) *
          DEVICE_LAYOUT.gap.y,
    };
    if (isAvailable(position)) return position;
  }
}

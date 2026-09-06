import { DeviceCategory } from '@netop/types';
import { PortBuffer } from '@simulation/details/physical/PortBuffer';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import { PhysicalDevice } from './PhysicalDevice';

export class Hub extends PhysicalDevice {
  static {
    SimulationRegistry.setManager(DeviceCategory.HUB, {
      build: (id, name) => ({
        id,
        category: DeviceCategory.HUB,
        name,
        details: {
          ports: Array.from(
            { length: 4 },
            PortBuffer.build,
          ),
        },
      }),
      from: Hub,
      tick(e) {
        SimulationRegistry.behaviours.repeater(e);
        SimulationRegistry.behaviours.entity(e);
      },
    });
  }
}

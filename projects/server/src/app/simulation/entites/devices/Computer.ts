import { DeviceCategory } from '@netop/types';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import { SimulationEntity } from '../SimulationEntity';

export class Computer extends SimulationEntity {
  static override ALLOWED_CHILD_CATEGORIES = [
    DeviceCategory.NETWORK_CARD,
  ];

  static {
    SimulationRegistry.setManager(DeviceCategory.COMPUTER, {
      build: (id, name) => ({
        id,
        category: DeviceCategory.COMPUTER,
        name,
      }),
      from: Computer,
      tick(e) {
        SimulationRegistry.behaviours.entity(e);
      },
    });
  }
}

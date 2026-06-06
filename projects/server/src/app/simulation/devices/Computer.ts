import { DeviceCategory, Simulation } from '@netop/types';
import { SimulationEntity } from '../SimulationEntity';
import { SimulationRegistry } from '../SimulationRegistry';

export class Computer extends SimulationEntity<{
  networkCards?: Simulation.Entity[];
}> {
  static override ALLOWED_CHILD_CATEGORIES: Simulation.Category[] =
    [DeviceCategory.NETWORK_CARD];

  static {
    SimulationRegistry.managers[DeviceCategory.COMPUTER] = {
      build: (id: string, ...args: string[]) => ({
        id,
        category: DeviceCategory.COMPUTER,
        name: args[0],
        children: [],
        details: {},
      }),
      from: (e: Simulation.Entity) => new Computer(e),
      tick(e: Simulation.Entity) {
        SimulationRegistry.behaviours.entity(e);
      },
    };
  }
}

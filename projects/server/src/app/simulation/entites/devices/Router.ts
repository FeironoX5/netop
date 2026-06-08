import { DeviceCategory, Simulation } from '@netop/types';
import { IpAddress } from '@simulation/details/IpAddress';
import { MacAddress } from '@simulation/details/MacAddress';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import { SimulationEntity } from '../SimulationEntity';

export class Router extends SimulationEntity<{
  portsCount?: number;
  macAddress?: number[];
  ipAddress?: number[];
  ports?: (unknown | null)[];
}> {
  static override ALLOWED_CHILD_CATEGORIES: Simulation.Category[] =
    [DeviceCategory.COMPUTER];

  static {
    SimulationRegistry.managers[DeviceCategory.ROUTER] = {
      build: (id: string, ...args: string[]) => ({
        id,
        category: DeviceCategory.ROUTER,
        name: args[0],
        children: [],
        details: {
          portsCount: 4,
          macAddress: Array.from(MacAddress.generate()),
          ipAddress: Array.from(IpAddress.generate()),
          ports: Array.from({ length: 4 }, () => null),
        },
      }),
      from: (e: Simulation.Entity) => new Router(e),
      tick(e: Simulation.Entity) {
        SimulationRegistry.behaviours.entity(e);
      },
    };
  }
}

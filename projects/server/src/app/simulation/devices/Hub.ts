import { DeviceCategory, Simulation } from '@netop/types';
import { IpAddress } from '../details/IpAddress';
import { MacAddress } from '../details/MacAddress';
import { SimulationEntity } from '../SimulationEntity';
import { SimulationRegistry } from '../SimulationRegistry';

export class Hub extends SimulationEntity<{
  portsCount?: number;
  macAddress?: number[];
  ipAddress?: number[];
  ports?: (unknown | null)[];
}> {
  static override ALLOWED_CHILD_CATEGORIES = null;

  static {
    SimulationRegistry.managers[DeviceCategory.HUB] = {
      build: (id: string, ...args: string[]) => ({
        id,
        category: DeviceCategory.HUB,
        name: args[0],
        children: [],
        details: {
          portsCount: 4,
          macAddress: Array.from(MacAddress.generate()),
          ipAddress: Array.from(IpAddress.generate()),
          ports: Array.from({ length: 4 }, () => null),
        },
      }),
      from: (e: Simulation.Entity) => new Hub(e),
      tick(e: Simulation.Entity) {
        SimulationRegistry.behaviours.entity(e);
      },
    };
  }
}

import { DeviceCategory, Simulation } from '@netop/types';
import { IpAddress } from '../details/IpAddress';
import { MacAddress } from '../details/MacAddress';
import { SimulationEntity } from '../SimulationEntity';
import { SimulationRegistry } from '../SimulationRegistry';

export class NetworkCard extends SimulationEntity<{
  portsCount?: number;
  macAddress?: number[];
  ipAddress?: number[];
  ports?: (unknown | null)[];
}> {
  static override ALLOWED_CHILD_CATEGORIES = null;

  static {
    SimulationRegistry.managers[
      DeviceCategory.NETWORK_CARD
    ] = {
      build: (id: string, ...args: string[]) => ({
        id,
        category: DeviceCategory.NETWORK_CARD,
        name: args[0],
        children: [],
        details: {
          portsCount: 1,
          macAddress: Array.from(MacAddress.generate()),
          ipAddress: Array.from(IpAddress.generate()),
          ports: [null],
        },
      }),
      from: (e: Simulation.Entity) => new NetworkCard(e),
      tick(e: Simulation.Entity) {
        SimulationRegistry.behaviours.entity(e);
      },
    };
  }
}

import { DeviceCategory } from '@netop/types';
import { IpAddress } from '@simulation/details/IpAddress';
import { MacAddress } from '@simulation/details/MacAddress';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import { SimulationEntity } from '../SimulationEntity';

export class Router extends SimulationEntity<{
  portsCount: number;
  macAddress: number[];
  ipAddress: number[];
  ports: (unknown | null)[];
}> {
  static {
    SimulationRegistry.setManager(DeviceCategory.ROUTER, {
      build: (id, name) => ({
        id,
        category: DeviceCategory.ROUTER,
        name,
        children: [],
        details: {
          portsCount: 4,
          macAddress: Array.from(MacAddress.generate()),
          ipAddress: Array.from(IpAddress.generate()),
          ports: Array.from({ length: 4 }, () => null),
        },
      }),
      from: (e) => new Router(e),
      tick(e) {
        SimulationRegistry.behaviours.entity(e);
      },
    });
  }
}

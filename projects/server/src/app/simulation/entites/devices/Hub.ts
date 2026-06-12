import { DeviceCategory } from '@netop/types';
import { IpAddress } from '@simulation/details/IpAddress';
import { MacAddress } from '@simulation/details/MacAddress';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import { SimulationEntity } from '../SimulationEntity';

export class Hub extends SimulationEntity<{
  portsCount: number;
  macAddress: number[];
  ipAddress: number[];
  ports: (unknown | null)[];
}> {
  static {
    SimulationRegistry.setManager(DeviceCategory.HUB, {
      build: (id, name) => ({
        id,
        category: DeviceCategory.HUB,
        name,
        details: {
          portsCount: 4,
          macAddress: Array.from(MacAddress.generate()),
          ipAddress: Array.from(IpAddress.generate()),
          ports: Array.from({ length: 4 }, () => null),
        },
      }),
      from: Hub,
      tick(e) {
        SimulationRegistry.behaviours.entity(e);
      },
    });
  }
}

import { DeviceCategory } from '@netop/types';
import { IpAddress } from '@simulation/details/IpAddress';
import { MacAddress } from '@simulation/details/MacAddress';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import { SimulationEntity } from '../SimulationEntity';

export class Switch extends SimulationEntity<{
  portsCount: number;
  macAddress?: number[];
  ipAddress?: number[];
  ports?: (unknown | null)[];
}> {
  static {
    SimulationRegistry.setManager(DeviceCategory.SWITCH, {
      build: (id, name) => ({
        id,
        category: DeviceCategory.SWITCH,
        name,
        details: {
          portsCount: 2,
          macAddress: Array.from(MacAddress.generate()),
          ipAddress: Array.from(IpAddress.generate()),
          ports: Array.from({ length: 4 }, () => null),
        },
      }),
      from: Switch,
      tick(e) {
        console.log(e.details!.portsCount);
        SimulationRegistry.behaviours.entity(e);
      },
    });
  }
}

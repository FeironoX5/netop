import { DeviceCategory } from '@netop/types';
import { IpAddress } from '@simulation/details/IpAddress';
import { MacAddress } from '@simulation/details/MacAddress';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import { SimulationEntity } from '../SimulationEntity';

export class NetworkCard extends SimulationEntity<{
  portsCount?: number;
  macAddress?: number[];
  ipAddress?: number[];
  ports?: (unknown | null)[];
}> {
  static {
    SimulationRegistry.setManager(
      DeviceCategory.NETWORK_CARD,
      {
        build: (id, name) => ({
          id,
          category: DeviceCategory.NETWORK_CARD,
          name,
          details: {
            portsCount: 1,
            macAddress: Array.from(MacAddress.generate()),
            ipAddress: Array.from(IpAddress.generate()),
            ports: [null],
          },
        }),
        from: NetworkCard,
        tick(e) {
          SimulationRegistry.behaviours.entity(e);
        },
      },
    );
  }
}

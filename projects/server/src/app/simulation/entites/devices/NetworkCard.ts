import { DeviceCategory } from '@netop/types';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import { NetworkDevice } from './NetworkDevice';

export class NetworkCard extends NetworkDevice {
  static {
    SimulationRegistry.setManager(
      DeviceCategory.NETWORK_CARD,
      {
        build: (id, name) => ({
          id,
          category: DeviceCategory.NETWORK_CARD,
          name,
          details: { ports: [{ in: [], out: [] }] },
        }),
        from: NetworkCard,
        tick(e) {
          SimulationRegistry.behaviours.entity(e);
        },
      },
    );
  }
}

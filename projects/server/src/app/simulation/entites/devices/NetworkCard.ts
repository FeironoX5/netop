import { DeviceCategory } from '@netop/types';
import { EthernetFrame } from '@simulation/details/EthernetFrame';
import { MacAddress } from '@simulation/details/MacAddress';
import { PortBuffer } from '@simulation/details/PortBuffer';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import {
  DataLinkDevice,
  DataLinkFrame,
} from './DataLinkDevice';

export class NetworkCard extends DataLinkDevice {
  static {
    SimulationRegistry.setManager(
      DeviceCategory.NETWORK_CARD,
      {
        build: (id, name) => ({
          id,
          category: DeviceCategory.NETWORK_CARD,
          name,
          details: {
            macAddress: MacAddress.generate(),
            ports: [PortBuffer.build()],
            outgoingFrames: [],
            receivedFrames: [],
          },
        }),
        from: NetworkCard,
        tick(e) {
          SimulationRegistry.behaviours.ethernet(e);
          SimulationRegistry.behaviours.entity(e);
        },
      },
    );
  }

  transmit(
    destination: MacAddress.type,
    etherType: EthernetFrame.EtherType,
    payload: number[],
  ): void {
    this.queue(0, {
      destination,
      source: this.macAddress,
      etherType,
      payload,
    });
  }

  override receive(): DataLinkFrame[] {
    return super
      .receive()
      .filter(
        ({ frame }) =>
          MacAddress.equals(
            frame.destination,
            this.macAddress,
          ) || MacAddress.isBroadcast(frame.destination),
      );
  }
}

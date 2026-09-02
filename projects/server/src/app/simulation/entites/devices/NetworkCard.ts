import { DeviceCategory } from '@netop/types';
import { EthernetFrame } from '@simulation/details/EthernetFrame';
import { MacAddress } from '@simulation/details/MacAddress';
import { PortBuffer } from '@simulation/details/PortBuffer';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import {
  NetworkDevice,
  NetworkDeviceDetails,
} from './NetworkDevice';

export type NetworkCardFrame = {
  port: number;
  frame: EthernetFrame.type;
};

export type NetworkCardDetails = NetworkDeviceDetails & {
  macAddress: MacAddress.type;
  outgoingFrames: NetworkCardFrame[];
  receivedFrames: NetworkCardFrame[];
};

export class NetworkCard extends NetworkDevice<NetworkCardDetails> {
  sendFrame(
    port: number,
    destination: MacAddress.type,
    etherType: EthernetFrame.EtherType,
    payload: number[],
  ): void {
    this.details.outgoingFrames.push({
      port,
      frame: {
        destination,
        source: this.details.macAddress,
        etherType,
        payload,
      },
    });
  }

  takeReceivedFrames(): NetworkCardFrame[] {
    return this.details.receivedFrames
      .splice(0)
      .filter(
        ({ frame }) =>
          MacAddress.equals(
            frame.destination,
            this.details.macAddress,
          ) || MacAddress.isBroadcast(frame.destination),
      );
  }

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
}

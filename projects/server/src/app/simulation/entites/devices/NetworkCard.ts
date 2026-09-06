import { DeviceCategory } from '@netop/types';
import { DataLinkPort } from '@simulation/details/data-link/DataLinkPort';
import { EthernetFrame } from '@simulation/details/data-link/EthernetFrame';
import { MacAddress } from '@simulation/details/data-link/MacAddress';
import { SlipFrame } from '@simulation/details/data-link/SlipFrame';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import {
  DataLinkDevice,
  FrameFormat,
  PortFrame,
} from './DataLinkDevice';

export class NetworkCard extends DataLinkDevice {
  static {
    SimulationRegistry.setManager(
      DeviceCategory.NETWORK_CARD,
      {
        build: (id, name, ...frameFormats) => {
          if (frameFormats.length === 0)
            frameFormats.push(EthernetFrame.FORMAT);

          return {
            id,
            category: DeviceCategory.NETWORK_CARD,
            name,
            details: {
              macAddress: MacAddress.generate(),
              ports: frameFormats.map((frameFormat) =>
                DataLinkPort.build(
                  frameFormat as FrameFormat,
                ),
              ),
              receivedFrames: [],
            },
          };
        },
        from: NetworkCard,
        tick(e) {
          SimulationRegistry.behaviours.dataLink(e);
          SimulationRegistry.behaviours.entity(e);
        },
      },
    );
  }

  transmit(
    port: number,
    frame:
      | Omit<EthernetFrame.type, 'source'>
      | SlipFrame.type,
  ): void {
    switch (this.ports(port).frameFormat) {
      case EthernetFrame.FORMAT:
        this.queue(
          port,
          EthernetFrame.serialize({
            ...(frame as Omit<
              EthernetFrame.type,
              'source'
            >),
            source: this.macAddress,
          }),
        );
        break;
      case SlipFrame.FORMAT:
        this.queue(port, SlipFrame.serialize(frame));
        break;
    }
  }

  override receive(): PortFrame[] {
    return super.receive().filter(({ port, frame }) => {
      switch (this.ports(port).frameFormat) {
        case EthernetFrame.FORMAT: {
          const { destination } =
            EthernetFrame.deserialize(frame);
          return (
            MacAddress.equals(
              destination,
              this.macAddress,
            ) || MacAddress.isBroadcast(destination)
          );
        }
        default:
          return true;
      }
    });
  }
}

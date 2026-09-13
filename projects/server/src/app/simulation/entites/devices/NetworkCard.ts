import { DeviceCategory, PortCategory } from '@netop/types';
import { TreeUtils } from '@netop/utils';
import { EthernetFrame } from '@simulation/details/data-link/EthernetFrame';
import { MacAddress } from '@simulation/details/data-link/MacAddress';
import { SlipFrame } from '@simulation/details/data-link/SlipFrame';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import {
  DataLinkDevice,
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
            children: TreeUtils.buildChildren(
              frameFormats.length,
              (portId, index) =>
                SimulationRegistry.getManager(
                  PortCategory.DATA_LINK,
                ).build(portId, frameFormats[index]),
            ),
            details: {
              macAddress: MacAddress.generate(),
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
    portId: string,
    frame:
      | Omit<EthernetFrame.type, 'source'>
      | SlipFrame.type,
  ): void {
    switch (this.port(portId).frameFormat) {
      case EthernetFrame.FORMAT:
        this.queue(
          portId,
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
        this.queue(portId, SlipFrame.serialize(frame));
        break;
    }
  }

  override receive(): PortFrame[] {
    return super.receive().filter(({ portId, frame }) => {
      switch (this.port(portId).frameFormat) {
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

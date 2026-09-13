import { DeviceCategory, PortCategory } from '@netop/types';
import { TreeUtils } from '@netop/utils';
import { EthernetFrame } from '@simulation/details/data-link/EthernetFrame';
import { MacAddress } from '@simulation/details/data-link/MacAddress';
import { SwitchingTable } from '@simulation/details/data-link/SwitchingTable';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import {
  DataLinkDetails,
  DataLinkDevice,
} from './DataLinkDevice';

export type SwitchDetails = DataLinkDetails & {
  switchingTable: SwitchingTable.type;
};

export class Switch extends DataLinkDevice<SwitchDetails> {
  static {
    SimulationRegistry.setManager(DeviceCategory.SWITCH, {
      build: (id, name) => ({
        id,
        category: DeviceCategory.SWITCH,
        name,
        children: TreeUtils.buildChildren(4, (portId) =>
          SimulationRegistry.getManager(
            PortCategory.DATA_LINK,
          ).build(portId, EthernetFrame.FORMAT),
        ),
        details: {
          macAddress: MacAddress.generate(),
          receivedFrames: [],
          switchingTable: SwitchingTable.build(),
        },
      }),
      from: Switch,
      tick(e) {
        const device = SimulationRegistry.fromChain<Switch>(
          [e],
        );

        SimulationRegistry.behaviours.dataLink(e);
        device.forward();
        SimulationRegistry.behaviours.entity(e);
      },
    });
  }

  override removePort(portId: string) {
    const switchingTable = {
      ...this.details.switchingTable,
    };
    SwitchingTable.removePort(switchingTable, portId);
    const removedPort = super.removePort(portId);
    this.details = { ...this.details, switchingTable };
    return removedPort;
  }

  forward() {
    for (const { portId, frame } of this.receive()) {
      switch (this.port(portId).frameFormat) {
        case EthernetFrame.FORMAT:
          break;
        default:
          this.queueExcept(portId, frame);
          continue;
      }

      const ethernetFrame =
        EthernetFrame.deserialize(frame);

      SwitchingTable.learn(
        this.details.switchingTable,
        ethernetFrame.source,
        portId,
      );

      const destinationPortId = SwitchingTable.get(
        this.details.switchingTable,
        ethernetFrame.destination,
      );

      if (
        destinationPortId === undefined ||
        MacAddress.isBroadcast(ethernetFrame.destination)
      ) {
        this.queueExcept(portId, frame);
      } else if (destinationPortId !== portId) {
        this.queue(destinationPortId, frame);
      }
    }
  }
}

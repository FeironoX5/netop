import { DeviceCategory } from '@netop/types';
import { DataLinkPort } from '@simulation/details/data-link/DataLinkPort';
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
        details: {
          macAddress: MacAddress.generate(),
          ports: Array.from({ length: 4 }, () =>
            DataLinkPort.build(EthernetFrame.FORMAT),
          ),
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

  override removePort(port: number) {
    const removedPort = super.removePort(port);
    SwitchingTable.removePort(
      this.details.switchingTable,
      port,
    );
    return removedPort;
  }

  forward() {
    for (const { port, frame } of this.receive()) {
      switch (this.ports(port).frameFormat) {
        case EthernetFrame.FORMAT:
          break;
        default:
          this.queueExcept(port, frame);
          continue;
      }

      const ethernetFrame =
        EthernetFrame.deserialize(frame);

      SwitchingTable.learn(
        this.details.switchingTable,
        ethernetFrame.source,
        port,
      );

      const destinationPort = SwitchingTable.get(
        this.details.switchingTable,
        ethernetFrame.destination,
      );

      if (
        destinationPort === undefined ||
        MacAddress.isBroadcast(ethernetFrame.destination)
      ) {
        this.queueExcept(port, frame);
      } else if (destinationPort !== port) {
        this.queue(destinationPort, frame);
      }
    }
  }
}

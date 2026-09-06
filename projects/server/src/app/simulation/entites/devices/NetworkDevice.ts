import { NetworkInterface } from '@simulation/details/network/NetworkInterface';
import { RoutingTable } from '@simulation/details/network/RoutingTable';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import { SimulationEntity } from '../SimulationEntity';
import type { FrameFormat } from './DataLinkDevice';
import type { NetworkCard } from './NetworkCard';

export type NetworkDeviceDetails = {
  networkInterfaces: NetworkInterface.type[];
  routingTable: RoutingTable.type;
};

export abstract class NetworkDevice<
  Details extends NetworkDeviceDetails =
    NetworkDeviceDetails,
> extends SimulationEntity<Details> {
  get networkInterfaces() {
    return this.details.networkInterfaces;
  }

  get networkCard() {
    return SimulationRegistry.fromChain<NetworkCard>([
      this.entity,
      this.children[0]!,
    ]);
  }

  get routingTable() {
    return this.details.routingTable;
  }

  addInterface(frameFormat: FrameFormat) {
    const networkInterface = NetworkInterface.build(
      this.networkCard.addPort(frameFormat),
    );
    this.networkInterfaces.push(networkInterface);
    return networkInterface;
  }
}

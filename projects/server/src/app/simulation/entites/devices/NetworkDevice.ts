import { IpAddress } from '@simulation/details/network/IpAddress';
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

  removeInterface(port: number) {
    this.networkCard.removePort(port);
    RoutingTable.removePort(this.routingTable, port);
    return NetworkInterface.remove(
      this.networkInterfaces,
      port,
    );
  }

  configureInterface(
    port: number,
    ipAddress: IpAddress.type,
    subnetMask: IpAddress.type,
  ) {
    const networkInterface = this.networkInterfaces.find(
      (networkInterface) => networkInterface.port === port,
    )!;
    networkInterface.ipAddress = ipAddress;
    networkInterface.subnetMask = subnetMask;
  }

  addRoute(route: RoutingTable.Entry) {
    RoutingTable.add(this.routingTable, route);
  }

  removeRoute(index: number) {
    return RoutingTable.remove(this.routingTable, index);
  }
}

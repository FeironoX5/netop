import { IpAddress } from '@simulation/details/network/IpAddress';
import { NetworkInterface } from '@simulation/details/network/NetworkInterface';
import { RoutingTable } from '@simulation/details/network/RoutingTable';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import type { FrameFormat } from '../ports/DataLinkPort';
import { SimulationEntity } from '../SimulationEntity';
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
      this.networkCard.addPort(frameFormat).id,
    );
    this.details = {
      ...this.details,
      networkInterfaces: [
        ...this.networkInterfaces,
        networkInterface,
      ],
    };
    return networkInterface;
  }

  removeInterface(portId: string) {
    const networkInterfaces = [...this.networkInterfaces];
    const routingTable = [...this.routingTable];

    const networkInterface = NetworkInterface.remove(
      networkInterfaces,
      portId,
    );
    RoutingTable.removePort(routingTable, portId);
    SimulationRegistry.get().removePort(
      this.networkCard,
      portId,
    );
    this.details = {
      ...this.details,
      networkInterfaces,
      routingTable,
    };
    return networkInterface;
  }

  configureInterface(
    portId: string,
    ipAddress: IpAddress.type,
    subnetMask: IpAddress.type,
  ) {
    const networkInterface = this.networkInterfaces.find(
      (networkInterface) =>
        networkInterface.portId === portId,
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

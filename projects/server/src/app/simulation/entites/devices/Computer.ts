import { DeviceCategory } from '@netop/types';
import { Ipv4Packet } from '@simulation/details/network/Ipv4Packet';
import { NetworkInterface } from '@simulation/details/network/NetworkInterface';
import { RoutingTable } from '@simulation/details/network/RoutingTable';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import {
  NetworkDevice,
  NetworkDeviceDetails,
} from './NetworkDevice';

export type ComputerDetails = NetworkDeviceDetails;

export class Computer extends NetworkDevice<ComputerDetails> {
  static override ALLOWED_CHILD_CATEGORIES = [];

  static {
    SimulationRegistry.setManager(DeviceCategory.COMPUTER, {
      build: (id, name) => ({
        id,
        category: DeviceCategory.COMPUTER,
        name,
        children: [
          SimulationRegistry.getManager(
            DeviceCategory.NETWORK_CARD,
          ).build(crypto.randomUUID()),
        ],
        details: {
          networkInterfaces: [NetworkInterface.build(0)],
          routingTable: RoutingTable.build(),
        },
      }),
      from: Computer,
      tick(e) {
        SimulationRegistry.behaviours.arp(e);
        SimulationRegistry.behaviours.networkOutput(e);
        SimulationRegistry.behaviours.entity(e);
        SimulationRegistry.behaviours.networkInput(e);
      },
    });
  }

  sendPacket(packet: Ipv4Packet.type) {
    const route = RoutingTable.resolve(
      this.routingTable,
      this.networkInterfaces,
      packet.destination,
    )!;

    this.networkInterfaces
      .find(({ port }) => port === route.port)!
      .outgoingPackets.push({
        packet,
        nextHop: route.nextHop,
      });
  }

  receivePackets() {
    return this.networkInterfaces.flatMap(
      ({ receivedPackets }) => receivedPackets.splice(0),
    );
  }
}

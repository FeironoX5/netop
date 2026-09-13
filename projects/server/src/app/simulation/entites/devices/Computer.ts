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
      build: (id, name) => {
        const networkCard = SimulationRegistry.getManager(
          DeviceCategory.NETWORK_CARD,
        ).build(crypto.randomUUID());
        return {
          id,
          category: DeviceCategory.COMPUTER,
          name,
          children: [networkCard],
          details: {
            networkInterfaces: [
              NetworkInterface.build(
                networkCard.children![0]!.id,
              ),
            ],
            routingTable: RoutingTable.build(),
          },
        };
      },
      from: Computer,
      tick(e) {
        SimulationRegistry.behaviours.arp(e);
        SimulationRegistry.behaviours.networkOutput(e);
        SimulationRegistry.behaviours.entity(e);
        SimulationRegistry.behaviours.networkInput(e);
      },
    });
  }

  sendPacket(
    destination: Ipv4Packet.type['destination'],
    protocol: Ipv4Packet.Protocol,
    payload: number[],
  ) {
    const route = RoutingTable.resolve(
      this.routingTable,
      this.networkInterfaces,
      destination,
    )!;

    const networkInterface = this.networkInterfaces.find(
      ({ portId }) => portId === route.portId,
    )!;
    networkInterface.outgoingPackets.push({
      packet: {
        source: networkInterface.ipAddress,
        destination,
        ttl: Ipv4Packet.DEFAULT_TTL,
        protocol,
        payload,
      },
      nextHop: route.nextHop,
    });
  }

  receivePackets() {
    return this.networkInterfaces.flatMap(
      ({ receivedPackets }) => receivedPackets.splice(0),
    );
  }
}

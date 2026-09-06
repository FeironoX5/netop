import { DeviceCategory } from '@netop/types';
import { EthernetFrame } from '@simulation/details/data-link/EthernetFrame';
import { IpAddress } from '@simulation/details/network/IpAddress';
import { NetworkInterface } from '@simulation/details/network/NetworkInterface';
import { RoutingTable } from '@simulation/details/network/RoutingTable';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import {
  NetworkDevice,
  NetworkDeviceDetails,
} from './NetworkDevice';

export type RouterDetails = NetworkDeviceDetails;

export class Router extends NetworkDevice<RouterDetails> {
  static override ALLOWED_CHILD_CATEGORIES = [];

  static {
    SimulationRegistry.setManager(DeviceCategory.ROUTER, {
      build: (id, name) => ({
        id,
        category: DeviceCategory.ROUTER,
        name,
        children: [
          SimulationRegistry.getManager(
            DeviceCategory.NETWORK_CARD,
          ).build(
            crypto.randomUUID(),
            '',
            EthernetFrame.FORMAT,
            EthernetFrame.FORMAT,
          ),
        ],
        details: {
          networkInterfaces: [
            NetworkInterface.build(0),
            NetworkInterface.build(1),
          ],
          routingTable: RoutingTable.build(),
        },
      }),
      from: Router,
      tick(e) {
        const router = SimulationRegistry.fromChain<Router>(
          [e],
        );

        SimulationRegistry.behaviours.arp(e);
        SimulationRegistry.behaviours.networkOutput(e);
        SimulationRegistry.behaviours.entity(e);
        SimulationRegistry.behaviours.networkInput(e);
        router.forward();
      },
    });
  }

  forward() {
    for (const networkInterface of this.networkInterfaces) {
      for (const packet of networkInterface.receivedPackets.splice(
        0,
      )) {
        if (
          this.networkInterfaces.some(({ ipAddress }) =>
            IpAddress.equals(ipAddress, packet.destination),
          ) ||
          packet.ttl <= 1
        )
          continue;

        const route = RoutingTable.resolve(
          this.routingTable,
          this.networkInterfaces,
          packet.destination,
        )!;

        this.networkInterfaces
          .find(({ port }) => port === route.port)!
          .outgoingPackets.push({
            packet: { ...packet, ttl: packet.ttl - 1 },
            nextHop: route.nextHop,
          });
      }
    }
  }
}

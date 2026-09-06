import { DeviceCategory } from '@netop/types';
import { ArpMessage } from '@simulation/details/ArpMessage';
import { ArpTable } from '@simulation/details/ArpTable';
import { EthernetFrame } from '@simulation/details/EthernetFrame';
import { IpAddress } from '@simulation/details/IpAddress';
import { Ipv4Packet } from '@simulation/details/Ipv4Packet';
import { MacAddress } from '@simulation/details/MacAddress';
import { NetworkInterface } from '@simulation/details/NetworkInterface';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import { SimulationEntity } from '../SimulationEntity';
import type { NetworkCard } from './NetworkCard';

export type ComputerDetails = {
  networkInterface: NetworkInterface.type;
};

export class Computer extends SimulationEntity<ComputerDetails> {
  static override ALLOWED_CHILD_CATEGORIES = [
    DeviceCategory.NETWORK_CARD,
  ];

  static {
    SimulationRegistry.setManager(DeviceCategory.COMPUTER, {
      build: (id, name) => ({
        id,
        category: DeviceCategory.COMPUTER,
        name,
        details: {
          networkInterface: NetworkInterface.build(),
        },
      }),
      from: Computer,
      tick(e) {
        const computer =
          SimulationRegistry.fromChain<Computer>([e]);

        computer.processArp();
        computer.output();
        SimulationRegistry.behaviours.entity(e);
        computer.input();
      },
    });
  }

  get networkInterface() {
    return this.details.networkInterface;
  }

  get networkCard() {
    const networkCard = this.children[0]!;
    return SimulationRegistry.fromChain<NetworkCard>([
      this.entity,
      networkCard,
    ]);
  }

  sendPacket(packet: Ipv4Packet.type) {
    this.networkInterface.outgoingPackets.push(packet);
  }

  receivePackets() {
    return this.networkInterface.receivedPackets.splice(0);
  }

  processArp() {
    const { networkCard, networkInterface } = this;

    for (const message of networkInterface.receivedArpMessages.splice(
      0,
    )) {
      ArpTable.learn(
        networkInterface.arpTable,
        message.senderIpAddress,
        message.senderMacAddress,
      );

      if (
        message.operation ===
          ArpMessage.Operation.REQUEST &&
        IpAddress.equals(
          message.targetIpAddress,
          networkInterface.ipAddress,
        )
      ) {
        networkCard.transmit(
          message.senderMacAddress,
          EthernetFrame.EtherType.ARP,
          ArpMessage.serialize({
            operation: ArpMessage.Operation.REPLY,
            senderMacAddress: networkCard.macAddress,
            senderIpAddress: networkInterface.ipAddress,
            targetMacAddress: message.senderMacAddress,
            targetIpAddress: message.senderIpAddress,
          }),
        );
      }
    }
  }

  output() {
    const { networkCard, networkInterface } = this;

    for (const packet of networkInterface.outgoingPackets.splice(
      0,
    )) {
      const destinationMacAddress = ArpTable.get(
        networkInterface.arpTable,
        packet.destination,
      );

      if (!destinationMacAddress) {
        networkInterface.outgoingPackets.push(packet);

        if (destinationMacAddress === undefined) {
          ArpTable.request(
            networkInterface.arpTable,
            packet.destination,
          );
          networkCard.transmit(
            MacAddress.BROADCAST,
            EthernetFrame.EtherType.ARP,
            ArpMessage.serialize({
              operation: ArpMessage.Operation.REQUEST,
              senderMacAddress: networkCard.macAddress,
              senderIpAddress: networkInterface.ipAddress,
              targetIpAddress: packet.destination,
            }),
          );
        }

        continue;
      }

      networkCard.transmit(
        destinationMacAddress,
        EthernetFrame.EtherType.IPV4,
        Ipv4Packet.serialize(packet),
      );
    }
  }

  input() {
    const { networkCard, networkInterface } = this;

    for (const { frame } of networkCard.receive()) {
      if (
        frame.etherType === EthernetFrame.EtherType.IPV4
      ) {
        networkInterface.receivedPackets.push(
          Ipv4Packet.deserialize(frame.payload),
        );
      } else if (
        frame.etherType === EthernetFrame.EtherType.ARP
      ) {
        networkInterface.receivedArpMessages.push(
          ArpMessage.deserialize(frame.payload),
        );
      }
    }
  }
}

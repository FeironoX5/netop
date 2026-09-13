import { ArpMessage } from '../data-link/ArpMessage';
import { ArpTable } from '../data-link/ArpTable';
import { IpAddress } from './IpAddress';
import { Ipv4Packet } from './Ipv4Packet';

export namespace NetworkInterface {
  export type OutgoingPacket = {
    packet: Ipv4Packet.type;
    nextHop: IpAddress.type;
  };

  export type type = {
    portId: string;
    ipAddress: IpAddress.type;
    subnetMask: IpAddress.type;
    arpTable: ArpTable.type;
    outgoingPackets: OutgoingPacket[];
    receivedPackets: Ipv4Packet.type[];
    receivedArpMessages: ArpMessage.type[];
  };

  export function build(portId: string): type {
    return {
      portId,
      ipAddress: IpAddress.generate(),
      subnetMask: IpAddress.generate(),
      arpTable: ArpTable.build(),
      outgoingPackets: [],
      receivedPackets: [],
      receivedArpMessages: [],
    };
  }

  export function remove(
    networkInterfaces: type[],
    portId: string,
  ): type {
    return networkInterfaces.splice(
      networkInterfaces.findIndex(
        (networkInterface) =>
          networkInterface.portId === portId,
      ),
      1,
    )[0]!;
  }
}

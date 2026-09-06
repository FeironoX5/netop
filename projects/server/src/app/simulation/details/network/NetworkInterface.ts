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
    port: number;
    ipAddress: IpAddress.type;
    subnetMask: IpAddress.type;
    arpTable: ArpTable.type;
    outgoingPackets: OutgoingPacket[];
    receivedPackets: Ipv4Packet.type[];
    receivedArpMessages: ArpMessage.type[];
  };

  export function build(port: number): type {
    return {
      port,
      ipAddress: IpAddress.generate(),
      subnetMask: IpAddress.generate(),
      arpTable: ArpTable.build(),
      outgoingPackets: [],
      receivedPackets: [],
      receivedArpMessages: [],
    };
  }
}

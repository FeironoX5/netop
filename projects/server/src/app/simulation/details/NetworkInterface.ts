import { ArpMessage } from './ArpMessage';
import { ArpTable } from './ArpTable';
import { IpAddress } from './IpAddress';
import { Ipv4Packet } from './Ipv4Packet';

export namespace NetworkInterface {
  export type type = {
    ipAddress: IpAddress.type;
    subnetMask: IpAddress.type;
    arpTable: ArpTable.type;
    outgoingPackets: Ipv4Packet.type[];
    receivedPackets: Ipv4Packet.type[];
    receivedArpMessages: ArpMessage.type[];
  };

  export function build(): type {
    return {
      ipAddress: IpAddress.generate(),
      subnetMask: IpAddress.generate(),
      arpTable: ArpTable.build(),
      outgoingPackets: [],
      receivedPackets: [],
      receivedArpMessages: [],
    };
  }
}

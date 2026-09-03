import { ArpMessage } from './ArpMessage';
import { IpAddress } from './IpAddress';
import { Ipv4Packet } from './Ipv4Packet';
import { MacAddress } from './MacAddress';

export namespace NetworkInterface {
  export type ResolvedPacket = {
    destinationMacAddress: MacAddress.type;
    packet: Ipv4Packet.type;
  };

  export type type = {
    ipAddress: IpAddress.type;
    subnetMask: IpAddress.type;
    arpCache: Record<string, MacAddress.type>;
    outgoingPackets: ResolvedPacket[];
    receivedPackets: Ipv4Packet.type[];
    receivedArpMessages: ArpMessage.type[];
  };

  export function build(): type {
    return {
      ipAddress: IpAddress.generate(),
      subnetMask: IpAddress.generate(),
      arpCache: {},
      outgoingPackets: [],
      receivedPackets: [],
      receivedArpMessages: [],
    };
  }
}

import { IpAddress } from './IpAddress';

export namespace Ipv4Packet {
  export enum Protocol {
    TCP = 6,
    UDP = 17,
  }

  export const DEFAULT_TTL = 64;

  export type type = {
    source: IpAddress.type;
    destination: IpAddress.type;
    ttl: number;
    protocol: Protocol;
    payload: number[];
  };

  const VERSION_AND_HEADER_LENGTH = 0x45;
  const HEADER_LENGTH = 20;
  const CHECKSUM_OFFSET = 10;

  function checksum(bytes: readonly number[]): number {
    let sum = 0;

    for (let index = 0; index < bytes.length; index += 2) {
      sum += (bytes[index] << 8) | bytes[index + 1];
    }

    while (sum > 0xffff) {
      sum = (sum & 0xffff) + (sum >> 16);
    }

    return ~sum & 0xffff;
  }

  export function serialize(packet: type): number[] {
    const totalLength =
      HEADER_LENGTH + packet.payload.length;
    const header = [
      VERSION_AND_HEADER_LENGTH,
      0,
      totalLength >> 8,
      totalLength & 0xff,
      0,
      0,
      0,
      0,
      packet.ttl,
      packet.protocol,
      0,
      0,
      ...packet.source,
      ...packet.destination,
    ];
    const headerChecksum = checksum(header);
    header[CHECKSUM_OFFSET] = headerChecksum >> 8;
    header[CHECKSUM_OFFSET + 1] = headerChecksum & 0xff;

    return [...header, ...packet.payload];
  }

  export function deserialize(
    bytes: readonly number[],
  ): type {
    const headerLength = (bytes[0] & 0x0f) * 4;
    const totalLength = (bytes[2] << 8) | bytes[3];

    return {
      source: bytes.slice(12, 16),
      destination: bytes.slice(16, 20),
      ttl: bytes[8],
      protocol: bytes[9] as Protocol,
      payload: bytes.slice(headerLength, totalLength),
    };
  }
}

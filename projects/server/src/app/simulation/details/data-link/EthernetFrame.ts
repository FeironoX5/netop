import { MacAddress } from './MacAddress';

export namespace EthernetFrame {
  export const FORMAT = 'ethernet';
  export const START_FRAME_DELIMITER = 0xd5;

  export enum EtherType {
    IPV4 = 0x0800,
    ARP = 0x0806,
  }

  const ADDRESS_LENGTH = 6;
  const ETHER_TYPE_LENGTH = 2;
  const LENGTH_FIELD_LENGTH = 2;
  const HEADER_LENGTH =
    1 +
    ADDRESS_LENGTH * 2 +
    ETHER_TYPE_LENGTH +
    LENGTH_FIELD_LENGTH;
  const ETHER_TYPE_OFFSET = 1 + ADDRESS_LENGTH * 2;
  const LENGTH_FIELD_OFFSET =
    ETHER_TYPE_OFFSET + ETHER_TYPE_LENGTH;

  export type type = {
    destination: MacAddress.type;
    source: MacAddress.type;
    etherType: EtherType;
    payload: number[];
  };

  export function serialize(frame: type): number[] {
    const payloadLength = frame.payload.length;

    return [
      START_FRAME_DELIMITER,
      ...frame.destination,
      ...frame.source,
      frame.etherType >> 8,
      frame.etherType & 0xff,
      payloadLength >> 8,
      payloadLength & 0xff,
      ...frame.payload,
    ];
  }

  export function byteLength(
    bytes: readonly number[],
  ): number | undefined {
    if (bytes.length < HEADER_LENGTH) return;

    return (
      HEADER_LENGTH +
      ((bytes[LENGTH_FIELD_OFFSET] << 8) |
        bytes[LENGTH_FIELD_OFFSET + 1])
    );
  }

  export function start(bytes: readonly number[]): number {
    return bytes.indexOf(START_FRAME_DELIMITER);
  }

  export function deserialize(
    bytes: readonly number[],
  ): type {
    return {
      destination: bytes.slice(1, 7),
      source: bytes.slice(7, 13),
      etherType:
        (bytes[ETHER_TYPE_OFFSET] << 8) |
        bytes[ETHER_TYPE_OFFSET + 1],
      payload: bytes.slice(HEADER_LENGTH),
    };
  }
}

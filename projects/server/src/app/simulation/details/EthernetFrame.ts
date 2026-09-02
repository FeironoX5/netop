import { Bit } from './Bit';
import { MacAddress } from './MacAddress';

export namespace EthernetFrame {
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

  export function serialize(frame: type): Bit.type[] {
    const payloadLength = frame.payload.length;

    return Bit.fromBytes([
      START_FRAME_DELIMITER,
      ...frame.destination,
      ...frame.source,
      frame.etherType >> 8,
      frame.etherType & 0xff,
      payloadLength >> 8,
      payloadLength & 0xff,
      ...frame.payload,
    ]);
  }

  export function read(
    stream: Bit.type[],
  ): type | undefined {
    const headerBitLength = HEADER_LENGTH * 8;
    if (stream.length < headerBitLength) return;

    const header = Bit.toBytes(
      stream.slice(0, headerBitLength),
    );
    if (header[0] !== START_FRAME_DELIMITER) return;

    const etherType =
      (header[ETHER_TYPE_OFFSET] << 8) |
      header[ETHER_TYPE_OFFSET + 1];
    const payloadLength =
      (header[LENGTH_FIELD_OFFSET] << 8) |
      header[LENGTH_FIELD_OFFSET + 1];
    const frameBitLength =
      (HEADER_LENGTH + payloadLength) * 8;
    if (stream.length < frameBitLength) return;

    const bytes = Bit.toBytes(
      stream.splice(0, frameBitLength),
    );

    return {
      destination: bytes.slice(1, 7),
      source: bytes.slice(7, 13),
      etherType,
      payload: bytes.slice(HEADER_LENGTH),
    };
  }
}

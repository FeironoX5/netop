import { EthernetFrame } from './EthernetFrame';
import { IpAddress } from './IpAddress';
import { MacAddress } from './MacAddress';

export namespace ArpMessage {
  export enum Operation {
    REQUEST = 1,
    REPLY = 2,
  }

  export type Request = {
    operation: Operation.REQUEST;
    senderMacAddress: MacAddress.type;
    senderIpAddress: IpAddress.type;
    targetIpAddress: IpAddress.type;
  };

  export type Reply = {
    operation: Operation.REPLY;
    senderMacAddress: MacAddress.type;
    senderIpAddress: IpAddress.type;
    targetMacAddress: MacAddress.type;
    targetIpAddress: IpAddress.type;
  };

  export type type = Request | Reply;

  const HARDWARE_TYPE_ETHERNET = 1;
  const HARDWARE_ADDRESS_LENGTH = 6;
  const PROTOCOL_ADDRESS_LENGTH = 4;
  const EMPTY_MAC_ADDRESS = Array.from(
    { length: HARDWARE_ADDRESS_LENGTH },
    () => 0,
  );

  export function serialize(message: type): number[] {
    const targetMacAddress =
      message.operation === Operation.REPLY
        ? message.targetMacAddress
        : EMPTY_MAC_ADDRESS;

    return [
      HARDWARE_TYPE_ETHERNET >> 8,
      HARDWARE_TYPE_ETHERNET & 0xff,
      EthernetFrame.EtherType.IPV4 >> 8,
      EthernetFrame.EtherType.IPV4 & 0xff,
      HARDWARE_ADDRESS_LENGTH,
      PROTOCOL_ADDRESS_LENGTH,
      message.operation >> 8,
      message.operation & 0xff,
      ...message.senderMacAddress,
      ...message.senderIpAddress,
      ...targetMacAddress,
      ...message.targetIpAddress,
    ];
  }

  export function deserialize(
    bytes: readonly number[],
  ): type {
    const operation = (bytes[6] << 8) | bytes[7];
    const senderMacAddress = bytes.slice(8, 14);
    const senderIpAddress = bytes.slice(14, 18);
    const targetMacAddress = bytes.slice(18, 24);
    const targetIpAddress = bytes.slice(24, 28);

    if (operation === Operation.REQUEST) {
      return {
        operation,
        senderMacAddress,
        senderIpAddress,
        targetIpAddress,
      };
    }

    return {
      operation: Operation.REPLY,
      senderMacAddress,
      senderIpAddress,
      targetMacAddress,
      targetIpAddress,
    };
  }
}

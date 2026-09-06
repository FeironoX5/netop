import { IpAddress } from '../network/IpAddress';
import { MacAddress } from './MacAddress';

export namespace ArpTable {
  // null means that address resolution is already in progress
  export type type = Record<string, MacAddress.type | null>;

  export function build(): type {
    return {};
  }

  export function get(
    table: type,
    ip: IpAddress.type,
  ): MacAddress.type | null | undefined {
    return table[IpAddress.toString(ip)];
  }

  export function request(
    table: type,
    ip: IpAddress.type,
  ): void {
    table[IpAddress.toString(ip)] = null;
  }

  export function learn(
    table: type,
    ip: IpAddress.type,
    mac: MacAddress.type,
  ): void {
    table[IpAddress.toString(ip)] = mac;
  }
}

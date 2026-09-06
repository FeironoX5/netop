import { MacAddress } from './MacAddress';

export namespace SwitchingTable {
  export type type = Record<string, number>;

  export function build(): type {
    return {};
  }

  export function get(
    table: type,
    mac: MacAddress.type,
  ): number | undefined {
    return table[MacAddress.toString(mac)];
  }

  export function learn(
    table: type,
    mac: MacAddress.type,
    port: number,
  ): void {
    table[MacAddress.toString(mac)] = port;
  }
}

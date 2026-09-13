import { MacAddress } from './MacAddress';

export namespace SwitchingTable {
  export type type = Record<string, string>;

  export function build(): type {
    return {};
  }

  export function get(
    table: type,
    mac: MacAddress.type,
  ): string | undefined {
    return table[MacAddress.toString(mac)];
  }

  export function learn(
    table: type,
    mac: MacAddress.type,
    portId: string,
  ): void {
    table[MacAddress.toString(mac)] = portId;
  }

  export function removePort(
    table: type,
    portId: string,
  ): void {
    Object.entries(table).forEach(
      ([macAddress, entryPortId]) => {
        if (entryPortId === portId)
          delete table[macAddress];
      },
    );
  }
}

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

  export function removePort(
    table: type,
    port: number,
  ): void {
    Object.entries(table).forEach(
      ([macAddress, entryPort]) => {
        if (entryPort === port) delete table[macAddress];
        else if (entryPort > port)
          table[macAddress] = entryPort - 1;
      },
    );
  }
}

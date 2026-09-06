import { IpAddress } from './IpAddress';
import type { NetworkInterface } from './NetworkInterface';

export namespace RoutingTable {
  export type Entry = {
    network: IpAddress.type;
    subnetMask: IpAddress.type;
    port: number;
    nextHop?: IpAddress.type;
  };

  export type type = Entry[];

  export function build(): type {
    return [];
  }

  export function add(table: type, route: Entry): void {
    table.push(route);
  }

  export function remove(
    table: type,
    index: number,
  ): Entry {
    return table.splice(index, 1)[0]!;
  }

  export function removePort(
    table: type,
    port: number,
  ): void {
    for (
      let index = table.length - 1;
      index >= 0;
      index--
    ) {
      if (table[index]!.port === port)
        table.splice(index, 1);
      else if (table[index]!.port > port)
        table[index]!.port -= 1;
    }
  }

  export function resolve(
    table: type,
    networkInterfaces: NetworkInterface.type[],
    destination: IpAddress.type,
  ): { port: number; nextHop: IpAddress.type } | undefined {
    const route = [
      ...table,
      ...networkInterfaces.map(
        ({ ipAddress, subnetMask, port }): Entry => ({
          network: ipAddress,
          subnetMask,
          port,
        }),
      ),
    ]
      .filter(({ network, subnetMask }) =>
        IpAddress.isInSubnet(
          destination,
          network,
          subnetMask,
        ),
      )
      .sort(
        (left, right) =>
          prefixLength(right.subnetMask) -
          prefixLength(left.subnetMask),
      )[0];

    if (route)
      return {
        port: route.port,
        nextHop: route.nextHop || destination,
      };
  }

  function prefixLength(
    subnetMask: IpAddress.type,
  ): number {
    return subnetMask.reduce(
      (length, byte) =>
        length +
        byte.toString(2).replaceAll('0', '').length,
      0,
    );
  }
}

import { IpAddress } from './IpAddress';
import type { NetworkInterface } from './NetworkInterface';

export namespace RoutingTable {
  export type Entry = {
    network: IpAddress.type;
    subnetMask: IpAddress.type;
    portId: string;
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
    portId: string,
  ): void {
    for (
      let index = table.length - 1;
      index >= 0;
      index--
    ) {
      if (table[index]!.portId === portId)
        table.splice(index, 1);
    }
  }

  export function resolve(
    table: type,
    networkInterfaces: NetworkInterface.type[],
    destination: IpAddress.type,
  ):
    | { portId: string; nextHop: IpAddress.type }
    | undefined {
    const route = [
      ...table,
      ...networkInterfaces.map(
        ({ ipAddress, subnetMask, portId }): Entry => ({
          network: ipAddress,
          subnetMask,
          portId,
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
        portId: route.portId,
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

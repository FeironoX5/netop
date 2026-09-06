export namespace IpAddress {
  export type type = number[];

  export function toString(ip: type): string {
    return [...ip]
      .map((byte) => byte.toString(10))
      .join('.');
  }

  export function generate(): type {
    return Array.from({ length: 4 }, () => 0);
  }

  export function equals(
    left: readonly number[],
    right: readonly number[],
  ): boolean {
    return left.every(
      (byte, index) => byte === right[index],
    );
  }

  export function isInSubnet(
    ip: type,
    network: type,
    subnetMask: type,
  ): boolean {
    return ip.every(
      (byte, index) =>
        (byte & subnetMask[index]) ===
        (network[index] & subnetMask[index]),
    );
  }
}

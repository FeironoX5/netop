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
}

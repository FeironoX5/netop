export namespace IpAddress {
  /**
   * Must be a number between 0 and 2^24-1 stored as a Uint8Array of length 4
   */
  export type type = Uint8Array;

  export function toString(ip: type): string {
    return [...ip].map((byte) => byte.toString(10)).join('.');
  }

  export function generate(): type {
    return Uint8Array.from({ length: 4 }, () => 0);
  }
}

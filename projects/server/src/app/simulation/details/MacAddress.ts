export namespace MacAddress {
  /**
   * Must be a number between 0 and 2^48-1 stored as a Uint8Array of length 6
   */
  export type type = Uint8Array;

  export function toString(mac: type): string {
    return [...mac]
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join(':');
  }

  export function generate(): type {
    return Uint8Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 256),
    );
  }
}

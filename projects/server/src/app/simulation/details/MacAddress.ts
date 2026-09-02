export namespace MacAddress {
  export type type = number[];

  export const BROADCAST: type = Array.from(
    { length: 6 },
    () => 0xff,
  );

  export function toString(mac: type): string {
    return [...mac]
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join(':');
  }

  export function generate(): type {
    return Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 256),
    );
  }

  export function equals(
    left: readonly number[],
    right: readonly number[],
  ): boolean {
    return left.every(
      (byte, index) => byte === right[index],
    );
  }

  export function isBroadcast(
    mac: readonly number[],
  ): boolean {
    return equals(mac, BROADCAST);
  }
}

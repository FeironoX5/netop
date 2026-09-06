export namespace Bit {
  export type type = 0 | 1;

  export function fromBytes(
    bytes: readonly number[],
  ): type[] {
    return bytes.flatMap((byte) =>
      Array.from({ length: 8 }, (_, index) =>
        ((byte >> (7 - index)) & 1) === 0 ? 0 : 1,
      ),
    );
  }

  export function toBytes(bits: readonly type[]): number[] {
    return Array.from(
      { length: bits.length / 8 },
      (_, byteIndex) =>
        bits
          .slice(byteIndex * 8, byteIndex * 8 + 8)
          .reduce<number>(
            (byte, bit) => (byte << 1) | bit,
            0,
          ),
    );
  }
}

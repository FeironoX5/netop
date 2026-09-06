export namespace SlipFrame {
  export const FORMAT = 'slip';
  export const END = 0xc0;

  const ESC = 0xdb;
  const ESC_END = 0xdc;
  const ESC_ESC = 0xdd;

  export type type = { payload: number[] };

  export function serialize(frame: type): number[] {
    return [
      END,
      ...frame.payload.flatMap((byte) => {
        switch (byte) {
          case END:
            return [ESC, ESC_END];
          case ESC:
            return [ESC, ESC_ESC];
          default:
            return byte;
        }
      }),
      END,
    ];
  }

  export function byteLength(
    bytes: readonly number[],
  ): number | undefined {
    const end = bytes.indexOf(END, 1);
    if (end !== -1) return end + 1;
  }

  export function start(bytes: readonly number[]): number {
    return bytes.indexOf(END);
  }

  export function deserialize(
    bytes: readonly number[],
  ): type {
    const payload: number[] = [];
    for (let i = 1; i < bytes.length - 1; i += 1) {
      if (bytes[i] !== ESC) {
        payload.push(bytes[i]);
        continue;
      }

      i += 1;
      switch (bytes[i]) {
        case ESC_END:
          payload.push(END);
          break;
        case ESC_ESC:
          payload.push(ESC);
          break;
      }
    }

    return { payload };
  }
}

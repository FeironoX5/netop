import { Bit } from './Bit';

export namespace PortBuffer {
  export type type = { in: Bit.type[]; out: Bit.type[] };

  export function build(): type {
    return { in: [], out: [] };
  }
}

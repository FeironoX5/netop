import { PortBuffer } from '../physical/PortBuffer';

export namespace DataLinkPort {
  export type type<FrameFormat extends string = string> =
    PortBuffer.type & { frameFormat: FrameFormat };

  export function build<FrameFormat extends string>(
    frameFormat: FrameFormat,
  ): type<FrameFormat> {
    return { ...PortBuffer.build(), frameFormat };
  }
}

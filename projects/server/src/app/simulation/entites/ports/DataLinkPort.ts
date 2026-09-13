import { PortCategory } from '@netop/types';
import { EthernetFrame } from '@simulation/details/data-link/EthernetFrame';
import { SlipFrame } from '@simulation/details/data-link/SlipFrame';
import { PortBuffer } from '@simulation/details/physical/PortBuffer';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import {
  PhysicalPort,
  PhysicalPortDetails,
} from './PhysicalPort';

export type DataLinkPortDetails = PhysicalPortDetails & {
  frameFormat: FrameFormat;
};

export type FrameFormat =
  | typeof EthernetFrame.FORMAT
  | typeof SlipFrame.FORMAT;

export class DataLinkPort extends PhysicalPort<DataLinkPortDetails> {
  static override ALLOWED_CHILD_CATEGORIES = [];

  static {
    SimulationRegistry.setManager(PortCategory.DATA_LINK, {
      build: (id, frameFormat = EthernetFrame.FORMAT) => ({
        id,
        category: PortCategory.DATA_LINK,
        details: {
          ...PortBuffer.build(),
          frameFormat: frameFormat as FrameFormat,
        },
      }),
      from: DataLinkPort,
      tick() {},
    });
  }

  get frameFormat() {
    return this.details.frameFormat;
  }
}

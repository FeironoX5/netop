import { PortCategory } from '@netop/types';
import { EthernetFrame } from '@simulation/details/data-link/EthernetFrame';
import { MacAddress } from '@simulation/details/data-link/MacAddress';
import { SlipFrame } from '@simulation/details/data-link/SlipFrame';
import { Bit } from '@simulation/details/physical/Bit';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import {
  DataLinkPort,
  FrameFormat,
} from '../ports/DataLinkPort';
import { PhysicalDevice } from './PhysicalDevice';

const FRAME_DETAILS = {
  [EthernetFrame.FORMAT]: EthernetFrame,
  [SlipFrame.FORMAT]: SlipFrame,
};

export type PortFrame = { portId: string; frame: number[] };

export type DataLinkDetails = {
  macAddress: MacAddress.type;
  receivedFrames: PortFrame[];
};

export abstract class DataLinkDevice<
  Details extends DataLinkDetails = DataLinkDetails,
> extends PhysicalDevice<
  Details,
  DataLinkPort,
  [frameFormat?: FrameFormat]
> {
  static override ALLOWED_CHILD_CATEGORIES = [
    PortCategory.DATA_LINK,
  ];

  get macAddress() {
    return this.details.macAddress;
  }

  get receivedFrames() {
    return this.details.receivedFrames;
  }

  protected override buildPort(
    id: string,
    frameFormat: FrameFormat = EthernetFrame.FORMAT,
  ) {
    return SimulationRegistry.getManager(
      PortCategory.DATA_LINK,
    ).build(id, frameFormat);
  }

  override removePort(portId: string) {
    const removedPort = super.removePort(portId);
    for (
      let index = this.receivedFrames.length - 1;
      index >= 0;
      index--
    ) {
      const receivedFrame = this.receivedFrames[index]!;
      if (receivedFrame.portId === portId)
        this.receivedFrames.splice(index, 1);
    }
    return removedPort;
  }

  queue(portId: string, frame: readonly number[]) {
    this.send(portId, Bit.fromBytes(frame));
  }

  queueExcept(
    excludedPortId: string,
    frame: readonly number[],
  ) {
    this.sendExcept(excludedPortId, Bit.fromBytes(frame));
  }

  receive(): PortFrame[] {
    return this.receivedFrames.splice(0);
  }

  read(portId: string) {
    const port = this.port(portId);
    const stream = port.in;
    const bytes = Bit.toBytes(stream);
    const details = FRAME_DETAILS[port.frameFormat];
    const start = details.start(bytes);
    if (start === -1) {
      stream.splice(0, bytes.length * 8);
      return;
    }

    const frame = bytes.slice(start);
    const byteLength = details.byteLength(frame);
    if (
      byteLength === undefined ||
      frame.length < byteLength
    )
      return;

    stream.splice(0, (start + byteLength) * 8);
    return frame.slice(0, byteLength);
  }
}

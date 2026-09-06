import { DataLinkPort } from '@simulation/details/data-link/DataLinkPort';
import { EthernetFrame } from '@simulation/details/data-link/EthernetFrame';
import { MacAddress } from '@simulation/details/data-link/MacAddress';
import { SlipFrame } from '@simulation/details/data-link/SlipFrame';
import { Bit } from '@simulation/details/physical/Bit';
import { PhysicalDevice } from './PhysicalDevice';

const FRAME_DETAILS = {
  [EthernetFrame.FORMAT]: EthernetFrame,
  [SlipFrame.FORMAT]: SlipFrame,
};

export type FrameFormat = keyof typeof FRAME_DETAILS;

export type PortFrame = { port: number; frame: number[] };

export type DataLinkDetails = {
  macAddress: MacAddress.type;
  ports: DataLinkPort.type<FrameFormat>[];
  receivedFrames: PortFrame[];
};

export abstract class DataLinkDevice<
  Details extends DataLinkDetails = DataLinkDetails,
> extends PhysicalDevice<Details> {
  get macAddress() {
    return this.details.macAddress;
  }

  get receivedFrames() {
    return this.details.receivedFrames;
  }

  queue(port: number, frame: readonly number[]) {
    this.send(port, Bit.fromBytes(frame));
  }

  queueExcept(
    excludedPort: number,
    frame: readonly number[],
  ) {
    this.sendExcept(excludedPort, Bit.fromBytes(frame));
  }

  receive(): PortFrame[] {
    return this.receivedFrames.splice(0);
  }

  read(port: number) {
    const stream = this.ports(port).in;
    const bytes = Bit.toBytes(stream);
    const details =
      FRAME_DETAILS[this.ports(port).frameFormat];
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

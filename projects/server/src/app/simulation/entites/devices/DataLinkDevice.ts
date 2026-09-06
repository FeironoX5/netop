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

  override addPort(
    frameFormat: FrameFormat = EthernetFrame.FORMAT,
  ): number {
    this.details.ports.push(
      DataLinkPort.build(frameFormat),
    );
    return this.portsCount - 1;
  }

  override removePort(port: number) {
    const removedPort = super.removePort(port);
    for (
      let index = this.receivedFrames.length - 1;
      index >= 0;
      index--
    ) {
      const receivedFrame = this.receivedFrames[index]!;
      if (receivedFrame.port === port)
        this.receivedFrames.splice(index, 1);
      else if (receivedFrame.port > port)
        receivedFrame.port -= 1;
    }
    return removedPort;
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

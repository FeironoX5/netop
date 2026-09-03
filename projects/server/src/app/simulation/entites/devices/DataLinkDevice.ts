import { EthernetFrame } from '@simulation/details/EthernetFrame';
import { MacAddress } from '@simulation/details/MacAddress';
import {
  NetworkDevice,
  NetworkDeviceDetails,
} from './NetworkDevice';

export type DataLinkFrame = {
  port: number;
  frame: EthernetFrame.type;
};

export type DataLinkDetails = NetworkDeviceDetails & {
  macAddress: MacAddress.type;
  outgoingFrames: DataLinkFrame[];
  receivedFrames: DataLinkFrame[];
};

export abstract class DataLinkDevice<
  Details extends DataLinkDetails = DataLinkDetails,
> extends NetworkDevice<Details> {
  get macAddress() {
    return this.details.macAddress;
  }

  get outgoingFrames() {
    return this.details.outgoingFrames;
  }

  get receivedFrames() {
    return this.details.receivedFrames;
  }

  queue(port: number, frame: EthernetFrame.type) {
    this.outgoingFrames.push({ port, frame });
  }

  receive(): DataLinkFrame[] {
    return this.receivedFrames.splice(0);
  }
}

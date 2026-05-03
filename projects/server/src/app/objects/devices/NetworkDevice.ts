import { Cable } from '../Cable';
import { Device, DeviceType } from './Device';

export class NetworkDevice extends Device {
  outputs: Map<string, Cable | null>;

  constructor(id: string, type: DeviceType, name?: string) {
    super(id, type, name);
    this.outputs = new Map<string, Cable | null>();
  }
}

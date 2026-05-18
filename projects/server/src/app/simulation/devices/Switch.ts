import { DeviceType } from '@netop/types';
import {
  NetworkDevice,
  NetworkDeviceInit,
} from '@simulation/devices/NetworkDevice';

export class Switch extends NetworkDevice {
  constructor({ id, name, portsCount }: NetworkDeviceInit) {
    super({
      id,
      type: DeviceType.SWITCH,
      name,
      portsCount,
    });
  }

  tick(): void {
    console.log(`Switch just ${this.id} ticked`);
  }
}

import {
  NetworkDevice,
  NetworkDeviceInit,
} from '@simulation/devices/NetworkDevice';
import { DeviceType } from '@simulation/types/Device.types';

export class Router extends NetworkDevice {
  constructor({ id, name, portsCount }: NetworkDeviceInit) {
    super({
      id,
      type: DeviceType.ROUTER,
      name,
      portsCount,
    });
  }

  tick(): void {
    console.log(`Router just ${this.id} ticked`);
  }
}

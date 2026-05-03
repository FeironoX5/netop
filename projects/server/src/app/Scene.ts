import { Device, DeviceType } from './objects/devices/Device';
import { Router } from './objects/devices/Router';

export class Scene {
  timer: NodeJS.Timeout;
  devices: Device[];

  constructor(tickInterval: number = 1000) {
    this.devices = [];
    this.timer = setInterval(() => {
      this.devices.forEach((device) => device.tick());
    }, tickInterval);
  }

  private generateDeviceId(): string {
    const id = crypto.randomUUID();
    if (this.devices.find((d) => d.id === id)) {
      return this.generateDeviceId();
    }
    return id;
  }

  public addDevice(type: string, name?: string): Device {
    const id = this.generateDeviceId();
    let device: Device;
    switch (type) {
      case 'router':
        device = new Router(id, name);
        this.devices.push(device);
        break;
      default:
        throw new Error(
          `Unknown device type ${type}, use one of: ${Object.values(DeviceType).join(', ')}`,
        );
    }
    return device;
  }

  public removeDevice(id: string) {
    const index = this.devices.findIndex((d) => d.id === id);
    if (index === -1) {
      throw new Error('Device not found');
    }
    this.devices.splice(index, 1);
  }

  public getDevices(): Device[] {
    return this.devices;
  }
}

import { Device } from '@simulation/devices/Device';
import { Router } from '@simulation/devices/Router';
import { DeviceType } from '@simulation/types/Device.types';
import { SimulationEntity } from './interfaces/SimulationEntity';

export class Scene implements SimulationEntity {
  readonly id = 'sc';
  readonly name = 'scene';
  readonly type = 'scene';
  readonly allowedChildrenTypes = [Router];

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
        device = new Router({
          id,
          type: DeviceType.ROUTER,
          name,
          portsCount: 4,
        });
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
    const index = this.devices.findIndex(
      (d) => d.id === id,
    );
    if (index === -1) {
      throw new Error('Device not found');
    }
    this.devices.splice(index, 1);
  }

  public getDevices(): Device[] {
    return this.devices;
  }

  public getChildren(): Device[] {
    return this.devices;
  }
}

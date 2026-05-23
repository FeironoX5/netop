import { simulationBus } from '@events/SimulationBus';
import { DeviceType, SimulationEntity } from '@netop/types';
import { Device } from '@simulation/devices/Device';
import { Router } from '@simulation/devices/Router';
import { Computer } from './devices/Computer';

export class Scene implements SimulationEntity {
  readonly id = 'sc';
  readonly name = 'scene';
  readonly type = 'scene';
  readonly allowedChildrenTypes = [Router];

  timer: NodeJS.Timeout;
  children: Device[];

  constructor(tickInterval: number = 1000) {
    this.children = [];
    this.timer = setInterval(() => {
      this.children.forEach((d) => d.tick());
    }, tickInterval);
  }

  private generateDeviceId(): string {
    const id = crypto.randomUUID();
    if (this.children.find((d) => d.id === id)) {
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
        break;
      case 'computer':
        device = new Computer({
          id,
          type: DeviceType.COMPUTER,
          name,
        });
        break;
      default:
        throw new Error(
          `Unknown device type ${type}, use one of: ${Object.values(DeviceType).join(', ')}`,
        );
    }
    this.children.push(device);
    simulationBus.publish({
      type: 'create',
      entity: {
        id: device.id,
        name: device.name,
        type: device.type,
        path: ['sc'],
      },
    });
    return device;
  }

  public removeDevice(id: string): Device {
    const index = this.children.findIndex(
      (d) => d.id === id,
    );
    if (index === -1) {
      throw new Error('Device not found');
    }
    const [device] = this.children.splice(index, 1);
    simulationBus.publish({
      type: 'delete',
      path: ['sc'],
      id: device.id,
    });
    return device;
  }
}

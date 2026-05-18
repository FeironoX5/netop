import { SimulationEntity } from '@simulation/interfaces/SimulationEntity';
import { DeviceType } from '@simulation/types/Device.types';

export interface DeviceInit {
  id: string;
  type: DeviceType;
  name?: string;
}

export abstract class Device implements SimulationEntity {
  id: string;
  type: DeviceType;
  name: string;

  constructor({ id, type, name = '' }: DeviceInit) {
    if (new.target === Device) {
      throw new Error('Device is abstract');
    }
    this.id = id;
    if (!Object.values(DeviceType).includes(type)) {
      throw new Error(`Unknown device type: ${type}`);
    }
    this.type = type;
    this.name = name;
  }

  tick(): void {
    return;
  }

  toString(): string {
    return `${this.type}:${this.id}${this.name && `:${this.name}`}`;
  }
}

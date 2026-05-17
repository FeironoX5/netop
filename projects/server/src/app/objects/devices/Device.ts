import type { BaseDevice } from '@netop/shared/interfaces';
import type { DeviceType } from '@netop/shared/types';

export abstract class Device implements BaseDevice {
  id: string;
  type: DeviceType;
  name: string;

  constructor(
    id: string,
    type: DeviceType,
    name: string = '',
  ) {
    if (new.target === Device) {
      throw new Error('Device is abstract');
    }
    this.id = id;
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

export enum DeviceType {
  ROUTER = 'router',
}

export abstract class Device {
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

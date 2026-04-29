export abstract class Device {
  id: string;
  name: string;
  type: string;

  constructor() {
    throw new Error('Device cannot be created');
  }

  tick(): void {
    return;
  }

  toString(): string {
    return `${this.type}:${this.name}:${this.id}`;
  }
}

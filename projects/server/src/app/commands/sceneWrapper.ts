import { Scene } from '../scene';
import { CallableEntity } from './callableEntity';

export class SceneWrapper extends CallableEntity {
  scene: Scene;

  constructor(scene: Scene) {
    super(
      'scene',
      new Map<string, (...args: string[]) => string>([
        ['List', () => this.getDevices()],
        ['Add', (type: string) => this.addDevice(type)],
        ['Remove', (id: string) => this.removeDevice(id)],
      ]),
    );
    this.scene = scene;
  }

  getDevices(): string {
    const devices = this.scene.getDevices();
    return devices.map((d) => `${d.toString()}`).join('\n');
  }

  addDevice(type: string): string {
    try {
      const d = this.scene.addDevice(type);
      return `Device ${d.toString()} added`;
    } catch (e) {
      return `Error: ${e}`;
    }
  }

  removeDevice(id: string): string {
    try {
      this.scene.removeDevice(id);
      return `Device ${id} removed`;
    } catch (e) {
      return `Error: ${e}`;
    }
  }
}

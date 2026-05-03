import { Scene } from './scene';
import { CallableEntity } from './utils/commands/callableEntity';

export class SceneWrapper extends CallableEntity {
  scene: Scene;

  constructor(scene: Scene) {
    super(
      'sc',
      new Map<string, (...args: string[]) => string>([
        [
          'ls',
          () => {
            const devices = this.scene.getDevices();
            return devices.map((d) => `${d.toString()}`).join('\n');
          },
        ],
        [
          'new',
          (type: string, name?: string) => {
            try {
              const d = this.scene.addDevice(type, name);
              return `Device ${d.toString()} added`;
            } catch (e) {
              return `Error when creating device: ${e}`;
            }
          },
        ],
        [
          'rm',
          (id: string) => {
            try {
              this.scene.removeDevice(id);
              return `Device ${id} removed`;
            } catch (e) {
              return `Error when removing device: ${e}`;
            }
          },
        ],
      ]),
      'Used to manage the scene',
    );
    this.scene = scene;
  }
}

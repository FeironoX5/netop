import { Scene } from './Scene';
import { CallableEntity } from './utils/commands/CallableEntity';

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
            if (devices.length === 0) return 'No devices';
            return `Devices:\n${devices.map((d) => `- ${d.toString()}`).join('\n')}`;
          },
        ],
        [
          'new',
          (type: string, name?: string) => {
            try {
              const d = this.scene.addDevice(type, name);
              return `Device added:\n- ${d.toString()}`;
            } catch (e) {
              return `Error when creating device:\n${e}`;
            }
          },
        ],
        [
          'rm',
          (id: string) => {
            try {
              this.scene.removeDevice(id);
              return `Device removed:\n- ${id}`;
            } catch (e) {
              return `Error when removing device:\n${e}`;
            }
          },
        ],
      ]),
      'Used to manage the scene',
    );
    this.scene = scene;
  }
}

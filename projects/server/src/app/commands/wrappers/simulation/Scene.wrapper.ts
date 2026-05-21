import { type EntityWrapper } from '@commands/interfaces/EntityWrapper';
import { Scene } from '@simulation/Scene';

export const SceneWrapper: EntityWrapper<Scene> = {
  info: 'Used to manage the scene',
  commands: new Map([
    [
      'ls',
      {
        info: 'List all devices in the scene',
        fn: (scene) => {
          const devices = scene.getDevices();
          if (devices.length === 0) return 'No devices';
          return `Devices:\n${devices.map((d) => `- ${d.toString()}`).join('\n')}`;
        },
      },
    ],
    [
      'new',
      {
        info: 'Add a new device',
        args: ['type', 'name?'],
        fn: (scene, type: string, name?: string) => {
          const d = scene.addDevice(type, name);
          return `Device added:\n- ${d.toString()}`;
        },
      },
    ],
    [
      'rm',
      {
        info: 'Remove a device by id',
        args: ['id'],
        fn: (scene, id: string) => {
          scene.removeDevice(id);
          return `Device removed:\n- ${id}`;
        },
      },
    ],
  ]),
};

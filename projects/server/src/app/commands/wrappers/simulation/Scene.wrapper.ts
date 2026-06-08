import { EntityWrapper } from '@commands/interfaces/EntityWrapper';
import { Scene } from '@entites/Scene';
import { Simulation } from '@netop/types';
import { SimulationRegistry } from '@simulation/SimulationRegistry';

export const SceneWrapper: EntityWrapper<Scene> = {
  info: 'Used to manage the scene',
  commands: new Map([
    [
      'ls',
      {
        info: 'List all devices in the scene',
        fn: (scene) => {
          const devices = scene.children;
          if (devices.length === 0) return 'No devices';
          return `Devices:\n${devices.map((d) => `- ${d.name || d.id} (${d.category})`).join('\n')}`;
        },
      },
    ],
    [
      'new',
      {
        info: 'Add a new device',
        args: ['type', 'name?'],
        fn: (scene, type: string, name?: string) => {
          const entry = SimulationRegistry.getManager(
            type as Simulation.Category,
          );
          const entity = entry.build(name || '');
          scene.addChild(entity);
          return `Device added:\n- ${entity.name || entity.id} (${entity.category})`;
        },
      },
    ],
    [
      'rm',
      {
        info: 'Remove a device by id',
        args: ['id'],
        fn: (scene, id: string) => {
          const removed = scene.removeChild(id);
          if (!removed) throw new Error('Device not found');
          return `Device removed:\n- ${removed.id}`;
        },
      },
    ],
  ]),
};

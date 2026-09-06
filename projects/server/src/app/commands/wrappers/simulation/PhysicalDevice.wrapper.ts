import { EntityWrapper } from '@commands/interfaces/EntityWrapper';
import { ActionCodec } from '@netop/utils';
import { PhysicalDevice } from '@/app/simulation/entites/devices/PhysicalDevice';
import { SimulationConnection } from '@/app/simulation/SimulationConnection';
import { SimulationRegistry } from '@/app/simulation/SimulationRegistry';

export const PhysicalDeviceWrapper: EntityWrapper<PhysicalDevice> =
  {
    info: 'Used to manage a physical device',
    commands: new Map([
      [
        'new',
        {
          info: 'Adds a port',
          fn: (entity) => `Added port ${entity.addPort()}`,
        },
      ],
      [
        'rm',
        {
          info: 'Removes a port',
          args: ['port'],
          fn: (entity, port: string) => {
            entity.removePort(Number(port));
            return `Removed port ${port}`;
          },
        },
      ],
      [
        'link',
        {
          info: 'Links two network devices together',
          args: [
            'port',
            'targetPath',
            'targetPort',
            'speed?',
            'delay?',
          ],
          fn: (
            entity,
            port: string,
            targetPath: string,
            targetPort: string,
            speed: string = '1',
            delay: string = '5',
          ) => {
            const target = SimulationRegistry.get().resolve(
              ActionCodec.split(targetPath),
            );
            if (!target) return 'Target not found';
            SimulationRegistry.get().addConnection(
              SimulationConnection.build(
                entity.path,
                Number(port),
                target.entity.path,
                Number(targetPort),
                Number(speed),
                Number(delay),
              ),
            );
            return `Linked ${entity.id} to ${target.entity.id}`;
          },
        },
      ],
    ]),
  };

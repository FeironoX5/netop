import { EntityWrapper } from '@commands/interfaces/EntityWrapper';
import { PhysicalDevice } from '@/app/simulation/entites/devices/PhysicalDevice';

export const PhysicalDeviceWrapper: EntityWrapper<PhysicalDevice> =
  {
    info: 'Used to manage a physical device',
    commands: new Map([
      [
        'new',
        {
          info: 'Adds a port',
          fn: (entity) =>
            `Added port ${entity.addPort().id}`,
        },
      ],
      [
        'rm',
        {
          info: 'Removes a port',
          args: ['portId'],
          fn: (entity, portId: string) => {
            entity.port(portId).remove();
            return `Removed port ${portId}`;
          },
        },
      ],
      [
        'ports',
        {
          info: 'Lists ports',
          fn: (entity) =>
            entity.ports.map(({ id }) => id).join('\n'),
        },
      ],
    ]),
  };

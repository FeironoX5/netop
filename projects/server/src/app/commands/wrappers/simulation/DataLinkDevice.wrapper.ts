import {
  EntityWrapper,
  EntityWrapperCommand,
} from '@commands/interfaces/EntityWrapper';
import { DataLinkDevice } from '@entites/devices/DataLinkDevice';
import type { FrameFormat } from '@entites/ports/DataLinkPort';
import { PhysicalDeviceWrapper } from './PhysicalDevice.wrapper';

export const DataLinkDeviceWrapper: EntityWrapper<DataLinkDevice> =
  {
    info: 'Used to manage a data-link device',
    commands: new Map<
      string,
      EntityWrapperCommand<DataLinkDevice>
    >([
      ...PhysicalDeviceWrapper.commands.entries(),
      [
        'new',
        {
          info: 'Adds a port',
          args: ['frameFormat'],
          fn: (entity, frameFormat: string) =>
            `Added port ${entity.addPort(frameFormat as FrameFormat).id}`,
        },
      ],
      [
        'ports',
        {
          info: 'Lists ports',
          fn: (entity) =>
            entity.ports
              .map(
                ({ id, frameFormat }) =>
                  `${id}: ${frameFormat}`,
              )
              .join('\n'),
        },
      ],
    ]),
  };

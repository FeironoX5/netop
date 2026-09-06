import {
  EntityWrapper,
  EntityWrapperCommand,
} from '@commands/interfaces/EntityWrapper';
import {
  DataLinkDevice,
  FrameFormat,
} from '@entites/devices/DataLinkDevice';
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
            `Added port ${entity.addPort(frameFormat as FrameFormat)}`,
        },
      ],
    ]),
  };

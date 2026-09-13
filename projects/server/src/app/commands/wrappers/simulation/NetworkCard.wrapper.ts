import { EntityWrapper } from '@commands/interfaces/EntityWrapper';
import { NetworkCard } from '@entites/devices/NetworkCard';
import { DataLinkDeviceWrapper } from './DataLinkDevice.wrapper';

const commands = new Map(
  DataLinkDeviceWrapper.commands.entries(),
);
commands.delete('new');
commands.delete('rm');

export const NetworkCardWrapper: EntityWrapper<NetworkCard> =
  { info: 'Used to inspect a network card', commands };

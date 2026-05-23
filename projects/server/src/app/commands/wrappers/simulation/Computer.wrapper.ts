import { EntityWrapper } from '@commands/interfaces/EntityWrapper';
import { DeviceType } from '@netop/types';
import { Computer } from '@simulation/devices/Computer';
import { NetworkCard } from '@/app/simulation/devices/NetworkCard';

export const ComputerWrapper: EntityWrapper<Computer> = {
  info: 'Used to manage a computer',
  commands: new Map([
    [
      'new',
      {
        info: 'Add a new network interface',
        args: ['name?'],
        fn: (computer, name?: string) => {
          const cardId =
            computer.children.length.toString();
          computer.linkInterface(
            new NetworkCard({
              id: cardId,
              name,
              type: DeviceType.NETWORK_CARD,
              portsCount: 4,
            }),
          );
          return `Network card ${cardId} added`;
        },
      },
    ],
  ]),
};

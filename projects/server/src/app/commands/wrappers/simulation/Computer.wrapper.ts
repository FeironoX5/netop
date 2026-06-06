import { EntityWrapper } from '@commands/interfaces/EntityWrapper';
import { DeviceCategory } from '@netop/types';
import { Computer } from '@simulation/devices/Computer';
import { SimulationRegistry } from '@simulation/SimulationRegistry';

export const ComputerWrapper: EntityWrapper<Computer> = {
  info: 'Used to manage a computer',
  commands: new Map([
    [
      'new',
      {
        info: 'Add a new network interface',
        args: ['name?'],
        fn: (computer, name?: string) => {
          const entry = SimulationRegistry.getManager(
            DeviceCategory.NETWORK_CARD,
          );
          const card = entry.build(name || '');
          computer.addChild(card);
          return `Network card ${card.id} added`;
        },
      },
    ],
  ]),
};

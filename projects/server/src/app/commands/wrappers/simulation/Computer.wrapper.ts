import { EntityWrapper } from '@commands/interfaces/EntityWrapper';
import { Computer } from '@simulation/devices/Computer';

export const ComputerWrapper: EntityWrapper<Computer> = {
  info: 'Used to manage a computer',
  commands: new Map([
    [
      'new',
      {
        info: 'Add a new network interface',
        args: ['name?'],
        fn: (_computer, _name?: string) => 'Not implemented',
      },
    ],
  ]),
};

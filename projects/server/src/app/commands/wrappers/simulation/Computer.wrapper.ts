import { EntityWrapper } from '@commands/interfaces/EntityWrapper';
import { Computer } from '@entites/devices/Computer';
import { SimulationEntityWrapper } from './SimulationEntity.wrapper';

export const ComputerWrapper: EntityWrapper<Computer> = {
  info: 'Used to manage a computer',
  commands: new Map(
    SimulationEntityWrapper<Computer>().commands.entries(),
  ),
};

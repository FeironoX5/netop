import { EntityWrapper } from '@commands/interfaces/EntityWrapper';
import { PhysicalPort } from '@entites/ports/PhysicalPort';
import { ActionCodec } from '@netop/utils';
import { SimulationConnection } from '@simulation/SimulationConnection';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import { SimulationEntityWrapper } from './SimulationEntity.wrapper';

const commands = new Map(
  SimulationEntityWrapper<PhysicalPort>().commands.entries(),
);
commands.delete('new');
commands.delete('ls');
commands.delete('rm');
commands.set('link', {
  info: 'Links the port to another port',
  args: ['targetPath', 'speed?', 'delay?'],
  fn: (entity, targetPath, speed = '1', delay = '5') => {
    const target = SimulationRegistry.get().resolve(
      ActionCodec.split(targetPath),
    );
    if (!target) return 'Target not found';
    const connection = SimulationConnection.build(
      entity.path,
      target.entity.path,
      Number(speed),
      Number(delay),
    );
    SimulationRegistry.get().addConnection(connection);
    return `Linked by ${connection.id}`;
  },
});

export const PortWrapper: EntityWrapper<PhysicalPort> = {
  info: 'Used to manage a port',
  commands,
};

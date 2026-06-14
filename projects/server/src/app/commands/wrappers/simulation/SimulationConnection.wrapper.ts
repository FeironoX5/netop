import { EntityWrapper } from '@commands/interfaces/EntityWrapper';
import { SimulationConnection } from '@simulation/SimulationConnection';
import { SimulationRegistry } from '@/app/simulation/SimulationRegistry';

export const SimulationConnectionWrapper: EntityWrapper<SimulationConnection> =
  {
    info: 'Simulation connection commands',
    commands: new Map([
      [
        'delete',
        {
          info: 'Deletes the simulation connection',
          args: [],
          fn: (entity) =>
            SimulationRegistry.get().removeConnection(
              entity.id,
            )
              ? 'Connection deleted'
              : 'Connection not found',
        },
      ],
    ]),
  };

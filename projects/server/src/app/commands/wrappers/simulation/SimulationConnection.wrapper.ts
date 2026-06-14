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
          fn: (entity) => {
            const i =
              SimulationRegistry.get().connections.findIndex(
                (c) => c.id === entity.id,
              );
            if (i > -1) {
              SimulationRegistry.get().connections.splice(
                i,
                1,
              );
              return 'Connection deleted';
            }
            return 'Connection not found';
          },
        },
      ],
    ]),
  };

import type { SimulationSnapshot } from '@netop/types';
import { TreeUtils } from '@netop/utils';
import { simulationTreeWalker } from '../simulation/helpers/simulationTreeWalker';
import { SimulationRegistry } from '../simulation/SimulationRegistry';

export function getSimulationSnapshot(): SimulationSnapshot {
  const simulation = SimulationRegistry.get();
  const flatSimulation = TreeUtils.flatten({
    root: simulation.root,
    walker: simulationTreeWalker,
  });
  const entities = Object.fromEntries(
    Array.from(
      flatSimulation,
      ([path, { children: _children, ...entity }]) => [
        path,
        entity,
      ],
    ),
  );
  const connections = Object.fromEntries(
    simulation.connections.map((connection) => [
      connection.id,
      connection,
    ]),
  );

  return { entities, connections };
}

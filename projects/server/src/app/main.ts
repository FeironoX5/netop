import { ActionHandler } from '@commands/ActionHandler';
import { SimulationUndoHandler } from '@events/SimulationUndoHandler';
import { SceneCategory } from '@netop/types';
import { Simulation } from '@simulation/Simulation';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import '@entites';
import { getSimulationConnectionFactory } from './commands/resolvers/simulationConnectionFactory';
import { getSimulationEntityFactory } from './commands/resolvers/simulationEntityFactory';
import { getSimulationEventFactory } from './commands/resolvers/simulationEventFactory';

const rootManager =
  SimulationRegistry.getManager(SceneCategory);

SimulationRegistry.set(
  new Simulation(rootManager.build('sc')),
);

// HANDLERS //

export const simulationUndoHandler =
  new SimulationUndoHandler({
    entity: (_) => {},
    connection: (_) => {},
  });

export const actionHandler = new ActionHandler([
  getSimulationEntityFactory(),
  getSimulationConnectionFactory(),
  getSimulationEventFactory(),
]);

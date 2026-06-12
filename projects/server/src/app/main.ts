import { ActionHandler } from '@commands/ActionHandler';
import { SimulationUndoHandler } from '@events/SimulationUndoHandler';
import { SceneCategory } from '@netop/types';
import { Simulation } from '@simulation/Simulation';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import { getSimulationEntityFactory } from './commands/resolvers/simulationEntityFactory';
import { getSimulationEventFactory } from './commands/resolvers/simulationEventFactory';
import '@entites';

const rootManager =
  SimulationRegistry.getManager(SceneCategory);

SimulationRegistry.set(
  new Simulation(rootManager.build('sc')),
);

export const simulationUndoHandler =
  new SimulationUndoHandler();

export const actionHandler = new ActionHandler([
  getSimulationEntityFactory(
    SimulationRegistry.getRootEntity(),
  ),
  getSimulationEventFactory(),
]);

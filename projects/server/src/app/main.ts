import { ActionHandler } from '@commands/ActionHandler';
import { SimulationUndoHandler } from '@events/SimulationUndoHandler';
import { SceneCategory } from '@netop/types';
import { Simulation } from '@simulation/Simulation';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import { getSimulationEntityFactory } from './commands/resolvers/simulationEntityFactory';
import { getSimulationEventFactory } from './commands/resolvers/simulationEventFactory';
import '@entites';

export const simulation = new Simulation(
  SimulationRegistry.getManager(SceneCategory).build('sc'),
);

SimulationRegistry.setRoot(simulation.root);

export const simulationRoot = SimulationRegistry.getEntity(
  simulation.root,
);
export const simulationUndoHandler =
  new SimulationUndoHandler();

export const actionHandler = new ActionHandler([
  getSimulationEntityFactory(simulationRoot),
  getSimulationEventFactory(),
]);

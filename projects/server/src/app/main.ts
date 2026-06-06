import { ActionHandler } from '@commands/ActionHandler';
import { SimulationBus } from '@events/SimulationBus';
import { SimulationUndoHandler } from '@events/SimulationUndoHandler';
import { SceneCategory } from '@netop/types';
import { Simulation } from '@simulation/Simulation';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import { getSimulationEntityFactory } from './commands/resolvers/simulationEntityFactory';
import { getSimulationEventFactory } from './commands/resolvers/simulationEventFactory';

const rootManager =
  SimulationRegistry.getManager(SceneCategory);

export const simulation = new Simulation(
  rootManager.build('scene'),
);

export const simulationBus = new SimulationBus();
export const simulationUndoHandler =
  new SimulationUndoHandler();

export const actionHandler = new ActionHandler([
  getSimulationEntityFactory(
    rootManager.from(simulation.root),
  ),
  getSimulationEventFactory(),
]);

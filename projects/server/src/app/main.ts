import { ActionHandler } from '@commands/ActionHandler';
import { SimulationBus } from '@events/SimulationBus';
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

export const simulationBus = new SimulationBus();
export const simulationUndoHandler =
  new SimulationUndoHandler();

export const actionHandler = new ActionHandler([
  getSimulationEntityFactory(
    SimulationRegistry.getEntity(simulation.root),
  ),
  getSimulationEventFactory(),
]);

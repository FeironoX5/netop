import { ActionHandler } from '@commands/ActionHandler';
import { SimulationUndoHandler } from '@events/SimulationUndoHandler';
import { SceneCategory } from '@netop/types';
import { EventTarget } from '@netop/utils';
import { SimulationEvent } from '@simulation/events/types';
import { Simulation } from '@simulation/Simulation';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import '@entites';
import { getSimulationEntityFactory } from './commands/resolvers/simulationEntityFactory';
import { getSimulationEventFactory } from './commands/resolvers/simulationEventFactory';

const rootManager =
  SimulationRegistry.getManager(SceneCategory);

SimulationRegistry.set(
  new Simulation(rootManager.build('sc')),
);

// GLOBAL EVENT SOURCE //

export const simulationEventSource =
  new EventTarget<SimulationEvent.type>();
SimulationRegistry.get().rootEntity.subscribe(
  simulationEventSource.call,
);

// HANDLERS //

export const simulationUndoHandler =
  new SimulationUndoHandler(simulationEventSource, {
    entity: (_) => {},
    connection: (_) => {},
  });

export const actionHandler = new ActionHandler([
  getSimulationEntityFactory(),
  getSimulationEventFactory(),
]);

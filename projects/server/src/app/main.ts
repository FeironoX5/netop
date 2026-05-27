import { ActionHandler } from '@commands/ActionHandler';
import { CommandHandlerWrapper } from '@commands/wrappers/ActionHandler.wrapper';
import { SimulationBus } from '@events/SimulationBus';
import { SimulationUndoHandler } from '@events/SimulationUndoHandler';
import { Scene } from '@simulation/Scene';
import { getSimulationEntityFactory } from './commands/resolvers/simulationEntityFactory';
import { getSimulationEventFactory } from './commands/resolvers/simulationEventFactory';

export const scene = new Scene();

export const simulationBus = new SimulationBus();

export const simulationUndoHandler =
  new SimulationUndoHandler();

export const actionHandler = new ActionHandler(
  [
    getSimulationEntityFactory(scene),
    getSimulationEventFactory(),
  ],
  CommandHandlerWrapper,
);

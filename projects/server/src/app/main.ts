import { ActionHandler } from '@commands/ActionHandler';
import { CommandHandlerWrapper } from '@commands/wrappers/ActionHandler.wrapper';
import { SimulationBus } from '@events/SimulationBus';
import { Scene } from '@simulation/Scene';
import { getSimulationFactory } from './commands/resolvers/simulationFactory';

export const scene = new Scene();

export const simulationBus = new SimulationBus();

export const actionHandler = new ActionHandler(
  [getSimulationFactory(scene)],
  CommandHandlerWrapper,
);

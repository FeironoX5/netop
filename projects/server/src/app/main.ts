import { ActionHandler } from '@commands/ActionHandler';
import { simulationResolver } from '@commands/resolvers/simulation';
import { CommandHandlerWrapper } from '@commands/wrappers/ActionHandler.wrapper';
import { Scene } from '@simulation/Scene';

export const scene = new Scene();

export const actionHandler = new ActionHandler(
  [simulationResolver([scene])],
  CommandHandlerWrapper,
);

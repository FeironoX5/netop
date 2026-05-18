import { CommandHandler } from '@commands/CommandHandler';
import { simulationResolver } from '@commands/resolvers/simulation';
import { CommandHandlerWrapper } from '@commands/wrappers/CommandHandler.wrapper';
import { Scene } from './simulation/Scene';

export const scene = new Scene();

export const commandHandler = new CommandHandler(
  [simulationResolver([scene])],
  CommandHandlerWrapper,
);

import { SimulationUndoHandler } from '@events/SimulationUndoHandler';
import { simulationUndoHandler } from '@/app/main';
import { SimulationUndoHandlerWrapper } from '../wrappers/simulation/SimulationUndoHandler.wrapper';
import { ResolverFactory } from './types';

export const getSimulationEventFactory =
  (): ResolverFactory<SimulationUndoHandler> => {
    return {
      resolver: (path) => {
        if (path[0] === '!') {
          return {
            wrapper: SimulationUndoHandlerWrapper,
            entity: simulationUndoHandler,
          };
        }
        return undefined;
      },
      wrappers: new Map(),
    };
  };

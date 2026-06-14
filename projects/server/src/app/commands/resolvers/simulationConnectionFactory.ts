import { SimulationConnection } from '@/app/simulation/SimulationConnection';
import { SimulationRegistry } from '@/app/simulation/SimulationRegistry';
import { SimulationConnectionWrapper } from '../wrappers/simulation/SimulationConnection.wrapper';
import { ResolverFactory } from './types';

export const getSimulationConnectionFactory =
  (): ResolverFactory<SimulationConnection> => {
    return {
      resolver: (p) => {
        if (p[0] === '@') {
          const resolved =
            SimulationRegistry.get().resolveConnection(
              p[1],
            );
          if (!resolved) return undefined;
          return {
            wrapper: SimulationConnectionWrapper,
            entity: resolved,
          };
        }
        return undefined;
      },
      wrappers: new Map(),
    };
  };

import type { Simulation } from './simulation';

export type FlatSimulationEntity = Omit<
  Simulation.Entity,
  'children'
>;

export type SimulationSnapshot = {
  entities: Record<string, FlatSimulationEntity>;
  connections: Record<string, Simulation.Connection>;
};

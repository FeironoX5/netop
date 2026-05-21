export interface SimulationEntity {
  id: string;
  name: string;
  type: string;
}

export interface FlatSimulationEntity extends SimulationEntity {
  path: string[];
}

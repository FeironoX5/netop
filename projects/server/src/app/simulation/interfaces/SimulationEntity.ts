import { SimulationEntityType } from '../types/SimulationEntity.types';

export interface SimulationEntity {
  id: string;
  name: string;
  type: SimulationEntityType;
  children?: SimulationEntity[];
}

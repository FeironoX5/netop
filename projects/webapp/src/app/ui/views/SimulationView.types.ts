import type { TreeListEntry } from '@components/TreeList.props';
import type { FlatSimulationEntity } from '@netop/types';

export type EntityView = 'tree' | 'list';

export type SimulationEntityEntry = TreeListEntry & {
  path: string;
  entity: FlatSimulationEntity;
};

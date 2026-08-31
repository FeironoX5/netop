import type { DetailsRow } from '@components/DetailsTable.types';
import type { FlatSimulationEntity } from '@netop/types';

export function getEntityDetails(
  entity: FlatSimulationEntity,
  path: string,
): readonly DetailsRow[] {
  return [
    [{ label: 'Path', value: path }],
    [
      { label: 'ID', value: entity.id },
      { label: 'Category', value: entity.category },
    ],
  ];
}

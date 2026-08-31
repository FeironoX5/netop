import type { DetailsRow } from '@components/DetailsTable.types';
import type { Simulation } from '@netop/types';
import { formatEndpoint } from '@/app/utils/simulation';

export function getConnectionDetails(
  connection: Simulation.Connection,
): readonly DetailsRow[] {
  return [
    [
      {
        label: 'From',
        value: formatEndpoint(connection.left),
      },
      {
        label: 'To',
        value: formatEndpoint(connection.right),
      },
    ],
    [
      {
        label: 'Speed',
        value: `${connection.speed} symbols/tick`,
      },
      {
        label: 'Delay',
        value: `${connection.delay} ticks`,
      },
    ],
  ];
}

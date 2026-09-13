import type { ItemHeaderTone } from '@bits/ItemHeader.props';
import type { DetailsRow } from '@components/DetailsTable.types';
import type { Simulation } from '@netop/types';
import {
  getEntityDisplayText,
  getSimulationEntityPath,
} from '@/app/utils/simulation';
import { getConnectionDetails } from './ConnectionDetails.utils';
import {
  EVENT_ICON,
  EVENT_TONE,
} from './EventDetails.consts';

export function getEventDetails(
  event: Simulation.Event.Mutation,
): readonly DetailsRow[] {
  if (event.scope === 'connection') {
    return getConnectionDetails(event.data);
  }

  return [
    [
      {
        label: 'Entity',
        value: getEntityDisplayText(event.data),
      },
    ],
    [
      {
        label: 'Path',
        value: getSimulationEntityPath(event),
      },
      { label: 'Category', value: event.data.category },
    ],
  ];
}

export function getEventIcon(
  event: Simulation.Event.Mutation,
): string {
  return EVENT_ICON[event.operation];
}

export function getEventTone(
  event: Simulation.Event.Mutation,
): ItemHeaderTone {
  return EVENT_TONE[event.operation];
}

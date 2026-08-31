import type { ItemHeaderTone } from '@bits/ItemHeader.props';
import type { Simulation } from '@netop/types';

export const EVENT_ICON: Record<
  Simulation.Event.type['operation'],
  string
> = { create: 'plus', update: 'pencil', delete: 'trash' };

export const EVENT_TONE: Record<
  Simulation.Event.type['operation'],
  ItemHeaderTone
> = {
  create: 'success',
  update: 'warning',
  delete: 'error',
};

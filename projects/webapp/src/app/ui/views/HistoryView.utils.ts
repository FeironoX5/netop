import type { Simulation } from '@netop/types';
import { ActionCodec } from '@netop/utils';

const OPERATION_TEXT: Record<
  Simulation.Event.type['operation'],
  string
> = {
  create: 'Created',
  update: 'Updated',
  delete: 'Deleted',
};

const OPERATION_ICON: Record<
  Simulation.Event.type['operation'],
  string
> = { create: 'plus', update: 'pencil', delete: 'trash' };

const OPERATION_CLASS: Record<
  Simulation.Event.type['operation'],
  string
> = {
  create: 'success',
  update: 'warning',
  delete: 'error',
};

export function getEventClass(
  event: Simulation.Event.type,
): string {
  return OPERATION_CLASS[event.operation];
}

export function getEventIcon(
  event: Simulation.Event.type,
): string {
  return OPERATION_ICON[event.operation];
}

export function getEventOperation(
  event: Simulation.Event.type,
): string {
  return OPERATION_TEXT[event.operation];
}

export function formatEndpoint(
  endpoint: Simulation.Connection['left'],
): string {
  return `${formatPath(endpoint.path)}:${endpoint.port}`;
}

export function formatPath(path: string[]): string {
  return ActionCodec.join(path) || '—';
}

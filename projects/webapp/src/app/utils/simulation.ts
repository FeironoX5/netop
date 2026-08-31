import type {
  FlatSimulationEntity,
  Simulation,
} from '@netop/types';
import { ActionCodec } from '@netop/utils';

type SimulationEntityEvent = Extract<
  Simulation.Event.type,
  { scope: 'entity' }
>;

export function getEntityDisplayText(
  entity: FlatSimulationEntity,
): string {
  return entity.name ?? entity.id;
}

export function formatSimulationPath(
  path: readonly string[],
): string {
  return ActionCodec.join([...path]) || '—';
}

export function getSimulationEntityPath(
  event: SimulationEntityEvent,
): string {
  return ActionCodec.join([
    ...event.parentPath,
    event.data.id,
  ]);
}

export function formatEndpoint(
  endpoint: Simulation.Connection['left'],
): string {
  return `${formatSimulationPath(endpoint.path)}:${endpoint.port}`;
}

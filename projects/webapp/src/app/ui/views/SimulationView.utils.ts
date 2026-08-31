import type {
  FlatSimulationEntity,
  Simulation,
} from '@netop/types';
import { ActionCodec } from '@netop/utils';
import {
  formatEndpoint,
  getEntityDisplayText,
} from '@/app/utils/simulation';
import type { SimulationEntityEntry } from './SimulationView.types';

export function getEntityEntries(
  entities: Map<string, FlatSimulationEntity>,
  query: string,
): SimulationEntityEntry[] {
  const normalizedQuery = query.trim().toLowerCase();

  return Array.from(entities, ([path, entity]) => ({
    key: path,
    path,
    depth: ActionCodec.split(path).length - 1,
    text: getEntityDisplayText(entity),
    entity,
  }))
    .filter(({ path, entity }) =>
      [path, entity.id, entity.name, entity.category]
        .filter((value) => value !== undefined)
        .some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        ),
    )
    .sort((left, right) =>
      left.path.localeCompare(right.path),
    );
}

export function getConnections(
  connections: Map<string, Simulation.Connection>,
  query: string,
): Simulation.Connection[] {
  const normalizedQuery = query.trim().toLowerCase();

  return Array.from(connections.values())
    .filter((connection) =>
      [
        connection.id,
        formatEndpoint(connection.left),
        formatEndpoint(connection.right),
      ].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    )
    .sort((left, right) => left.id.localeCompare(right.id));
}

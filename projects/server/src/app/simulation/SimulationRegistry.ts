import { SimulationEntity } from '@entites/SimulationEntity';
import { Simulation as SimulationTypes } from '@netop/types';
import { Simulation } from './Simulation';
import { SimulationConnection } from './SimulationConnection';

type DetailsOf<T extends SimulationEntity> =
  T extends SimulationEntity<infer D> ? D : never;

type EntityManager<
  T extends SimulationEntity = SimulationEntity,
> = {
  // use directly only if you don't want result to be cached
  from: new (
    e: SimulationTypes.Entity,
    p?: SimulationEntity | null,
  ) => T;
  tick: (
    e: SimulationTypes.Entity & { details?: DetailsOf<T> },
  ) => void;
  build: (
    id: SimulationTypes.Entity['id'],
    ...args: string[]
  ) => SimulationTypes.Entity & { details?: DetailsOf<T> };
};

/** Used to:
 * - store behaviours and entity managers
 * - translate entity data to entity instance
 * - cache entity instances
 * - access simulation state
 */
export class SimulationRegistry {
  static behaviours: Record<
    string,
    (e: SimulationTypes.Entity) => void
  > = {
    entity(e) {
      e.children?.forEach((c) =>
        SimulationRegistry.getManager(c.category).tick(c),
      );
    },
  };

  private static managers: Partial<
    Record<SimulationTypes.Category, EntityManager>
  > = {};

  private static entities = new WeakMap<
    SimulationTypes.Entity,
    SimulationEntity
  >();

  private static connections = new WeakMap<
    SimulationTypes.Connection,
    SimulationConnection
  >();

  private static simulation?: Simulation;

  static setManager<T extends SimulationEntity>(
    category: SimulationTypes.Category,
    manager: EntityManager<T>,
  ) {
    this.managers[category] = manager;
  }

  static getManager(category: SimulationTypes.Category) {
    const entry = this.managers[category];
    if (!entry)
      throw new Error(
        `Entity category ${category} not registered. Use one of ${Object.keys(SimulationRegistry.managers).join(', ')}.`,
      );
    return entry;
  }

  static getConnection(
    connection: SimulationTypes.Connection,
  ) {
    const entry =
      this.connections.get(connection) ||
      new SimulationConnection(connection);
    if (!this.connections.has(connection)) {
      this.connections.set(connection, entry);
    }
    return entry;
  }

  static set(simulation: Simulation) {
    this.simulation = simulation;
  }

  static get() {
    if (!this.simulation)
      throw new Error('No simulation set');
    return this.simulation;
  }

  static fromChain<
    T extends SimulationEntity = SimulationEntity,
  >(
    chain: SimulationTypes.Entity[],
    parent: SimulationEntity | null = null,
  ): T {
    const [e, ...rest] = chain;
    if (!e) throw new Error('Empty chain');

    let entity = this.entities.get(e) as T | undefined;
    if (!entity) {
      const Ctor = this.getManager(e.category).from;
      entity = new Ctor(e, parent) as T;
      this.entities.set(e, entity);
    }

    if (rest.length === 0) return entity;
    return this.fromChain(rest, entity);
  }
}

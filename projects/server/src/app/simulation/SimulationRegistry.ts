import { SimulationEntity } from '@entites/SimulationEntity';
import { Simulation } from '@netop/types';

type DetailsOf<T extends SimulationEntity> =
  T extends SimulationEntity<infer D> ? D : never;

type EntityManager<
  T extends SimulationEntity = SimulationEntity,
> = {
  // use only if you don't want result to be cached
  from: (e: Simulation.Entity) => T;
  tick: (
    e: Simulation.Entity & { details?: DetailsOf<T> },
  ) => void;
  build: (
    id: Simulation.Entity['id'],
    ...args: string[]
  ) => Simulation.Entity & { details?: DetailsOf<T> };
};

export class SimulationRegistry {
  static behaviours: Record<
    string,
    (e: Simulation.Entity) => void
  > = {
    entity(e) {
      e.children?.forEach((c) =>
        SimulationRegistry.getManager(c.category).tick(c),
      );
    },
  };

  private static managers: Partial<
    Record<Simulation.Category, EntityManager>
  > = {};

  private static entities = new WeakMap<
    Simulation.Entity,
    SimulationEntity
  >();

  static setManager<T extends SimulationEntity>(
    category: Simulation.Category,
    manager: EntityManager<T>,
  ) {
    this.managers[category] = manager;
  }

  static getManager(category: Simulation.Category) {
    const entry = SimulationRegistry.managers[category];
    if (!entry)
      throw new Error(
        `Entity category ${category} not registered. Use one of ${Object.keys(SimulationRegistry.managers).join(', ')}.`,
      );
    return entry;
  }

  static getEntity<
    T extends SimulationEntity = SimulationEntity,
  >(e: Simulation.Entity): T {
    let entity = SimulationRegistry.entities.get(e) as
      | T
      | undefined;
    if (!entity) {
      entity = this.getManager(e.category).from(e) as T;
      SimulationRegistry.entities.set(e, entity);
    }
    return entity;
  }
}

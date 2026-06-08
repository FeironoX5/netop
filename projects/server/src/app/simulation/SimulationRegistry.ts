import { SimulationEntity } from '@entites/SimulationEntity';
import { Simulation } from '@netop/types';

type DetailsOf<T extends SimulationEntity> =
  T extends SimulationEntity<infer D> ? D : never;

type EntityManager<
  T extends SimulationEntity = SimulationEntity,
> = {
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
}

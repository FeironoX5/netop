import { SimulationEntity } from '@entites/SimulationEntity';
import { PathSegment, Simulation } from '@netop/types';
import { TreeUtils } from '@netop/utils';
import { simulationTreeWalker } from '@simulation/helpers/simulationTreeWalker';

type DetailsOf<T extends SimulationEntity> =
  T extends SimulationEntity<infer D> ? D : never;

type EntityManager<
  T extends SimulationEntity = SimulationEntity,
> = {
  // use only if you don't want result to be cached
  from: new (
    e: Simulation.Entity,
    p?: Simulation.Entity,
  ) => T;
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

  private static root?: Simulation.Entity;

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

  static setRoot(root: Simulation.Entity) {
    this.root = root;
  }

  static getEntity<
    T extends SimulationEntity = SimulationEntity,
  >(e: Simulation.Entity, path?: PathSegment[]): T {
    const cached = SimulationRegistry.entities.get(e) as
      | T
      | undefined;
    if (cached) return cached;

    if (!path || path.length === 0) {
      return this.createEntity(e, e) as T;
    }

    const chain = TreeUtils.resolveChain({
      root: this.root!,
      walker: simulationTreeWalker,
    })(path);

    if (!chain) {
      throw new Error(
        `path "${path.join(':')}" does not resolve to any entity`,
      );
    }

    for (const { node, parent } of chain) {
      if (!SimulationRegistry.entities.has(node)) {
        this.createEntity(node, parent ?? node);
      }
    }

    return SimulationRegistry.entities.get(e) as T;
  }

  private static createEntity(
    e: Simulation.Entity,
    parent: Simulation.Entity,
  ): SimulationEntity {
    const Ctor = this.getManager(e.category).from;
    const entity = new Ctor(e, parent);
    SimulationRegistry.entities.set(e, entity);
    return entity;
  }
}

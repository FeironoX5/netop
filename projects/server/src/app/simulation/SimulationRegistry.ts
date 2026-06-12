import { SimulationEntity } from '@entites/SimulationEntity';
import {
  PathSegment,
  Simulation as SimulationTypes,
} from '@netop/types';
import { TreeUtils } from '@netop/utils';
import { simulationTreeWalker } from '@simulation/helpers/simulationTreeWalker';
import { Simulation } from './Simulation';

type DetailsOf<T extends SimulationEntity> =
  T extends SimulationEntity<infer D> ? D : never;

type EntityManager<
  T extends SimulationEntity = SimulationEntity,
> = {
  // use only if you don't want result to be cached
  from: new (
    e: SimulationTypes.Entity,
    p?: SimulationTypes.Entity,
  ) => T;
  tick: (
    e: SimulationTypes.Entity & { details?: DetailsOf<T> },
  ) => void;
  build: (
    id: SimulationTypes.Entity['id'],
    ...args: string[]
  ) => SimulationTypes.Entity & { details?: DetailsOf<T> };
};

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

  private static simulation?: Simulation;

  static setManager<T extends SimulationEntity>(
    category: SimulationTypes.Category,
    manager: EntityManager<T>,
  ) {
    this.managers[category] = manager;
  }

  static getManager(category: SimulationTypes.Category) {
    const entry = SimulationRegistry.managers[category];
    if (!entry)
      throw new Error(
        `Entity category ${category} not registered. Use one of ${Object.keys(SimulationRegistry.managers).join(', ')}.`,
      );
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

  static getRootEntity() {
    return this.getEntity(this.get().root);
  }

  static getEntity<
    T extends SimulationEntity = SimulationEntity,
  >(e: SimulationTypes.Entity, path?: PathSegment[]): T {
    const cached = SimulationRegistry.entities.get(e) as
      | T
      | undefined;
    if (cached) return cached;

    if (!path || path.length === 0) {
      return this.createEntity(e, e) as T;
    }

    const chain = TreeUtils.resolveChain({
      root: this.get().root,
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
    e: SimulationTypes.Entity,
    parent: SimulationTypes.Entity,
  ): SimulationEntity {
    const Ctor = this.getManager(e.category).from;
    const entity = new Ctor(e, parent);
    SimulationRegistry.entities.set(e, entity);
    return entity;
  }
}

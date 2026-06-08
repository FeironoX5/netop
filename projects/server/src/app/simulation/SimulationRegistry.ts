import { SimulationEntity } from '@entites/SimulationEntity';
import { Simulation } from '@netop/types';

export class SimulationRegistry {
  static behaviours: Record<
    string,
    (e: Simulation.Entity) => void
  > = {
    entity: (e) =>
      e.children?.forEach((c) =>
        SimulationRegistry.getManager(c.category).tick(c),
      ),
  };

  static managers: Partial<
    Record<
      Simulation.Category,
      {
        tick: (e: Simulation.Entity) => void;
        build: (
          id: Simulation.Entity['id'],
          ...args: string[]
        ) => Simulation.Entity;
        from: (
          e: Simulation.Entity,
        ) => SimulationEntity<any>;
      }
    >
  > = {};

  static getManager(category: Simulation.Category) {
    const entry = SimulationRegistry.managers[category];
    if (!entry)
      throw new Error(
        `Entity category ${category} not registered`,
      );
    return entry;
  }
}

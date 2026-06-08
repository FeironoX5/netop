import { SceneCategory, Simulation } from '@netop/types';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import { SimulationEntity } from './SimulationEntity';

export class Scene extends SimulationEntity {
  static override ALLOWED_CHILD_CATEGORIES = null;

  static {
    SimulationRegistry.managers[SceneCategory] = {
      build: (id: Simulation.Entity['id']) => ({
        id,
        category: SceneCategory,
        name: 'scene',
        children: [],
      }),
      from: (e) => new Scene(e),
      tick(e) {
        SimulationRegistry.behaviours.entity(e);
      },
    };
  }
}

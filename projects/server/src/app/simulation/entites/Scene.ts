import { SceneCategory } from '@netop/types';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import { SimulationEntity } from './SimulationEntity';

export class Scene extends SimulationEntity {
  static override ALLOWED_CHILD_CATEGORIES = null;

  static {
    SimulationRegistry.setManager(SceneCategory, {
      build: (id) => ({
        id,
        category: SceneCategory,
        name: 'scene',
        children: [],
      }),
      from: Scene,
      tick(e) {
        SimulationRegistry.behaviours.entity(e);
      },
    });
  }
}

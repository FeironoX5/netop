import { EntityWrapper } from '@commands/interfaces/EntityWrapper';
import { Scene } from '@entites/Scene';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import { SimulationEntityWrapper } from './SimulationEntity.wrapper';

export const SceneWrapper: EntityWrapper<Scene> = {
  info: 'Used to manage the scene',
  commands: new Map([
    ...SimulationEntityWrapper<Scene>().commands.entries(),
    [
      'start',
      {
        info: 'Start the simulation clock',
        fn: () => {
          SimulationRegistry.get().start();
          return 'Simulation started';
        },
      },
    ],
    [
      'stop',
      {
        info: 'Stop the simulation clock',
        fn: () => {
          SimulationRegistry.get().stop();
          return 'Simulation stopped';
        },
      },
    ],
    [
      'tick',
      {
        info: 'Advance simulation by one tick',
        fn: () => {
          console.log('tick');
          SimulationRegistry.get().tick();
          return 'Tick';
        },
      },
    ],
  ]),
};

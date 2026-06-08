import { EntityWrapper } from '@commands/interfaces/EntityWrapper';
import { Scene } from '@entites/Scene';
import { SimulationEntityWrapper } from './SimulationEntity.wrapper';

export const SceneWrapper: EntityWrapper<Scene> = {
  info: 'Used to manage the scene',
  commands: new Map(
    SimulationEntityWrapper<Scene>().commands.entries(),
  ),
};

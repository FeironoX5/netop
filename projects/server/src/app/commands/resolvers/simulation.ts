import { EntityWrapper } from '@commands/interfaces/EntityWrapper';
import { treeResolver } from '@commands/treeResolver';
import { ComputerWrapper } from '@commands/wrappers/simulation/Computer.wrapper';
import { SceneWrapper } from '@commands/wrappers/simulation/Scene.wrapper';
import { SimulationEntity } from '@/app/simulation/interfaces/SimulationEntity';
import { DeviceType } from '@/app/simulation/types/Device.types';
import { SceneType } from '@/app/simulation/types/Scene.types';

const wrappers = new Map<string, EntityWrapper<SimulationEntity>>([
  [DeviceType.COMPUTER, ComputerWrapper as EntityWrapper<SimulationEntity>],
  [SceneType, SceneWrapper as EntityWrapper<SimulationEntity>],
  // Register HUB, ROUTER, SWITCH when implemented
]);

export const simulationResolver = (roots: SimulationEntity[]) =>
  treeResolver(roots, {
    match: (s, e) => {
      const entity = e as SimulationEntity;
      return entity.id === s || entity.name === s;
    },
    children: (e) => {
      const entity = e as SimulationEntity;
      return (entity as any).getChildren?.() ?? entity.children ?? [];
    },
    wrap: (e) => {
      const entity = e as SimulationEntity;
      const wrapper = wrappers.get(entity.type);
      if (!wrapper) throw new Error(`No wrapper for ${entity.type}`);
      return wrapper as EntityWrapper<unknown>;
    },
  });

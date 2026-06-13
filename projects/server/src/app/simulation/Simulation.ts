import {
  PathSegment,
  Simulation as SimulationType,
} from '@netop/types';
import { Timer, TreeUtils } from '@netop/utils';
import { simulationTreeWalker } from '@simulation/helpers/simulationTreeWalker';
import { SimulationRegistry } from './SimulationRegistry';

export class Simulation {
  constructor(
    public root: SimulationType.Entity,
    public timer: Timer = new Timer(() =>
      SimulationRegistry.getManager(
        this.root.category,
      ).tick(this.root),
    ),
  ) {}

  get rootEntity() {
    return SimulationRegistry.fromChain([this.root]);
  }

  resolve(path: PathSegment[]) {
    const chain = TreeUtils.resolveByPartialPath({
      root: this.root,
      walker: simulationTreeWalker,
    })(path);
    if (!chain) return undefined;
    return {
      entity: SimulationRegistry.fromChain(chain.chain),
      path: chain.path,
    };
  }

  resolveFull(path: PathSegment[]) {
    const chain = TreeUtils.resolveByFullPath({
      root: this.root,
      walker: simulationTreeWalker,
    })(path);
    if (!chain) return undefined;
    return SimulationRegistry.fromChain(chain);
  }
}

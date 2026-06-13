import {
  PathSegment,
  Simulation as SimulationType,
} from '@netop/types';
import { TreeUtils } from '@netop/utils';
import { simulationTreeWalker } from '@simulation/helpers/simulationTreeWalker';
import { SimulationRegistry } from './SimulationRegistry';

export class Simulation {
  private timer: NodeJS.Timeout | null = null;

  constructor(public root: SimulationType.Entity) {}

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

  start(tickInterval: number = 1000) {
    if (this.timer) return;
    this.timer = setInterval(
      () => this.tick(),
      tickInterval,
    );
  }

  stop() {
    if (!this.timer) return;
    clearInterval(this.timer);
    this.timer = null;
  }

  tick() {
    SimulationRegistry.getManager(this.root.category).tick(
      this.root,
    );
  }
}

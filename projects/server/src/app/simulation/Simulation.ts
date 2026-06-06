import { Simulation as SimulationType } from '@netop/types';
import { SimulationRegistry } from './SimulationRegistry';

export class Simulation {
  private timer: NodeJS.Timeout | null = null;

  constructor(public root: SimulationType.Entity) {}

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

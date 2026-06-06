import type { Simulation } from '@netop/types';

export class SimulationBus {
  private subscribers = new Set<
    (event: Simulation.Event) => void
  >();

  subscribe(
    f: (event: Simulation.Event) => void,
  ): () => void {
    this.subscribers.add(f);
    return () => {
      this.subscribers.delete(f);
    };
  }

  publish(event: Simulation.Event): void {
    for (const f of this.subscribers) {
      f(event);
    }
  }
}

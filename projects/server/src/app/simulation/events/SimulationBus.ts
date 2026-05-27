import { SimulationEntityEvent } from '@netop/types';

export class SimulationBus {
  private subscribers = new Set<
    (event: SimulationEntityEvent) => void
  >();

  subscribe(
    f: (event: SimulationEntityEvent) => void,
  ): () => void {
    this.subscribers.add(f);
    return () => {
      this.subscribers.delete(f);
    };
  }

  publish(event: SimulationEntityEvent): void {
    for (const f of this.subscribers) {
      f(event);
    }
  }
}

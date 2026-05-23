import { SimulationEntityEvent } from '@netop/types';

export class SimulationBus {
  protected _subscribers = new Set<
    (event: SimulationEntityEvent) => void
  >();

  subscribe(
    f: (event: SimulationEntityEvent) => void,
  ): void {
    this._subscribers.add(f);
  }

  unsubscribe(
    f: (event: SimulationEntityEvent) => void,
  ): void {
    this._subscribers.delete(f);
  }

  publish(event: SimulationEntityEvent): void {
    for (const f of this._subscribers) {
      f(event);
    }
  }
}

export const simulationBus = new SimulationBus();

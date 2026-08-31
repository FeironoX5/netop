import { EventTarget } from '@netop/utils';
import { SimulationRegistry } from '../SimulationRegistry';
import { invertSimulationEvent } from './simulationEvent.utils';
import { SimulationEvent } from './types';

type EventApplier = (event: SimulationEvent.type) => void;

export class SimulationUndoHandler {
  private eventCounter = 0;
  private history = new Map<number, SimulationEvent.type>();
  readonly eventBus = new EventTarget<{
    id: number;
    event: SimulationEvent.type;
  }>();

  constructor(
    private appliers: Record<
      SimulationEvent.type['scope'],
      EventApplier
    >,
  ) {
    SimulationRegistry.get().eventBus.subscribe((e) => {
      const id = this.eventCounter++;
      this.history.set(id, e);
      this.eventBus.call({ id, event: e });
    });
  }

  undo(eventId: number): void {
    const event = this.history.get(eventId);
    if (!event) throw new Error('event not found');
    const inverse = invertSimulationEvent(event);
    this.appliers[inverse.scope](inverse);
    this.history.delete(eventId);
  }
}

import { EventTarget } from '@netop/utils';
import { SimulationRegistry } from '../SimulationRegistry';
import { invertSimulationEvent } from './simulationEvent.utils';
import { SimulationEvent } from './types';

type EventApplier = (
  event: SimulationEvent.MutationType,
) => void;

type EventEntry = {
  id: number;
  event: SimulationEvent.MutationType;
};

type EventGroup = EventEntry[];

export class SimulationUndoHandler {
  private eventCounter = 0;
  private history = new Map<number, EventGroup>();
  private activeGroup?: EventGroup;
  readonly eventBus = new EventTarget<EventEntry>();

  constructor(
    private appliers: Record<
      SimulationEvent.MutationType['scope'],
      EventApplier
    >,
  ) {
    SimulationRegistry.get().eventBus.subscribe((e) => {
      if (e.scope === 'log') return;

      const id = this.eventCounter++;
      const group = this.activeGroup ?? [];
      const entry = { id, event: e };
      group.push(entry);
      this.history.set(id, group);
      this.eventBus.call(entry);
    });
  }

  group<Result>(action: () => Result): Result {
    if (this.activeGroup) return action();

    this.activeGroup = [];
    try {
      return action();
    } finally {
      this.activeGroup = undefined;
    }
  }

  undo(eventId: number): void {
    const group = this.history.get(eventId);
    if (!group) throw new Error('event not found');

    this.group(() => {
      group
        .slice()
        .reverse()
        .forEach(({ event }) => {
          const inverse = invertSimulationEvent(event);
          this.appliers[inverse.scope](inverse);
        });
    });
    group.forEach(({ id }) => this.history.delete(id));
  }
}

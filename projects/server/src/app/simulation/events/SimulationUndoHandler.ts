import { EventTarget } from '@netop/utils';
import { SimulationRegistry } from '../SimulationRegistry';
import { SimulationEvent } from './types';

type ScopeApplier = (event: SimulationEvent.type) => void;

export class SimulationUndoHandler {
  private eventCounter = 0;
  private history = new Map<number, SimulationEvent.type>();
  readonly eventBus = new EventTarget<{
    id: number;
    event: SimulationEvent.type;
  }>();

  constructor(
    private scopes: Record<
      SimulationEvent.type['scope'],
      ScopeApplier
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
    this.handleUndo(event);
  }

  private handleUndo(event: SimulationEvent.type): void {
    switch (event.operation) {
      case 'create':
        break;
      case 'delete':
        break;
      case 'update':
        break;
      default:
        break;
    }
  }
}

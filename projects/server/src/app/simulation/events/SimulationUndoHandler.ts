import { EventTarget } from '@netop/utils';
import { SimulationEvent } from './types';

type ScopeApplier = (event: SimulationEvent.type) => void;

export class SimulationUndoHandler {
  private eventCounter = 0;
  private history = new Map<string, SimulationEvent.type>();

  constructor(
    private eventSource: EventTarget<SimulationEvent.type>,
    private scopes: Record<
      SimulationEvent.type['scope'],
      ScopeApplier
    >,
  ) {
    this.eventSource.subscribe((e) => {
      this.history.set(String(this.eventCounter++), e);
    });
  }

  undo(eventId: string): void {
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

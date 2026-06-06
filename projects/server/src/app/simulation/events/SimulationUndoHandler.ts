import type { Simulation } from '@netop/types';
import { simulationBus } from '@/app/main';

export class SimulationUndoHandler {
  private eventCounter = 0;
  private history = new Map<string, Simulation.Event>();

  constructor() {
    simulationBus.subscribe((event) => {
      this.history.set(String(this.eventCounter++), event);
    });
  }

  undo(eventId: string): void {
    const event = this.history.get(eventId);
    if (!event) throw new Error('event not found');
    this.handleUndo(event);
  }

  private handleUndo(event: Simulation.Event): void {
    switch (event.type) {
      case 'create':
        break;
      case 'delete':
        break;
      default:
        break;
    }
  }
}

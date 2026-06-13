import { SimulationRegistry } from '@/app/simulation/SimulationRegistry';
import { SimulationEvent } from './types';

type ScopeManager = (event: SimulationEvent.type) => void;

export class SimulationUndoHandler {
  private static scopes: Partial<
    Record<SimulationEvent.type['scope'], ScopeManager>
  > = {};

  static setManager(
    scope: SimulationEvent.type['scope'],
    manager: ScopeManager,
  ): void {
    SimulationUndoHandler.scopes[scope] = manager;
  }

  static getManager(
    scope: SimulationEvent.type['scope'],
  ): ScopeManager {
    return (
      SimulationUndoHandler.scopes[scope] ?? (() => {})
    );
  }

  private eventCounter = 0;
  private history = new Map<string, SimulationEvent.type>();

  constructor() {
    SimulationRegistry.root().subscribe((event) => {
      this.history.set(String(this.eventCounter++), event);
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

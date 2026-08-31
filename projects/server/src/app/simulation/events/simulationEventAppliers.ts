import { SimulationRegistry } from '../SimulationRegistry';
import { SimulationEvent } from './types';

type EventApplier = (event: SimulationEvent.type) => void;

function getEntity(path: string[]) {
  const entity = SimulationRegistry.get().resolveFull(path);
  if (!entity) throw new Error('entity not found');
  return entity;
}

export const simulationEventAppliers = {
  entity(event) {
    if (event.scope !== 'entity') return;

    switch (event.operation) {
      case 'create':
        getEntity(event.parentPath).addChild(event.data);
        break;
      case 'delete':
        getEntity(event.parentPath).removeChild(
          event.data.id,
        );
        break;
      case 'update':
        getEntity([
          ...event.parentPath,
          event.data.id,
        ]).update(event.data);
        break;
    }
  },
  connection(event) {
    if (event.scope !== 'connection') return;

    const simulation = SimulationRegistry.get();

    switch (event.operation) {
      case 'create':
        simulation.addConnection(event.data);
        break;
      case 'delete':
        if (!simulation.removeConnection(event.data.id)) {
          throw new Error('connection not found');
        }
        break;
      case 'update':
        simulation.updateConnection(event.data);
        break;
    }
  },
} satisfies Record<
  SimulationEvent.type['scope'],
  EventApplier
>;

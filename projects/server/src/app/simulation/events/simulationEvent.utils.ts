import { SimulationEvent } from './types';

export function invertSimulationEvent(
  event: SimulationEvent.type,
): SimulationEvent.type {
  switch (event.operation) {
    case 'create':
      return { ...event, operation: 'delete' };
    case 'delete':
      return { ...event, operation: 'create' };
    case 'update':
      if (event.scope === 'entity') {
        return {
          ...event,
          data: event.oldData,
          oldData: event.data,
        };
      }

      return {
        ...event,
        data: event.oldData,
        oldData: event.data,
      };
  }
}

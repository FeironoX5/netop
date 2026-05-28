import { EntityWrapper } from '@commands/interfaces/EntityWrapper';
import { SimulationUndoHandler } from '@events/SimulationUndoHandler';

export const SimulationUndoHandlerWrapper: EntityWrapper<SimulationUndoHandler> =
  {
    commands: new Map([
      [
        'undo',
        {
          args: ['eventId'],
          fn: (handler, eventId) => {
            handler.undo(eventId);
            return `Event with id ${eventId} undone`;
          },
        },
      ],
    ]),
  };

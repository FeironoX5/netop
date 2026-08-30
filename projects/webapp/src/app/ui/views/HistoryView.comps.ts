import {
  ClientMessageType,
  ServerMessageType,
  type ClientMessage,
  type ServerMessage,
  type SimulationEventMessage,
} from '@netop/types';
import { ActionCodec } from '@netop/utils';

export function useHandlers(
  subscribe: (
    handler: (message: ServerMessage) => void,
  ) => () => void,
  enqueue: (message: ClientMessage) => void,
  addEvent: (event: SimulationEventMessage) => void,
) {
  let unsubscribe: (() => void) | undefined;

  function message(message: ServerMessage) {
    if (message.type !== ServerMessageType.SimulationEvent)
      return;

    addEvent(message);
  }

  return {
    mount: () => {
      unsubscribe = subscribe(message);
    },

    undo: (id: number) => {
      enqueue({
        type: ClientMessageType.Action,
        body: ActionCodec.serialize({
          path: ['!'],
          commandName: 'undo',
          args: [String(id)],
        }),
      });
    },

    unmount: () => unsubscribe?.(),
  };
}

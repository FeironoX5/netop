import {
  ClientMessageType,
  type ClientMessage,
} from '@netop/types';
import { ActionCodec } from '@netop/utils';

export function useHandlers(
  enqueue: (message: ClientMessage) => void,
) {
  return {
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
  };
}

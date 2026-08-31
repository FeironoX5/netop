import {
  ClientMessageType,
  type ClientMessage,
} from '@netop/types';

export function useHandlers(
  enqueue: (message: ClientMessage) => void,
  commandSubmitted: (command: string) => void,
) {
  return {
    submit: (input: string) => {
      const command = input.trim();
      if (!command) return;

      enqueue({
        type: ClientMessageType.Action,
        body: command,
      });
      commandSubmitted(command);
    },
  };
}

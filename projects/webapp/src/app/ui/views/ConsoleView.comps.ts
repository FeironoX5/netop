import {
  ClientMessageType,
  ServerMessageType,
  type ActionResponseMessage,
  type ClientMessage,
  type ServerMessage,
} from '@netop/types';

export type ConsoleLogEntry = {
  timestamp: Date;
  message: ActionResponseMessage;
};

export function useHandlers(
  subscribe: (
    handler: (message: ServerMessage) => void,
  ) => () => void,
  enqueue: (message: ClientMessage) => void,
  addLogEntry: (entry: ConsoleLogEntry) => void,
  commandSubmitted: (command: string) => void,
) {
  let unsubscribe: (() => void) | undefined;

  function message(message: ServerMessage) {
    if (message.type !== ServerMessageType.ActionResponse)
      return;

    addLogEntry({ timestamp: new Date(), message });
  }

  return {
    mount: () => {
      unsubscribe = subscribe(message);
    },

    submit: (input: string) => {
      const command = input.trim();
      if (!command) return;

      enqueue({
        type: ClientMessageType.Action,
        body: command,
      });
      commandSubmitted(command);
    },

    unmount: () => unsubscribe?.(),
  };
}

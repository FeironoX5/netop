import {
  ServerMessageType,
  type ServerMessage,
  type StatusMessage,
} from '@netop/types';

export function useHandlers(
  connect: () => void,
  disconnect: () => void,
  subscribe: (
    handler: (message: ServerMessage) => void,
  ) => () => void,
  reportStatus: (message: StatusMessage) => void,
) {
  let unsubscribe: (() => void) | undefined;

  function message(message: ServerMessage) {
    if (message.type === ServerMessageType.Status) {
      reportStatus(message);
    }
  }

  return {
    mount: () => {
      unsubscribe = subscribe(message);
      connect();
    },
    unmount: () => {
      unsubscribe?.();
      disconnect();
    },
  };
}

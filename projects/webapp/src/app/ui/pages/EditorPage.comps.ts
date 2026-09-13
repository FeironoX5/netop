import {
  ServerMessageType,
  type ServerMessage,
  type LogMessage,
} from '@netop/types';

export function useHandlers(
  connect: () => void,
  disconnect: () => void,
  subscribe: (
    handler: (message: ServerMessage) => void,
  ) => () => void,
  reportLog: (message: LogMessage) => void,
) {
  let unsubscribe: (() => void) | undefined;

  function message(message: ServerMessage) {
    if (message.type === ServerMessageType.Log) {
      reportLog(message);
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

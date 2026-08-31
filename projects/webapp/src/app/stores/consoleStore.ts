import {
  ServerMessageType,
  type ActionResponseMessage,
  type ServerMessage,
} from '@netop/types';
import { defineStore } from 'pinia';
import { onScopeDispose, ref } from 'vue';
import { wsService } from '../services/wsService';

export type ConsoleLogEntry = {
  timestamp: Date;
  message: ActionResponseMessage;
};

export const useConsoleStore = defineStore(
  'console',
  () => {
    const log = ref<ConsoleLogEntry[]>([]);
    const commandHistory = ref<string[]>([]);

    function receive(message: ServerMessage): void {
      if (message.type !== ServerMessageType.ActionResponse)
        return;

      log.value.push({ timestamp: new Date(), message });
    }

    function addCommand(command: string): void {
      commandHistory.value.push(command);
    }

    function clearLog(): void {
      log.value = [];
    }

    onScopeDispose(wsService.subscribe(receive));

    return {
      log,
      commandHistory,
      addCommand,
      clearLog,
    } as const;
  },
);

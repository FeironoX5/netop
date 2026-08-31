import {
  ServerMessageType,
  type ServerMessage,
  type SimulationEventMessage,
} from '@netop/types';
import { defineStore } from 'pinia';
import { onScopeDispose, ref } from 'vue';
import { wsService } from '../services/wsService';

export const useHistoryStore = defineStore(
  'history',
  () => {
    const history = ref<SimulationEventMessage[]>([]);

    function receive(message: ServerMessage): void {
      if (
        message.type !== ServerMessageType.SimulationEvent
      )
        return;

      history.value.push(message);
    }

    onScopeDispose(wsService.subscribe(receive));

    return { history } as const;
  },
);

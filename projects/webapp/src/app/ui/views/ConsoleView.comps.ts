import {
  ClientMessageType,
  ServerMessageType,
  type ConsoleOutputMessage,
} from '@netop/types';
import { onUnmounted, type Ref } from 'vue';
import { wsService } from '@/app/services/wsService';
import { useWsStore } from '@/app/stores/wsStore';

export function useHandlers(
  input: Ref<string>,
  focused: Ref<boolean>,
  outputArea: Ref<HTMLElement | null>,
  scrollY: Ref<number>,
  history: Ref<string[]>,
  log: Ref<ConsoleOutputMessage[]>,
) {
  const wsStore = useWsStore();
  const unsubscribe = wsService.subscribe((message) => {
    if (message.type === ServerMessageType.ConsoleOutput) {
      log.value.push(message);
    }
  });
  onUnmounted(unsubscribe);

  return {
    logChange: () => {
      const el = outputArea.value;
      if (!el) return;
      scrollY.value = -el.scrollHeight;
    },
    submit: () => {
      const cmd = input.value.trim();
      if (!cmd) return;
      history.value.push(cmd);
      wsStore.enqueue({
        type: ClientMessageType.Action,
        body: cmd,
      });
      input.value = '';
      focused.value = true;
    },
  };
}

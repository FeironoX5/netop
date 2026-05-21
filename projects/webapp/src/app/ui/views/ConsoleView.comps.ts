import type { Ref } from 'vue';
import { wsService } from '@/app/services/wsService';

export function useHandlers(
  input: Ref<string>,
  focused: Ref<boolean>,
  outputArea: Ref<HTMLElement | null>,
  scrollY: Ref<number>,
) {
  return {
    mount: () => wsService.connect(),
    logChange: () => {
      const el = outputArea.value;
      if (!el) return;
      scrollY.value = -el.scrollHeight;
    },
    submit: () => {
      const cmd = input.value.trim();
      if (!cmd) return;
      wsService.sendCommand(cmd);
      input.value = '';
      focused.value = true;
    },
  };
}

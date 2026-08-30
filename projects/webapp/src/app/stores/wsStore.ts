import type { ClientMessage } from '@netop/types';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useWsStore = defineStore('ws', () => {
  const queue = ref<ClientMessage[]>([]);

  function enqueue(message: ClientMessage): void {
    queue.value.push(message);
  }

  function removeHead(): ClientMessage | undefined {
    return queue.value.shift();
  }

  return { queue, enqueue, removeHead } as const;
});

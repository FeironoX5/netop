import type { ClientMessage } from '@netop/types';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useWsStore = defineStore('ws', () => {
  const queue = ref<ClientMessage[]>([]);

  function enqueue(message: ClientMessage): void {
    queue.value.push(message);
  }

  function remove(message: ClientMessage): void {
    const index = queue.value.indexOf(message);
    if (index !== -1) queue.value.splice(index, 1);
  }

  function removeHead(): ClientMessage | undefined {
    return queue.value.shift();
  }

  return { queue, enqueue, remove, removeHead } as const;
});

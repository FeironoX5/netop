import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

type Connection = { url: string; port: number };

export const useAppStore = defineStore('app', () => {
  const state = {
    connections: ref<Connection[]>([]),
    activeConnection: ref<number | null>(null),
  };

  return {
    ...state,
    connection: computed(() => {
      const activeConnection = state.activeConnection.value;
      return (
        activeConnection !== null &&
        state.connections.value[activeConnection]
      );
    }),
    setConnection(index: number) {
      state.activeConnection.value = index;
    },
  } as const;
});

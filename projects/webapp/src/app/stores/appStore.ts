import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export type Connection = { url: string; port: number };

const DEFAULT_CONNECTION: Connection = {
  url: 'localhost',
  port: 3001,
};

export const useAppStore = defineStore('app', () => {
  const state = {
    connections: ref<Connection[]>([DEFAULT_CONNECTION]),
    activeConnection: ref(0),
  };

  return {
    ...state,
    connection: computed(
      () =>
        state.connections.value[
          state.activeConnection.value
        ],
    ),
    setConnection(index: number) {
      state.activeConnection.value = index;
    },
    addConnection(connection: Connection) {
      const index = state.connections.value.findIndex(
        (current) =>
          current.url === connection.url &&
          current.port === connection.port,
      );

      state.activeConnection.value =
        index === -1
          ? state.connections.value.push(connection) - 1
          : index;
    },
  } as const;
});

import { defineStore } from 'pinia';
import { ref } from 'vue';

export type Connection = { url: string; port: number };

const DEFAULT_CONNECTION: Connection = {
  url: 'localhost',
  port: 3001,
};

export const useAppStore = defineStore('app', () => {
  const state = {
    connections: ref(new Set([DEFAULT_CONNECTION])),
    connection: ref<Connection | null>(DEFAULT_CONNECTION),
  };

  return {
    ...state,
    setConnection(connection: Connection) {
      state.connection.value = connection;
    },
    addConnection(connection: Connection) {
      state.connections.value.add(connection);
      state.connection.value = connection;
    },
  } as const;
});

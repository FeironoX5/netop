import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { httpService } from '../services/httpService';
import { useAppStore } from './appStore';

export const useSimulationStore = defineStore(
  'simulation',
  () => {
    const state = {
      entities: ref<Array<any> | null>(null),
      loading: ref(false),
      error: ref<any>(null),
    };

    async function fetchEntities() {
      if (state.loading.value) return;
      const p = httpService.get('scene');
      if (!p) return;
      state.loading.value = true;
      state.error.value = null;
      p.then((r) => {
        state.entities.value = r;
      })
        .catch((err) => {
          state.error.value = err;
        })
        .finally(() => {
          state.loading.value = false;
        });
    }

    watch(() => useAppStore().connection, fetchEntities);

    return { ...state, fetchEntities } as const;
  },
);

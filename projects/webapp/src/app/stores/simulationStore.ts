import {
  ServerMessageType,
  type FlatSimulationEntity,
  type ServerMessage,
  type Simulation,
  type SimulationEventMessage,
  type SimulationSnapshot,
} from '@netop/types';
import { defineStore } from 'pinia';
import { onScopeDispose, ref, watch } from 'vue';
import { httpService } from '../services/httpService';
import { wsService } from '../services/wsService';
import { getSimulationEntityPath } from '../utils/simulation';

function toFlatSimulationEntity(
  entity: Simulation.Entity,
): FlatSimulationEntity {
  const { children: _children, ...flatEntity } = entity;
  return flatEntity;
}

export const useSimulationStore = defineStore(
  'simulation',
  () => {
    const entities = ref(
      new Map<string, FlatSimulationEntity>(),
    );
    const connections = ref(
      new Map<string, Simulation.Connection>(),
    );
    const loading = ref(false);
    const error = ref<unknown>();

    const pendingEvents: SimulationEventMessage[] = [];
    let activeRequest: AbortController | undefined;

    function apply(message: SimulationEventMessage): void {
      const event = message.event;
      if (event.scope === 'connection') {
        if (event.operation === 'delete') {
          connections.value.delete(event.data.id);
        } else {
          connections.value.set(event.data.id, event.data);
        }
      } else {
        const path = getSimulationEntityPath(event);

        if (event.operation === 'delete') {
          entities.value.delete(path);
        } else {
          entities.value.set(
            path,
            toFlatSimulationEntity(event.data),
          );
        }
      }
    }

    function receive(message: ServerMessage): void {
      if (
        message.type !== ServerMessageType.SimulationEvent
      ) {
        return;
      }

      if (loading.value) {
        pendingEvents.push(message);
        return;
      }

      apply(message);
    }

    async function synchronize(): Promise<void> {
      activeRequest?.abort();
      const request = new AbortController();
      activeRequest = request;
      pendingEvents.length = 0;
      entities.value = new Map();
      connections.value = new Map();
      loading.value = true;
      error.value = undefined;

      try {
        const snapshot =
          await httpService.get<SimulationSnapshot>(
            'simulation',
            request.signal,
          );
        if (!snapshot || request.signal.aborted) return;

        entities.value = new Map(
          Object.entries(snapshot.entities),
        );
        connections.value = new Map(
          Object.entries(snapshot.connections),
        );

        pendingEvents.forEach(apply);
        pendingEvents.length = 0;
      } catch (cause) {
        if (!request.signal.aborted) {
          error.value = cause;
          pendingEvents.length = 0;
        }
      } finally {
        if (activeRequest === request) {
          activeRequest = undefined;
          loading.value = false;
        }
      }
    }

    const unsubscribe = wsService.subscribe(receive);
    onScopeDispose(() => {
      unsubscribe();
      activeRequest?.abort();
    });

    watch(
      wsService.status,
      (status) => {
        if (status === 'OPEN') {
          void synchronize();
          return;
        }

        activeRequest?.abort();
        activeRequest = undefined;
        pendingEvents.length = 0;
        loading.value = false;
      },
      { flush: 'sync', immediate: true },
    );

    return {
      entities,
      connections,
      loading,
      error,
      synchronize,
    } as const;
  },
);

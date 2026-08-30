<template>
  <div class="history-view inline-container column full">
    <div class="output-area">
      <div class="inline-container column reversed">
        <div
          class="inline-container column output-item"
          v-for="message in history"
        >
          <div
            class="inline-container row output-item-header"
            :class="getEventClass(message.event)"
          >
            <Button
              class="event-id"
              :icon="getEventIcon(message.event)"
              :text="String(message.id)"
              disabled
            />
            <span class="spacer" />
            <ButtonSections class="output-item-action">
              <Button
                icon="copy"
                @click="copy(String(message.id))"
              />
              <Button
                icon="undo-2"
                @click="handlers.undo(message.id)"
              />
            </ButtonSections>
          </div>
          <div
            v-if="message.event.scope === 'entity'"
            class="event-table"
          >
            <div class="event-row">
              <div class="event-field">
                <span class="event-label">Name</span>
                <span>{{
                  message.event.data.name ?? '—'
                }}</span>
              </div>
            </div>
            <div class="event-row">
              <div class="event-field">
                <span class="event-label">Category</span>
                <span>{{
                  message.event.data.category
                }}</span>
              </div>
              <div class="event-field">
                <span class="event-label">Parent</span>
                <span>{{
                  formatPath(message.event.parentPath)
                }}</span>
              </div>
            </div>
          </div>
          <div v-else class="event-table">
            <div class="event-row">
              <div class="event-field">
                <span class="event-label">From</span>
                <span>{{
                  formatEndpoint(message.event.data.left)
                }}</span>
              </div>
              <div class="event-field">
                <span class="event-label">To</span>
                <span>{{
                  formatEndpoint(message.event.data.right)
                }}</span>
              </div>
            </div>
            <div class="event-row">
              <div class="event-field">
                <span class="event-label">Speed</span>
                <span
                  >{{
                    message.event.data.speed
                  }}
                  symbols/tick</span
                >
              </div>
              <div class="event-field">
                <span class="event-label">Delay</span>
                <span
                  >{{
                    message.event.data.delay
                  }}
                  ticks</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@bits/Button.vue';
import ButtonSections from '@bits/ButtonSections.vue';
import type { SimulationEventMessage } from '@netop/types';
import { useClipboard } from '@vueuse/core';
import { onMounted, onUnmounted, ref } from 'vue';
import { wsService } from '@/app/services/wsService';
import { useWsStore } from '@/app/stores/wsStore';
import { useHandlers } from './HistoryView.comps';
import {
  formatEndpoint,
  formatPath,
  getEventClass,
  getEventIcon,
} from './HistoryView.utils';

const history = ref<SimulationEventMessage[]>([]);
const wsStore = useWsStore();
const { copy } = useClipboard();
const handlers = useHandlers(
  (handler) => wsService.subscribe(handler),
  (message) => wsStore.enqueue(message),
  (message) => history.value.push(message),
);

onMounted(handlers.mount);
onUnmounted(handlers.unmount);
</script>

<style scoped>
.history-view {
  min-height: 0;
}

.output-area {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding-bottom: 30vh;
  background: var(--c-l0-bg);
}

.output-item:first-child {
  border-bottom: var(--border);
}

.output-item .output-item-action {
  visibility: hidden;
}

.output-item:hover .output-item-action {
  visibility: visible;
}

.event-table {
  width: 100%;
  font-family: var(--f-code);
}

.event-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.event-row:not(:last-child) {
  border-bottom: var(--border);
}

.event-field {
  display: flex;
  flex-direction: column;
  gap: var(--s-gap);
  min-width: 0;
  padding: var(--s-spacing);
  overflow-wrap: anywhere;
}

.event-field + .event-field {
  border-left: var(--border);
}

.event-field:only-child {
  grid-column: 1 / -1;
}

.event-label {
  color: var(--c-placeholder-text);
  font-family: var(--f-main);
  font-size: var(--s-font-size-sm);
  text-transform: uppercase;
}

.output-item-header {
  align-items: center;
  min-height: calc(
    var(--s-font-size) + 2 * var(--s-spacing-sm)
  );
  gap: var(--s-gap);
  padding: var(--s-spacing);
  font-size: var(--s-font-size-sm);
}

.output-item-header.success {
  color: var(--c-success-text);
  background: var(--c-success-bg);
}

.output-item-header.warning {
  color: var(--c-warning-text);
  background: var(--c-warning-bg);
}

.output-item-header.error {
  color: var(--c-error-text);
  background: var(--c-error-bg);
}

:deep(.event-id:disabled) {
  cursor: default;
  color: inherit;
  background: transparent;
  opacity: 1;
}
</style>

<template>
  <div class="history-view inline-container column full">
    <div class="output-area">
      <EmptyView v-if="history.length === 0">
        No simulation events
      </EmptyView>
      <div v-else class="inline-container column reversed">
        <EventDetails
          v-for="message in history"
          :key="message.id"
          :message="message"
        >
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
        </EventDetails>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@bits/Button.vue';
import ButtonSections from '@bits/ButtonSections.vue';
import EmptyView from '@components/EmptyView.vue';
import { useClipboard } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { useHistoryStore } from '@/app/stores/historyStore';
import { useWsStore } from '@/app/stores/wsStore';
import EventDetails from '../parts/EventDetails.vue';
import { useHandlers } from './HistoryView.comps';

const historyStore = useHistoryStore();
const { history } = storeToRefs(historyStore);
const wsStore = useWsStore();
const { copy } = useClipboard();
const handlers = useHandlers((message) =>
  wsStore.enqueue(message),
);
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

:deep(.details-item:first-child) {
  border-bottom: var(--border);
}

:deep(.details-item .output-item-action) {
  visibility: hidden;
}

:deep(.details-item:hover .output-item-action) {
  visibility: visible;
}
</style>

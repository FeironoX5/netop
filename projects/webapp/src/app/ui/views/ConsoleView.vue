<template>
  <div class="console-view inline-container column full">
    <div class="input-area inline-container row full">
      <span class="prefix">></span>
      <Textarea
        class="prompt"
        placeholder="Type :help to list commands"
        :rows="1"
        v-model="input"
        @keydown.enter.exact.prevent="submit"
      />
    </div>
    <div class="filter-area inline-container row full" :class="{ collapsed: filterCollapsed }">
      <div class="filter-content">
        <ButtonMultiGroup
          :items="filterItems"
          :isSelectable="true"
          v-model:activeItemIndexes="activeItemIndexes"
        />
      </div>
      <Button
        class="filter-toggle"
        :icon="filterCollapsed ? 'chevrons-up-down' : 'chevrons-down-up'"
        @click="filterCollapsed = !filterCollapsed"
      />
    </div>
    <div class="output-area">
      <div class="output-item inline-container column" v-for="entry in filteredLog" :key="entry.id">
        <span class="output-item-content">{{ entryText(entry.message) }}</span>
        <div class="output-item-actions inline-container row">
          <span class="output-item-type" :class="entry.message.type">{{ entry.message.type }}</span>
          <span class="timestamp">{{ formatTime(entry.timestamp) }}</span>
          <span class="spacer" />
          <Button icon="copy" @click="copy(entry)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@bits/Button.vue';
import Textarea from '@bits/Textarea.vue';
import ButtonMultiGroup from '@components/ButtonMultiGroup.vue';
import type { ServerMessage } from '@netop/types';
import type { LogEntry } from '@shared/composables/useWs';
import { useWs } from '@shared/composables/useWs';
import { computed, onMounted, ref } from 'vue';

const MESSAGE_TYPES: ServerMessage['type'][] = ['connected', 'pong', 'commandResult', 'error'];

const filterItems = MESSAGE_TYPES.map((t) => ({ name: t }));

const filterCollapsed = ref<boolean>(false);

const { connect, sendCommand, log, connected } = useWs();

const input = ref('');
const activeItemIndexes = ref<number[]>([]);

onMounted(connect);

const activeTypes = computed<ServerMessage['type'][]>(() =>
  activeItemIndexes.value.length === 0
    ? MESSAGE_TYPES
    : activeItemIndexes.value.map((i) => MESSAGE_TYPES[i]!),
);

const filteredLog = computed(() =>
  log.value.filter((e) => activeTypes.value.includes(e.message.type)),
);

function submit() {
  const cmd = input.value.trim();
  if (!cmd || !connected.value) return;
  sendCommand(cmd);
  input.value = '';
}

function entryText(msg: ServerMessage): string {
  switch (msg.type) {
    case 'commandResult':
      return msg.result;
    case 'error':
      return msg.message;
    default:
      return '—';
  }
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function copy(entry: LogEntry) {
  navigator.clipboard.writeText(entryText(entry.message));
}
</script>

<style scoped>
.input-area {
  background: var(--c-l0-bg);
  font-family: var(--f-code);
  line-height: 1;
  padding: var(--s-spacing);
  gap: 5px;
}
.prompt {
  flex: 1;
}
.prefix {
  user-select: none;
  color: var(--c-border);
}

.filter-area {
  align-items: flex-start;
  padding: var(--s-spacing);

  .filter-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 5px;

    :deep(.button-group-item) {
      flex-shrink: 0;
    }
  }

  .filter-toggle {
    flex-shrink: 0;
  }

  &.collapsed .filter-content {
    flex-wrap: nowrap;
    overflow-x: auto;

    &:deep(button) {
      flex: 1 0 auto;
    }
  }
}
.output-area {
  background: var(--c-l0-bg);
  flex: 1;
  overflow-y: scroll;
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-end;
  padding-bottom: 30vh;
}
.output-item {
  display: block;
  border-bottom: 1px solid var(--c-border);
  padding: var(--s-spacing);
}
.output-item-type {
  font-size: var(--s-font-size-sm);
  color: var(--c-border);

  &.error {
    color: color-mix(in srgb, red 70%, var(--c-text));
  }
  &.commandResult {
    color: color-mix(in srgb, lime 50%, var(--c-text));
  }
  &.connected {
    color: color-mix(in srgb, cyan 50%, var(--c-text));
  }
}
.output-item-content {
  font-family: var(--f-code);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.output-item-actions {
  gap: 5px;
  font-size: var(--s-font-size-sm);
}
</style>

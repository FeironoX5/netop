<template>
  <div class="console-view inline-container column full">
    <div class="input-area inline-container row full">
      <span class="prefix">></span>
      <Textarea
        ref="promptTextarea"
        class="prompt"
        placeholder="Type help to list commands"
        :rows="1"
        v-model="input"
        @keydown.enter.exact.prevent="handlers.submit()"
      />
    </div>
    <div
      class="filter-area inline-container row full"
      :class="{ collapsed: filterCollapsed }"
    >
      <div class="filter-content">
        <ButtonMultiGroup
          :items="FILTER_ITEMS"
          :isSelectable="true"
          v-model:activeItemIndexes="activeItemIndexes"
        />
      </div>
      <Button
        class="filter-toggle"
        :icon="
          filterCollapsed
            ? 'chevrons-up-down'
            : 'chevrons-down-up'
        "
        @click="filterCollapsed = !filterCollapsed"
      />
    </div>
    <div class="action-area">
      <Button icon="trash" text="Clear" />
    </div>
    <div class="output-area" ref="outputArea">
      <div class="inline-container column reversed">
        <div
          class="inline-container column output-item"
          v-for="entry in [] as any[]"
          :key="entry.id"
        >
          <span class="output-item-content">
            {{ getEntryText(entry.message) }}
          </span>
          <div
            class="inline-container row output-item-footer"
          >
            <Button
              :text="formatMessageType(entry.message.type)"
              :class="[
                entry.message.type ===
                  ServerMessageType.ActionResponse &&
                entry.message.status === 'success'
                  ? 'success'
                  : 'error',
                entry.message.type ===
                  ServerMessageType.Error && 'error',
              ]"
              @click="
                activeItemIndexes = [
                  getFilterItemIndex(entry.message.type),
                ]
              "
            />
            <span class="timestamp">
              {{ formatTime(entry.timestamp) }}
            </span>
            <span class="spacer" />
            <Button
              class="output-item-action"
              icon="copy"
              @click="copy(getEntryText(entry.message))"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@bits/Button.vue';
import Textarea from '@bits/Textarea.vue';
import ButtonMultiGroup from '@components/ButtonMultiGroup.vue';
import {
  ServerMessageType,
  type ServerMessage,
} from '@netop/types';
import {
  useClipboard,
  useFocus,
  useScroll,
} from '@vueuse/core';
import { onMounted, ref, useTemplateRef } from 'vue';
import { useHandlers } from './ConsoleView.comps';
import { FILTER_ITEMS } from './ConsoleView.consts';
import {
  formatMessageType,
  formatTime,
  getEntryText,
  getFilterItemIndex,
} from './ConsoleView.utils';

const promptTextarea = useTemplateRef<InstanceType<
  typeof Textarea
> | null>('promptTextarea');
const outputArea = useTemplateRef<HTMLElement | null>(
  'outputArea',
);

const input = ref('');
const filterCollapsed = ref<boolean>(true);
const activeItemIndexes = ref<number[]>([]);
const commandPending = ref(false);

const { copy } = useClipboard();
const { focused } = useFocus(promptTextarea as any, {
  initialValue: true,
});
const { y: scrollY } = useScroll(outputArea, {
  behavior: 'smooth',
});
const handlers = useHandlers(
  input,
  focused,
  outputArea,
  scrollY,
  commandPending,
);

onMounted(handlers.mount);
</script>

<style scoped>
.console-view {
  min-height: 0;
}

.input-area {
  position: relative;
  flex: 0 0 auto;
  background: var(--c-l0-bg);
  font-family: var(--f-code);
  line-height: 1;
  padding: var(--s-spacing);
  gap: var(--s-gap);
  border-bottom: var(--border);
}

.prompt {
  flex: 1;
}

.prefix {
  color: var(--c-border);
}

.filter-area {
  flex: 0 0 auto;
  align-items: flex-start;
  padding: var(--s-spacing);

  .filter-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-wrap: wrap;
    gap: var(--s-gap);

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

.action-area {
  flex-direction: row;
  display: flex;
  justify-content: end;
  gap: var(--s-gap);
  padding: var(--s-spacing);
  padding-top: 0;
  border-bottom: var(--border);
}

.output-area {
  background: var(--c-l0-bg);
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding-bottom: 30vh;
}

.output-item {
  border-bottom: var(--border);
  padding: var(--s-spacing);
  gap: var(--s-gap);
}

.output-item .output-item-action {
  display: none;
}

.output-item:hover .output-item-action {
  display: inline-flex;
}

.output-item-content {
  font-family: var(--f-code);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.output-item-footer {
  align-items: center;
  gap: var(--s-gap);
  font-size: var(--s-font-size-sm);
}
</style>

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
        @keydown.enter.exact.prevent="
          handlers.submit(input)
        "
      />
    </div>
    <div v-if="wsStore.queue.length" class="queue-area">
      <div
        class="inline-container row output-item queued-item"
        v-for="message in wsStore.queue"
      >
        <Icon class="queued-spinner" icon="loader-circle" />
        <span class="output-item-content">
          {{ message.body }}
        </span>
        <span class="spacer" />
        <Button
          class="output-item-action"
          icon="x"
          @click="wsStore.remove(message)"
        />
      </div>
    </div>
    <div
      class="output-area"
      ref="outputArea"
      @contextmenu.prevent="openConsoleMenu($event)"
    >
      <EmptyView v-if="log.length === 0">
        No console output
      </EmptyView>
      <div v-else class="inline-container column reversed">
        <div
          class="inline-container column output-item"
          v-for="entry in log"
        >
          <span class="output-item-content">
            {{ getEntryText(entry.message) }}
          </span>
          <div
            class="inline-container row output-item-footer"
          >
            <span
              class="status-dot"
              :class="entry.message.status"
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
import Icon from '@bits/Icon.vue';
import { openMenu } from '@bits/menu';
import Textarea from '@bits/Textarea.vue';
import EmptyView from '@components/EmptyView.vue';
import {
  useClipboard,
  useFocus,
  useScroll,
} from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { ref, useTemplateRef, watch } from 'vue';
import { useConsoleStore } from '@/app/stores/consoleStore';
import { useWsStore } from '@/app/stores/wsStore';
import { useHandlers } from './ConsoleView.comps';
import {
  formatTime,
  getEntryText,
} from './ConsoleView.utils';

const promptTextarea = useTemplateRef<InstanceType<
  typeof Textarea
> | null>('promptTextarea');
const outputArea = useTemplateRef<HTMLElement | null>(
  'outputArea',
);

const input = ref('');
const consoleStore = useConsoleStore();
const { log } = storeToRefs(consoleStore);
const wsStore = useWsStore();
const { copy } = useClipboard();
const { focused } = useFocus(promptTextarea as any, {
  initialValue: true,
});
const { y: scrollY } = useScroll(outputArea, {
  behavior: 'smooth',
});
const handlers = useHandlers(
  (message) => wsStore.enqueue(message),
  (command) => {
    consoleStore.addCommand(command);
    input.value = '';
    focused.value = true;
  },
);

function openConsoleMenu(event: MouseEvent) {
  void openMenu(
    [
      {
        name: 'Copy all',
        icon: 'copy',
        action: () =>
          copy(
            log.value
              .map((entry) => getEntryText(entry.message))
              .join('\n'),
          ),
      },
      {
        name: 'Clear',
        icon: 'trash',
        action: consoleStore.clearLog,
      },
    ],
    { x: event.clientX, y: event.clientY },
  );
}

watch(
  () => log.value.length,
  () => {
    const el = outputArea.value;
    if (!el) return;
    scrollY.value = -el.scrollHeight;
  },
  { flush: 'post' },
);
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

.queue-area {
  flex: 0 0 auto;
  min-height: 0;
  max-height: 10rem;
  overflow-y: auto;
  border-bottom: var(--border);
}

.queued-item {
  align-items: center;
}

.queued-spinner {
  flex: 0 0 auto;
  animation: spin 1s linear infinite;
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
  visibility: hidden;
}

.output-item:hover .output-item-action {
  visibility: visible;
}

.output-item-content {
  font-family: var(--f-code);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.status-dot {
  width: 0.5rem;
  height: 0.5rem;
  background: var(--c-error-text);
  border-radius: 50%;

  &.success {
    background: var(--c-success-text);
  }
}

.output-item-footer {
  align-items: center;
  gap: var(--s-gap);
  font-size: var(--s-font-size-sm);
  min-height: calc(
    var(--s-font-size) + 2 * var(--s-spacing-sm)
  );
}

@keyframes spin {
  to {
    transform: rotate(1turn);
  }
}
</style>

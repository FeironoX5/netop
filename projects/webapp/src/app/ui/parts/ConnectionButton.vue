<template>
  <ButtonSections class="connection-button">
    <Button
      :class="connectionClass"
      :icon="connectionIcon"
      @click.stop="wsService.reconnect()"
    />
    <Button
      :class="connectionClass"
      :text="connectionText"
      @click.stop="openMenu(connectionItems)"
    />
    <Button
      class="view-picker"
      :text="canvasStore.activeView.name"
      @click.stop="openMenu(viewItems)"
    />
  </ButtonSections>
  <Teleport to="body">
    <dialog
      ref="connectionDialog"
      class="connection-dialog"
      @click="closeDialogFromBackdrop"
      @close="resetConnectionTest"
    >
      <form @submit.prevent="connect">
        <input
          v-model.trim="host"
          autocomplete="hostname"
          placeholder="Host"
          required
        />
        <input
          v-model.number="port"
          type="number"
          min="1"
          max="65535"
          inputmode="numeric"
          placeholder="Port"
          required
        />
        <div class="dialog-actions">
          <Button
            type="button"
            text="Test"
            :class="{
              warning: testStatus === 'testing',
              success: testStatus === 'success',
              error: testStatus === 'error',
            }"
            :disabled="
              !isConnectionValid || testStatus === 'testing'
            "
            @click="testConnection"
          />
          <Button
            type="submit"
            text="Connect"
            :disabled="!isConnectionValid"
          />
        </div>
      </form>
    </dialog>
  </Teleport>
</template>

<script setup lang="ts">
import Button from '@bits/Button.vue';
import ButtonSections from '@bits/ButtonSections.vue';
import { openMenu } from '@bits/menu';
import type { MenuItemData } from '@bits/menu';
import { useWebSocket } from '@vueuse/core';
import { computed, ref, useTemplateRef, watch } from 'vue';
import { wsService } from '@/app/services/wsService';
import { useAppStore } from '@/app/stores/appStore';
import { useCanvasStore } from '@/app/stores/canvasStore';

type TestStatus = 'idle' | 'testing' | 'success' | 'error';

const connectionIcon = computed(() => {
  switch (wsService.status.value) {
    case 'OPEN':
      return 'radio';
    case 'CONNECTING':
      return 'refresh-cw';
    default:
      return 'refresh-cw-off';
  }
});

const connectionClass = computed(() => ({
  success: wsService.status.value === 'OPEN',
  warning: wsService.status.value === 'CONNECTING',
  error: wsService.status.value === 'CLOSED',
}));

const connectionText = computed(() => {
  const connection = appStore.connection;
  return connection
    ? `${connection.url}:${connection.port}`
    : 'No Connection';
});

const appStore = useAppStore();
const canvasStore = useCanvasStore();
const connectionDialog = useTemplateRef<HTMLDialogElement>(
  'connectionDialog',
);
const host = ref('localhost');
const port = ref(3001);
const testStatus = ref<TestStatus>('idle');
const testUrl = computed(
  () => `ws://${host.value}:${port.value}`,
);
const {
  status: testSocketStatus,
  open: openTestSocket,
  close: closeTestSocket,
} = useWebSocket(testUrl, {
  immediate: false,
  autoConnect: false,
});

const isConnectionValid = computed(
  () =>
    host.value.length > 0 &&
    Number.isInteger(port.value) &&
    port.value >= 1 &&
    port.value <= 65535,
);

const connectionItems = computed<readonly MenuItemData[]>(
  () => [
    ...appStore.connections.map((connection, index) => ({
      name: `${connection.url}:${connection.port}`,
      icon: 'server',
      endIcon:
        index === appStore.activeConnection
          ? 'check'
          : undefined,
      action: () => {
        appStore.setConnection(index);
        connectIfClosed();
      },
    })),
    {
      name: 'New Connection',
      icon: 'plus',
      action: openConnectionDialog,
    },
  ],
);

const viewItems = computed<readonly MenuItemData[]>(() => [
  ...canvasStore.views.map((view, index) => ({
    name: view.name,
    endIcon:
      index === canvasStore.activeViewIndex
        ? 'check'
        : undefined,
    action: () => canvasStore.setActiveView(index),
  })),
  {
    name: 'New View',
    icon: 'plus',
    action: canvasStore.addView,
  },
]);

function openConnectionDialog(): void {
  testStatus.value = 'idle';
  connectionDialog.value?.showModal();
}

function connect(): void {
  if (!isConnectionValid.value) return;

  appStore.addConnection({
    url: host.value,
    port: port.value,
  });
  connectIfClosed();
  connectionDialog.value?.close();
}

function connectIfClosed(): void {
  if (wsService.status.value === 'CLOSED') {
    wsService.reconnect();
  }
}

function testConnection(): void {
  if (!isConnectionValid.value) return;

  testStatus.value = 'testing';
  openTestSocket();
}

function resetConnectionTest(): void {
  testStatus.value = 'idle';
  closeTestSocket();
}

function closeDialogFromBackdrop(event: MouseEvent): void {
  const dialog = connectionDialog.value;
  if (event.target === dialog) {
    dialog?.close();
  }
}

watch([host, port], resetConnectionTest);

watch(testSocketStatus, (status) => {
  if (status === 'OPEN') {
    testStatus.value = 'success';
    closeTestSocket();
  } else if (
    status === 'CLOSED' &&
    testStatus.value === 'testing'
  ) {
    testStatus.value = 'error';
  }
});
</script>

<style scoped>
.connection-button {
  .view-picker {
    background: var(--c-accent);
  }
  .view-picker:hover {
    background: var(--c-accent);
  }
  .view-picker:active {
    background: var(--c-accent);
  }
}

.connection-dialog {
  width: min(24rem, calc(100vw - 2rem));
  padding: var(--s-spacing);
  color: var(--c-text);
  background: var(--c-l1-bg);
  border: var(--border);
  border-radius: var(--s-border-radius-inner);

  &::backdrop {
    background: rgb(0 0 0 / 55%);
  }

  form {
    display: flex;
    flex-direction: column;
    gap: var(--s-spacing);
  }

  input {
    padding: var(--s-spacing-sm);
    color: var(--c-text);
    background: var(--c-l0-bg);
    border: var(--border);
    border-radius: var(--s-border-radius-inner);
    outline: none;
  }

  input:focus {
    border-color: var(--c-accent);
  }

  .dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--s-gap);
  }
}
</style>

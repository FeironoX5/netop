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
      text="View 1"
      @click.stop="
        openMenu([
          { name: 'New View', icon: 'plus' },
          {
            name: 'Import',
            icon: 'upload',
            action: () =>
              openSubmenu([
                {
                  name: 'From clipboard',
                  icon: 'clipboard',
                },
                { name: 'From file', icon: 'file' },
              ]),
          },
          {
            name: 'Export',
            icon: 'share',
            action: () =>
              openSubmenu([
                { name: 'To clipboard', icon: 'clipboard' },
                { name: 'To file', icon: 'file' },
              ]),
          },
          { name: `View 1` },
          { name: `View 2` },
          { name: `View 3` },
        ])
      "
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
import { openMenu, openSubmenu } from '@bits/menu';
import type { MenuItemData } from '@bits/menu';
import { useWebSocket } from '@vueuse/core';
import { computed, ref, useTemplateRef, watch } from 'vue';
import { wsService } from '@/app/services/wsService';
import { useAppStore } from '@/app/stores/appStore';

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

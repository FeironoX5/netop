<template>
  <ButtonSections class="connection-button">
    <Button
      :class="connectionClass"
      :icon="connectionIcon"
      @click.stop="
        wsService.connectToPort(wsService.port.value)
      "
    />
    <Button
      :class="connectionClass"
      :text="connectionText"
      @click.stop="
        openMenu([
          { name: `New Connection`, icon: 'plus' },
          {
            name: 'Close Connection',
            icon: 'unplug',
            action: () => wsService.disconnect(),
          },
          ...PORT_OPTIONS.map((port) => ({
            name: `localhost:${port}`,
            action: () => wsService.connectToPort(port),
          })),
        ])
      "
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
</template>

<script setup lang="ts">
import Button from '@bits/Button.vue';
import ButtonSections from '@bits/ButtonSections.vue';
import { openMenu, openSubmenu } from '@bits/menu';
import type { MenuItemData } from '@bits/menu';
import { computed } from 'vue';
import {
  wsService,
  WsConnectionStatus,
} from '@/app/services/wsService';

const PORT_OPTIONS = [3001, 4324];

const connectionIcon = computed(() => {
  switch (wsService.status.value) {
    case WsConnectionStatus.Connected:
      return 'radio';
    case WsConnectionStatus.Connecting:
      return 'refresh-cw';
    default:
      return 'refresh-cw-off';
  }
});

const connectionClass = computed(() => ({
  success:
    wsService.status.value === WsConnectionStatus.Connected,
  warning:
    wsService.status.value ===
    WsConnectionStatus.Connecting,
  error:
    wsService.status.value ===
    WsConnectionStatus.Disconnected,
}));

const connectionText = computed(() => wsService.label);

const connectionItems = computed<readonly MenuItemData[]>(
  () => [
    {
      name:
        wsService.status.value ===
        WsConnectionStatus.Disconnected
          ? `Connect to ${wsService.label}`
          : `Reconnect to ${wsService.label}`,
      icon: 'radio',
      action: () =>
        wsService.connectToPort(wsService.port.value),
    },
    {
      name: 'Disconnect',
      icon: 'radio-tower',
      action: () => wsService.disconnect(),
    },
    ...PORT_OPTIONS.map((port) => ({
      name: `localhost:${port}`,
      icon: 'server',
      endIcon:
        port === wsService.port.value ? 'check' : undefined,
      action: () => wsService.connectToPort(port),
    })),
    {
      name: 'Custom Port',
      icon: 'settings',
      action: () => {
        const value = window.prompt(
          'Port',
          String(wsService.port.value),
        );
        if (!value) return 'dismiss';

        const port = Number(value);
        if (
          !Number.isInteger(port) ||
          port < 1 ||
          port > 65535
        )
          return 'dismiss';

        wsService.connectToPort(port);
      },
    },
  ],
);

function openConnectionMenu() {
  openMenu(connectionItems.value);
}
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
</style>

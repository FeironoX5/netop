<template>
  <ButtonSections class="connection-button">
    <Button
      :class="connectionClass"
      :icon="connectionIcon"
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
</template>

<script setup lang="ts">
import Button from '@bits/Button.vue';
import ButtonSections from '@bits/ButtonSections.vue';
import { openMenu, openSubmenu } from '@bits/menu';
import type { MenuItemData } from '@bits/menu';
import { computed } from 'vue';
import { useAppStore } from '@/app/stores/appStore';

const connectionIcon = computed(() => {
  return 'refresh-cw';
});

const connectionClass = 'success';

const connectionText = computed(() => {
  const connection = appStore.connection;
  return connection
    ? `${connection.url}:${connection.port}`
    : 'No Connection';
});

const appStore = useAppStore();

const connectionItems = computed<readonly MenuItemData[]>(
  () => [
    {
      name: 'Add Connection',
      icon: 'plus',
      action: () => {
        appStore.connections.push({
          url: 'localhost',
          port: 3001,
        });
      },
    },
    ...appStore.connections.map((c, i) => ({
      name: `${c.url}:${c.port}`,
      icon: 'server',
      action: () => appStore.setConnection(i),
    })),
  ],
);
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

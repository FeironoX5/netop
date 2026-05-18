<template>
  <div class="header">
    <List direction="row">
      <template #start>
        <ConnectionButton />
      </template>
      <ButtonGroup
        :items="[
          {
            name: 'Edit',
            action: () =>
              openMenu([
                { name: 'Undo', icon: 'undo-2' },
                { name: 'Redo', icon: 'redo-2' },
              ]),
          },
          {
            name: 'View',
            action: () =>
              openMenu([
                { name: 'Zoom In', icon: 'zoom-in' },
                { name: 'Zoom Out', icon: 'zoom-out' },
              ]),
          },
          {
            name: 'About',
            action: () =>
              openMenu([
                { name: 'Learn More', icon: 'info' },
              ]),
          },
        ]"
      />
      <template #center>
        <img class="logo" src="/logo.svg" />
      </template>
      <template #end>
        <Button
          class="list-item"
          icon="code"
          text="Source"
        />
      </template>
    </List>
  </div>
</template>

<script setup lang="ts">
import Button from '@bits/Button.vue';
import List from '@bits/List.vue';
import { openMenu, openSubmenu } from '@bits/menu';
import type { MenuItemData } from '@bits/menu';
import ButtonGroup from '@components/ButtonGroup.vue';
import ConnectionButton from './ConnectionButton.vue';
</script>

<style scoped>
.header {
  padding: var(--s-spacing) 1rem;
  background-color: var(--c-l1-bg);
  border-bottom: var(--border);
  overflow: hidden;
  flex: 0 0 auto;

  & .logo {
    align-self: center;
    height: 1.3rem;
    width: auto;
    pointer-events: none;
    margin-right: 0.5rem;
  }
}
</style>

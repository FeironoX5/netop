<template>
  <div class="header">
    <List direction="row">
      <ButtonGroup :items="headerItems" />
      <template #center>
        <img class="logo" src="/logo.svg" />
      </template>
      <template #end>
        <Button class="list-item" icon="code" text="Source" />
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

const recentItems: readonly MenuItemData[] = [
  { name: 'project-a.netop' },
  { name: 'project-b.netop', action: () => openSubmenu(recentItems) },
];

const fileItems: readonly MenuItemData[] = [
  { name: 'New File', icon: 'file-plus' },
  { name: 'Open File', icon: 'folder-open' },
  {
    name: 'Open Recent',
    icon: 'history',
    endIcon: 'chevron-right',
    action: () => openSubmenu(recentItems),
  },
];

const editItems: readonly MenuItemData[] = [
  { name: 'Undo', icon: 'undo-2' },
  { name: 'Redo', icon: 'redo-2' },
  { name: 'Preferences', icon: 'settings' },
];

const headerItems = [
  { name: 'File', action: () => openMenu(fileItems) },
  { name: 'Edit', action: () => openMenu(editItems) },
];
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

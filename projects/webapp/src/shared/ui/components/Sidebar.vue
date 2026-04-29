<template>
  <div class="sidebar" :class="[`side-${side}`, { closed: !isOpen }]" :aria-hidden="!isOpen">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { sidebarProps } from './Sidebar.props';

const props = defineProps(sidebarProps);
</script>

<style scoped>
.sidebar {
  --sidebar-width: 300px;

  width: var(--sidebar-width);
  flex: 0 0 var(--sidebar-width);
  background-color: var(--c-l1-bg);
  overflow: hidden;
  visibility: visible;

  transition:
    margin 0.15s ease-out,
    visibility 0s linear 0s;

  &.side-left {
    border-right: var(--border);
  }

  &.side-right {
    border-left: var(--border);
  }

  &.closed {
    visibility: hidden;
    pointer-events: none;
    transition:
      margin 0.15s ease-out,
      visibility 0s linear 0.15s;
  }

  &.side-left.closed {
    margin-left: calc(-1 * var(--sidebar-width));
  }

  &.side-right.closed {
    margin-right: calc(-1 * var(--sidebar-width));
  }
}
</style>

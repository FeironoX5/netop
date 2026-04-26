<template>
  <div class="sidebar" :class="{ closed: !isOpen }" :aria-hidden="!isOpen">
    <div class="sidebar-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  isOpen: {
    type: Boolean,
    default: true,
  },
});
</script>

<style scoped>
.sidebar {
  --sidebar-width: 300px;

  width: var(--sidebar-width);
  flex: 0 0 var(--sidebar-width);
  display: flex;
  flex-direction: column;
  gap: var(--s-spacing);
  padding: var(--s-spacing);
  background-color: var(--c-l1-bg);
  overflow: hidden;
  transition:
    width 0.15s ease-out,
    flex-basis 0.15s ease-out,
    padding 0.15s ease-out;
}

.sidebar.closed {
  width: 0;
  flex-basis: 0;
  padding-inline: 0;
}

.sidebar-content {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: var(--s-spacing);
  min-width: 0;
  opacity: 1;
  transition: opacity 0.1s ease-out;
}

.sidebar.closed .sidebar-content {
  opacity: 0;
  pointer-events: none;
}

.sidebar-content :deep(.sidebar-section) {
  display: contents;
}

.sidebar-content :deep(.sidebar-section + .sidebar-section) {
  &::before {
    content: '';
    border-left: var(--border);
  }
}
</style>

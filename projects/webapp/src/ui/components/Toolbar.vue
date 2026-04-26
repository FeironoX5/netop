<template>
  <div class="toolbar">
    <slot />
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  flex-direction: row;
  gap: var(--s-spacing);
  padding: var(--s-spacing);
  background-color: var(--c-l1-bg);
  border: var(--border);
  border-radius: var(--s-border-radius);
  overflow: hidden;
}

.toolbar :deep(.toolbar-section) {
  display: contents;
}

.toolbar :deep(.toolbar-section + .toolbar-section) {
  &::before {
    content: '';
    border-left: var(--border);
  }
}
</style>

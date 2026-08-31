<template>
  <div
    class="item-header inline-container row"
    :class="tone"
  >
    <Button :icon="icon" :text="text" isQuiet disabled />
    <span class="spacer" />
    <slot />
  </div>
</template>

<script setup lang="ts">
import Button from './Button.vue';
import { itemHeaderProps } from './ItemHeader.props';

defineProps(itemHeaderProps);
</script>

<style scoped>
.item-header {
  align-items: center;
  min-height: calc(
    var(--s-font-size) + 2 * var(--s-spacing-sm)
  );
  gap: var(--s-gap);
  padding: var(--s-spacing);
  font-size: var(--s-font-size-sm);
}

.item-header.neutral {
  color: var(--c-text);
  background: var(--c-border);
}

.item-header.success {
  color: var(--c-success-text);
  background: var(--c-success-bg);
}

.item-header.warning {
  color: var(--c-warning-text);
  background: var(--c-warning-bg);
}

.item-header.error {
  color: var(--c-error-text);
  background: var(--c-error-bg);
}
</style>

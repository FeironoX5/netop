<template>
  <button
    :class="{ active: isActive, selectable: isSelectable }"
    :disabled="disabled"
  >
    <Icon :icon="icon" />
    <span v-if="text">{{ text }}</span>
  </button>
</template>

<script setup lang="ts">
import Icon from '@bits/Icon.vue';
import { buttonProps } from './Button.props';

defineProps(buttonProps);
</script>

<style scoped>
button {
  display: inline-flex;
  place-items: center;
  gap: 0.3rem;
  padding: var(--s-spacing-sm);
  cursor: pointer;
  font-size: var(--s-font-size);
  line-height: 1;
  min-width: calc(1em + 2 * var(--s-spacing-sm));
  max-height: calc(
    var(--s-font-size) * 2 + var(--s-spacing-sm) * 2
  );
  background: var(--c-element-bg);
  color: var(--c-text);
  border-radius: var(--s-border-radius-inner);

  &:hover {
    background: var(--c-element-hover);
  }

  &.active {
    background: var(--c-element-active);
  }

  &.selectable:active {
    background: var(--c-element-active);
  }

  &.selectable.active {
    background: var(--c-element-active);
  }

  &:disabled {
    cursor: not-allowed;
    color: var(--c-disabled-text);
    opacity: 0.55;
  }
}
</style>

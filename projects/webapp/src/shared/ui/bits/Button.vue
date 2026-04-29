<template>
  <button :class="{ active: isActive, selectable: isSelectable }">
    <Icon :icon="icon" />
    <span v-if="text">{{ text }}</span>
  </button>
</template>

<script setup lang="ts">
import Icon from '@bits/Icon.vue';
import { buttonProps } from './Button.props';

defineProps(buttonProps);
</script>

<style>
:root {
  --s-button-spacing: 0.4em;
  --s-button-font-size: 1em;
  --max-button-height: calc(var(--s-button-spacing) * 2 + var(--s-button-font-size) * 2);
}
</style>

<style scoped>
button {
  display: inline-flex;
  place-items: center;
  gap: 0.3rem;
  padding: var(--s-button-spacing);
  cursor: pointer;
  font-size: var(--s-button-font-size);
  line-height: 1;
  min-width: calc(1em + 2 * var(--s-button-spacing));
  max-height: var(--max-button-height);
  background: var(--c-el-bg);
  color: var(--c-text);
  border-radius: var(--s-border-radius-inner);

  &:hover {
    background: var(--c-el-bg-hovered);
  }

  &.active {
    background: var(--c-el-bg-hovered);
  }

  &.selectable:active {
    background: var(--c-el-bg-active);
  }

  &.selectable.active {
    background: var(--c-el-bg-active);
  }
}
</style>

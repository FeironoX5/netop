<template>
  <button :class="{ active: isActive, selectable: isSelectable }">
    <i v-if="icon" :class="`icon-${icon}`" />
    <span v-if="text">{{ text }}</span>
  </button>
</template>

<script setup lang="ts">
import { buttonProps } from './Button.props';

defineProps(buttonProps);
</script>

<style scoped>
button {
  display: inline-flex;
  place-content: center;
  gap: 0.3rem;
  padding: 0.4rem;
  cursor: pointer;
  line-height: 1;
  min-width: calc(1em + 2 * 0.4rem);
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

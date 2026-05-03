<template>
  <div
    class="list inline-container"
    :class="{ row: direction === 'row', column: direction === 'column' }"
  >
    <slot name="start" />
    <slot />
    <span class="spacer" />
    <span class="center">
      <slot name="center" />
    </span>
    <span class="spacer" />
    <slot name="end" />
  </div>
</template>

<script setup lang="ts">
import { listProps } from './List.props';

defineProps(listProps);
</script>

<style scoped>
.list {
  gap: var(--s-spacing);

  & .center {
    display: contents;
  }

  &.row {
    position: relative;

    & .center {
      display: inline-flex;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      align-self: center;
    }
  }
}
</style>

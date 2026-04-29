<template>
  <div
    class="list inline-container"
    :class="{ row: direction === 'row', column: direction === 'column' }"
  >
    <slot name="start" />
    <slot />
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
}
</style>

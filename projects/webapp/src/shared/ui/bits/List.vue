<template>
  <div class="list" :style="{ flexDirection: direction }">
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
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
  gap: var(--s-spacing);
}
</style>

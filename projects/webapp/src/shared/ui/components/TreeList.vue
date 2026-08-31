<template>
  <div class="tree-list">
    <div
      class="tree-list-item"
      :class="{ root: item.depth === 0 }"
      v-for="item in items"
      :key="item.key"
      :style="{
        marginInlineStart: `${item.depth * 1.25}rem`,
      }"
    >
      <slot name="item" :item="item" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { treeListProps } from './TreeList.props';

defineProps(treeListProps);
</script>

<style scoped>
.tree-list {
  width: max-content;
  min-width: 100%;
  padding: var(--s-spacing);
}

.tree-list-item {
  width: max-content;
  padding: calc(var(--s-gap) / 2) 0 calc(var(--s-gap) / 2)
    var(--s-spacing);
  border-left: var(--border);
}

.tree-list-item.root {
  border-left: none;
}
</style>

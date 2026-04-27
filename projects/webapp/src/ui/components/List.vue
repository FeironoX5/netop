<template>
  <div class="list" :style="{ flexDirection: direction }">
    <slot />
    <Button
      class="list-item"
      v-for="(item, index) in items"
      :key="`item-${index}`"
      :icon="item.icon"
      :text="item.name"
      :isSelectable="isSelectable"
      :isActive="index === activeItemIndex"
      @click="handleClick(index)"
    />
    <span class="spacer" />
    <Button
      class="list-item"
      v-for="(item, index) in endItems"
      :key="`end-${index}`"
      :icon="item.icon"
      :text="item.name"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, type CSSProperties, type PropType } from 'vue';
import Button from '../bits/Button.vue';

interface ListItem {
  icon?: string;
  name: string;
}

interface SelectableListItem extends ListItem {
  action?: () => unknown | Promise<unknown>;
}

const props = defineProps({
  items: {
    type: Array as () => SelectableListItem[],
    required: true,
  },
  endItems: {
    type: Array as () => ListItem[],
    default: () => [],
  },
  isSelectable: {
    type: Boolean,
    default: false,
  },
  direction: {
    type: String as PropType<CSSProperties['flexDirection']>,
    default: 'column',
  },
});

const activeItemIndex = ref<number | null>(null);

async function handleClick(index: number) {
  activeItemIndex.value = index;
  const item = props.items[index];
  if (!item || !item.action) return;
  await item.action();
  if (activeItemIndex.value === index) {
    activeItemIndex.value = null;
  }
}
</script>

<style scoped>
.list {
  display: flex;
  align-items: stretch;
  gap: var(--s-spacing);
}

.list-item {
  justify-content: flex-start;
}
</style>

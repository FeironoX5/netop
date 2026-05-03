<template>
  <Button
    class="button-group-item"
    v-for="(item, index) in items"
    :key="`item-${index}`"
    :icon="item.icon"
    :text="item.name"
    :isSelectable="isSelectable"
    :isActive="index === modelValue"
    @click.stop="handleClick(index)"
  />
</template>

<script setup lang="ts">
import Button from '@bits/Button.vue';
import { buttonGroupProps } from './ButtonGroup.props';

const props = defineProps(buttonGroupProps);
const modelValue = defineModel<number | null>('activeItemIndex', {
  default: null,
});

async function handleClick(index: number) {
  modelValue.value = modelValue.value === index ? null : index;
  const item = props.items[index];
  if (!item || !item.action) return;
  await item.action();
  if (modelValue.value === index) {
    modelValue.value = null;
  }
}
</script>

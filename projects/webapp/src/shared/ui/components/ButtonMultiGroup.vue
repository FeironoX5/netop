<template>
  <Button
    class="button-group-item"
    v-for="(item, index) in items"
    :key="`item-${index}`"
    :icon="item.icon"
    :text="item.name"
    :isSelectable="isSelectable"
    :isActive="modelValue.includes(index)"
    @click="handleClick(index)"
  />
</template>

<script setup lang="ts">
import Button from '@bits/Button.vue';
import { buttonGroupProps } from './ButtonGroup.props';

const props = defineProps(buttonGroupProps);
const modelValue = defineModel<number[]>('activeItemIndexes', {
  default: [],
});

async function handleClick(index: number) {
  if (modelValue.value.includes(index)) {
    modelValue.value = modelValue.value.filter((i) => i !== index);
  } else {
    modelValue.value = [...modelValue.value, index];
  }
  const item = props.items[index];
  if (!item || !item.action) return;
  await item.action();
}
</script>

<template>
  <div class="tabbed-group">
    <div class="tabbed-group-header">
      <ButtonGroup
        :items="items"
        :isSelectable="true"
        :isDeselectable="false"
        :activeItemIndex="activeItemIndex"
        @update:activeItemIndex="selectTab"
      />
    </div>
    <slot :activeTab="activeTab" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import ButtonGroup from './ButtonGroup.vue';
import { tabbedGroupProps } from './TabbedGroup.props';

const props = defineProps(tabbedGroupProps);

const activeItemIndex = ref(0);
const activeTab = computed(
  () =>
    props.items[activeItemIndex.value]?.value ??
    props.items[0].value,
);

function selectTab(index: number | null): void {
  if (index !== null && props.items[index]) {
    activeItemIndex.value = index;
  }
}
</script>

<style scoped>
.tabbed-group {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
  width: 100%;
}

.tabbed-group-header {
  display: flex;
  flex: 0 0 auto;
  width: 100%;
  margin: 0;
  background: var(--c-l1-bg);
  border-bottom: var(--border);
}

:deep(.button-group-item) {
  flex: 1 1 0;
  justify-content: center;
  max-height: none;
  border-radius: 0;
}
</style>

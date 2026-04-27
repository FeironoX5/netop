<template>
  <List class="toolbar" direction="row">
    <div class="toolbar-section">
      <ButtonGroup
        :items="leftPanelTools"
        :isSelectable="true"
        v-model:activeItemIndex="activeLeftPanelIndex"
      />
    </div>
    <div class="toolbar-section">
      <ButtonGroup
        :items="[
          { icon: 'mouse-pointer-2' },
          { icon: 'hand' },
          { icon: 'cable' },
          { icon: 'message-circle' },
        ]"
        :isSelectable="true"
      />
    </div>
    <div class="toolbar-section">
      <Button icon="play" text="Run" />
    </div>
    <div class="toolbar-section">
      <ButtonGroup
        :items="rightPanelTools"
        :isSelectable="true"
        v-model:activeItemIndex="activeRightPanelIndex"
      />
    </div>
  </List>
</template>

<script setup lang="ts">
import Button from '@bits/Button.vue';
import List from '@bits/List.vue';
import ButtonGroup from '@components/ButtonGroup.vue';
import { leftPanelTools, rightPanelTools } from '@ui/pages/EditorPage.data';

const activeLeftPanelIndex = defineModel<number | null>('activeLeftPanelIndex', {
  default: null,
});
const activeRightPanelIndex = defineModel<number | null>('activeRightPanelIndex', {
  default: null,
});
</script>

<style scoped>
.toolbar {
  padding: var(--s-spacing);
  background-color: var(--c-l1-bg);
  border: var(--border);
  border-radius: var(--s-border-radius);
  overflow: hidden;
}

.toolbar-section {
  display: contents;

  & + .toolbar-section::before {
    content: '';
    border-left: var(--border);
  }
}
</style>

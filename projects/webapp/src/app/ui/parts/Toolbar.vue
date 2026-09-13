<template>
  <List class="toolbar" direction="row">
    <div class="toolbar-section">
      <ButtonGroup
        :items="LEFT_PANEL_TOOLS"
        :isSelectable="true"
        v-model:activeItemIndex="activeLeftPanelIndex"
      />
    </div>
    <div class="toolbar-section">
      <ButtonGroup
        :items="CURSOR_TOOLS"
        :isSelectable="true"
        :isDeselectable="false"
        v-model:activeItemIndex="activeCursorModeIndex"
      />
    </div>
    <div class="toolbar-section">
      <Button icon="play" text="Run" />
    </div>
    <div class="toolbar-section">
      <ButtonGroup
        :items="RIGHT_PANEL_TOOLS"
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
import { computed } from 'vue';
import { useCanvasStore } from '@/app/stores/canvasStore';
import {
  LEFT_PANEL_TOOLS,
  RIGHT_PANEL_TOOLS,
} from '@/ui/pages/EditorPage.consts';
import { CURSOR_TOOLS } from './Toolbar.consts';

const canvasStore = useCanvasStore();
const activeCursorModeIndex = computed<number | null>({
  get: () =>
    CURSOR_TOOLS.findIndex(
      ({ mode }) => mode === canvasStore.cursorMode,
    ),
  set: (index) => {
    if (index === null) return;
    const tool = CURSOR_TOOLS[index];
    if (tool) canvasStore.setCursorMode(tool.mode);
  },
});

const activeLeftPanelIndex = defineModel<number | null>(
  'activeLeftPanelIndex',
  {
    default: null,
  },
);
const activeRightPanelIndex = defineModel<number | null>(
  'activeRightPanelIndex',
  {
    default: null,
  },
);
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

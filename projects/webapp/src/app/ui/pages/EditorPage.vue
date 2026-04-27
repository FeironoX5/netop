<template>
  <div class="fullscreen-view">
    <Header />
    <div class="content-area">
      <Sidebar side="left" :isOpen="activeLeftPanelIndex !== null"> </Sidebar>
      <canvas class="workspace-canvas" />
      <Sidebar side="right" :isOpen="activeRightPanelIndex !== null"> </Sidebar>
    </div>
    <div class="toolbar-area">
      <Toolbar
        v-model:activeLeftPanelIndex="activeLeftPanelIndex"
        v-model:activeRightPanelIndex="activeRightPanelIndex"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import Sidebar from '@components/Sidebar.vue';
import Header from '@ui/parts/Header.vue';
import Toolbar from '@ui/parts/Toolbar.vue';
import { ref } from 'vue';
import { leftPanelTools, rightPanelTools } from './EditorPage.data';

const activeLeftPanelIndex = ref<number | null>(null);
const activeRightPanelIndex = ref<number | null>(null);
</script>

<style scoped>
.fullscreen-view {
  display: flex;
  flex-flow: column;
  height: 100dvh;
}

.content-area {
  flex: 1 1 auto;
  display: flex;
  flex-direction: row;
  min-width: 0;
  overflow: hidden;
}

.workspace-canvas {
  flex: 1 1 0;
  min-width: 0;
  width: 0;
  height: 100%;
}

.toolbar-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: end;
  height: 20dvh;

  & .toolbar {
    margin-bottom: -20px;
    transition: margin-bottom 0.15s ease-out;
  }

  &:hover .toolbar {
    margin-bottom: 8px;
  }
}
</style>

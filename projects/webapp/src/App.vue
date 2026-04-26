<template>
  <div class="fullscreen-view">
    <Header />
    <div class="content-area">
      <Sidebar :is-open="leftSidebarContent !== null">
        {{ leftSidebarText }}
      </Sidebar>
      <canvas class="workspace-canvas" />
      <Sidebar :is-open="rightSidebarContent !== null">
        {{ rightSidebarText }}
      </Sidebar>
    </div>
    <div class="toolbar-area">
      <Toolbar>
        <div class="toolbar-section">
          <Button
            icon="box"
            :isSelectable="true"
            :isActive="leftSidebarContent === 'box'"
            @click="toggleLeftSidebar('box')"
          />
          <Button
            icon="file-code-corner"
            :isSelectable="true"
            :isActive="leftSidebarContent === 'source'"
            @click="toggleLeftSidebar('source')"
          />
        </div>
        <div class="toolbar-section">
          <Button icon="mouse-pointer-2" :isSelectable="true" />
          <Button icon="hand" :isActive="true" :isSelectable="true" />
          <Button icon="cable" :isSelectable="true" />
          <Button icon="sticky-note" :isSelectable="true" />
        </div>
        <div class="toolbar-section">
          <Button icon="play" text="Run" />
        </div>
        <div class="toolbar-section">
          <Button
            icon="history"
            :isSelectable="true"
            :isActive="rightSidebarContent === 'history'"
            @click="toggleRightSidebar('history')"
          />
          <Button
            icon="logs"
            :isSelectable="true"
            :isActive="rightSidebarContent === 'logs'"
            @click="toggleRightSidebar('logs')"
          />
        </div>
      </Toolbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import Button from './ui/bits/Button.vue';
import Header from './ui/components/Header.vue';
import Sidebar from './ui/components/Sidebar.vue';
import Toolbar from './ui/components/Toolbar.vue';

const leftSidebarContent = ref<string | null>(null);
const rightSidebarContent = ref<string | null>(null);

const leftSidebarText = computed(() => {
  if (leftSidebarContent.value === null) {
    return '';
  }

  return `Left sidebar: ${leftSidebarContent.value}`;
});

const rightSidebarText = computed(() => {
  if (rightSidebarContent.value === null) {
    return '';
  }

  return `Right sidebar: ${rightSidebarContent.value}`;
});

function toggleLeftSidebar(content: string) {
  leftSidebarContent.value = leftSidebarContent.value === content ? null : content;
}

function toggleRightSidebar(content: string) {
  rightSidebarContent.value = rightSidebarContent.value === content ? null : content;
}
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
    transition: margin-bottom 0.1s ease-out;
  }

  &:hover .toolbar {
    margin-bottom: 8px;
  }
}
</style>

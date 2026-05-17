<template>
  <div ref="stageContainerRef" class="canvas-view">
    <VStage
      ref="stageRef"
      :config="stageConfig"
      @wheel="handlers.wheel"
      @dragmove="handlers.stageChange"
    >
      <CanvasViewGrid ref="gridRef" />
      <VLayer> </VLayer>
    </VStage>
  </div>
</template>

<script setup lang="ts">
import type { ReqProp } from '@/types/req';
import { useResizeObserver } from '@vueuse/core';
import type { Stage, StageConfig } from 'konva/lib/Stage';
import CanvasViewGrid from './CanvasView.Grid.vue';
import {
  ref,
  useTemplateRef,
  onMounted,
} from 'vue';
import {
  Layer as VLayer,
  Stage as VStage,
} from 'vue-konva';
import { useHandlers } from './CanvasView.comps';

const stageContainerRef = useTemplateRef(
  'stageContainerRef',
);
const stageRef = useTemplateRef<{ getStage(): Stage }>(
  'stageRef',
);
const gridRef = useTemplateRef<{ update(stage: Stage): void }>(
  'gridRef',
);

const stageConfig = ref<
  ReqProp<StageConfig, 'width' | 'height' | 'draggable'>
>({
  width: 0,
  height: 0,
  draggable: true,
});

const handlers = useHandlers(
  () => stageRef.value?.getStage(),
  (stage) => gridRef.value?.update(stage),
  (width, height) => {
    stageConfig.value.width = width;
    stageConfig.value.height = height;
  },
);

useResizeObserver(stageContainerRef, ([entry]) => {
  if (!entry) return;
  handlers.resize(entry);
});

onMounted(handlers.mount);
</script>

<style scoped>
.canvas-view {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>

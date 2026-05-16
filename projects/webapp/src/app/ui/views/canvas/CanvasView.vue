<template>
  <div ref="stageContainerRef" class="canvas-view">
    <VStage
      ref="stageRef"
      :config="stageConfig"
      @wheel="handlers.wheel"
      @dragmove="handlers.stageChange"
    >
      <CanvasViewGrid ref="gridRef" :cellSize="CELL_SIZE" />
      <VLayer> </VLayer>
    </VStage>
  </div>
</template>

<script setup lang="ts">
import type { ReqProp } from '@/types/req';
import { useResizeObserver } from '@vueuse/core';
import type { Stage, StageConfig } from 'konva/lib/Stage';
import {
  ref,
  useTemplateRef,
  onMounted,
  nextTick,
} from 'vue';
import {
  Layer as VLayer,
  Stage as VStage,
} from 'vue-konva';
import {
  SCALE_STEP_MULTIPLIER,
  CELL_SIZE,
  SCALE_LIMITS,
} from './CanvasView.data';
import CanvasViewGrid from './CanvasView.Grid.vue';

const container = useTemplateRef('stageContainerRef');
const stageRef = useTemplateRef<{ getStage(): Stage }>(
  'stageRef',
);
const gridRef = useTemplateRef<{
  update(stage: Stage): void;
}>('gridRef');

const stageConfig = ref<
  ReqProp<StageConfig, 'width' | 'height'>
>({
  width: 0,
  height: 0,
  draggable: true,
});

let rafId: number | null = null;

function scheduleUpdate() {
  if (rafId !== null) return;
  rafId = requestAnimationFrame(() => {
    rafId = null;
    const stage = stageRef.value?.getStage();
    if (stage) gridRef.value?.update(stage);
  });
}

const handlers = {
  mount: () => scheduleUpdate(),
  resize: (e: ResizeObserverEntry) => {
    stageConfig.value.width = e.contentRect.width;
    stageConfig.value.height = e.contentRect.height;
    nextTick(scheduleUpdate);
  },
  wheel: (e: any) => {
    if (!stageRef.value) return;
    e.evt.preventDefault();

    const stage = stageRef.value.getStage();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition()!;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    let direction = e.evt.deltaY > 0 ? -1 : 1;
    if (e.evt.ctrlKey) direction = -direction;

    const newScale =
      direction > 0
        ? oldScale * SCALE_STEP_MULTIPLIER
        : oldScale / SCALE_STEP_MULTIPLIER;

    const clampedScale = Math.max(
      SCALE_LIMITS.min,
      Math.min(SCALE_LIMITS.max, newScale),
    );

    stage.scale({ x: clampedScale, y: clampedScale });
    stage.position({
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    });

    scheduleUpdate();
  },
  stageChange: () => scheduleUpdate(),
};

useResizeObserver(container, ([entry]) => {
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

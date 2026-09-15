<template>
  <div ref="stageContainerRef" class="canvas-view">
    <VStage
      ref="stageRef"
      :config="stageConfig"
      @mousedown="handlers.deselect"
      @wheel="handlers.wheel"
      @dragmove="handlers.stageChange"
    >
      <CanvasGrid ref="gridRef" />
      <VLayer
        v-for="(layer, index) in canvasEntityLayers"
        :key="index"
      >
        <CanvasEntity
          v-for="[path, entity] in layer"
          :key="path"
          :path="path"
          :entity="entity"
        />
      </VLayer>
    </VStage>
  </div>
</template>

<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core';
import type { Stage, StageConfig } from 'konva/lib/Stage';
import { storeToRefs } from 'pinia';
import {
  computed,
  ref,
  useTemplateRef,
  onMounted,
  watch,
  watchEffect,
} from 'vue';
import {
  Layer as VLayer,
  Stage as VStage,
} from 'vue-konva';
import { useCanvasStore } from '@/app/stores/canvasStore';
import { useSimulationStore } from '@/app/stores/simulationStore';
import type { ReqProp } from '@/types/req';
import { useHandlers } from './CanvasView.comps';
import {
  getCanvasEntityLayers,
  getFreeDevicePosition,
} from './CanvasView.utils';
import { isDevicePositionAvailable } from './components/CanvasDevice.utils';
import {
  getCanvasEntityPosition,
  getDirectChildren,
  getDeviceCapText,
} from './components/CanvasEntity.utils';
import CanvasEntity from './components/CanvasEntity.vue';
import CanvasGrid from './components/CanvasGrid.vue';

const { entities } = storeToRefs(useSimulationStore());
const canvasStore = useCanvasStore();
const { selectedEntityPath } = storeToRefs(canvasStore);
const canvasEntityLayers = computed(() =>
  getCanvasEntityLayers(entities.value),
);

watchEffect(() => {
  entities.value.forEach((entity, path) => {
    if (
      getDeviceCapText(entity.category) &&
      !canvasStore.getDevicePosition(path)
    ) {
      canvasStore.setDevicePosition(
        path,
        getFreeDevicePosition((position) =>
          isDevicePositionAvailable(
            canvasStore.devicePositions,
            path,
            position,
            (devicePath) =>
              getDirectChildren(entities.value, devicePath)
                .length,
          ),
        ),
      );
    }
  });
});

const stageContainerRef = useTemplateRef(
  'stageContainerRef',
);
const stageRef = useTemplateRef<{ getStage(): Stage }>(
  'stageRef',
);
const gridRef = useTemplateRef<{
  update(stage: Stage): void;
}>('gridRef');

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
  () => canvasStore.setSelectedEntityPath(null),
  (width, height) => {
    stageConfig.value.width = width;
    stageConfig.value.height = height;
  },
);

function focusEntity(path: string | null): void {
  if (!path) return;
  const position = getCanvasEntityPosition(
    entities.value,
    canvasStore.devicePositions,
    path,
  );
  if (position) handlers.focus(path, position);
}

watch(selectedEntityPath, focusEntity);

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

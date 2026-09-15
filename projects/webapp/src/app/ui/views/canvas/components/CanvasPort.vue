<template>
  <VGroup v-if="groupConfig" :config="groupConfig">
    <VShape :config="shapeConfig" />
    <VText :config="textConfig" />
  </VGroup>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import {
  Group as VGroup,
  Shape as VShape,
  Text as VText,
} from 'vue-konva';
import { appTheme } from '@/app/App.theme';
import {
  CanvasCursorMode,
  useCanvasStore,
} from '@/app/stores/canvasStore';
import { useSimulationStore } from '@/app/stores/simulationStore';
import {
  getCellTextConfig,
  getFilledVisualConfig,
} from './CanvasDevice.utils';
import { canvasEntityProps } from './CanvasEntity.props';
import {
  getChildIndex,
  getPortPosition,
} from './CanvasEntity.utils';
import {
  CELL_HEIGHT,
  CELL_WIDTH,
  RECTANGLE_CELL_POINTS,
} from './CanvasGrid.consts';
import {
  getCanvasPosition,
  getCellScene,
} from './CanvasGrid.utils';

const props = defineProps(canvasEntityProps);
const canvasStore = useCanvasStore();
const { cursorMode } = storeToRefs(canvasStore);
const { entities } = storeToRefs(useSimulationStore());
const index = computed(() =>
  getChildIndex(entities.value, props.path),
);
const groupConfig = computed(() =>
  getCanvasPosition(
    getPortPosition(
      canvasStore.devicePositions,
      props.path,
      index.value,
    ),
  ),
);

const shapeStyle = {
  ...getFilledVisualConfig(
    appTheme.c.element.bg,
    appTheme.c.border,
  ),
  sceneFunc: getCellScene(RECTANGLE_CELL_POINTS),
  width: CELL_WIDTH,
  height: CELL_HEIGHT,
};
const shapeConfig = computed(() => ({
  ...shapeStyle,
  listening: cursorMode.value === CanvasCursorMode.Select,
}));

const textConfig = computed(() =>
  getCellTextConfig(String(index.value), false, false),
);
</script>

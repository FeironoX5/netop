<template>
  <VGroup v-if="groupConfig" :config="groupConfig">
    <VShape :config="outlineShapeConfig" />
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
  getDeviceBodyCells,
  getDeviceOutlineScene,
  getOutlineVisualConfig,
} from './CanvasDevice.utils';
import { canvasEntityProps } from './CanvasEntity.props';
import {
  getComputerPosition,
  getComputerNetworkCard,
  getDirectChildren,
  getDeviceCapText,
} from './CanvasEntity.utils';
import {
  CANVAS_STROKE_WIDTH,
  CELL_HEIGHT,
} from './CanvasGrid.consts';
import {
  getCanvasPosition,
  getCellPoints,
} from './CanvasGrid.utils';

const props = defineProps(canvasEntityProps);
const canvasStore = useCanvasStore();
const { cursorMode } = storeToRefs(canvasStore);
const { entities } = storeToRefs(useSimulationStore());
const cellPoints = computed(() =>
  getCellPoints(cursorMode.value),
);

const networkCard = computed(() =>
  getComputerNetworkCard(entities.value, props.path),
);
const bodyHeight = computed(
  () =>
    (getDeviceBodyCells(
      getDirectChildren(
        entities.value,
        networkCard.value.path,
      ).length,
      cursorMode.value !== CanvasCursorMode.Drag,
    ) +
      1) *
    CELL_HEIGHT,
);
const groupConfig = computed(() => {
  return {
    ...getCanvasPosition(
      getComputerPosition(
        entities.value,
        canvasStore.devicePositions,
        props.path,
      ),
    ),
  };
});

const outlineStyle = {
  ...getOutlineVisualConfig(
    appTheme.c.accent,
    CANVAS_STROKE_WIDTH * 2,
  ),
  lineJoin: 'round',
};
const outlineShapeConfig = computed(() => ({
  ...outlineStyle,
  sceneFunc: getDeviceOutlineScene(
    cellPoints.value,
    bodyHeight.value,
  ),
}));
const textConfig = computed(() => ({
  ...getCellTextConfig(
    getDeviceCapText(props.entity.category)!,
    false,
    cursorMode.value === CanvasCursorMode.Drag,
  ),
  listening: cursorMode.value === CanvasCursorMode.Select,
}));
</script>

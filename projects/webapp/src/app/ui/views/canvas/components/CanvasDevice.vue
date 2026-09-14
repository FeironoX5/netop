<template>
  <VGroup v-if="groupConfig" :config="groupConfig">
    <VShape :config="bodyConfig" />
    <VShape :config="baseConfig" />
    <VShape :config="capConfig" />
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
import { useHandlers } from './CanvasDevice.comps';
import { canvasDeviceProps } from './CanvasDevice.props';
import {
  getDeviceBaseScene,
  getDeviceBodyScene,
  getDeviceBodyCells,
  getCellTextConfig,
  getFilledVisualConfig,
  isDevicePositionAvailable,
} from './CanvasDevice.utils';
import { getDirectChildren } from './CanvasEntity.utils';
import {
  CELL_HEIGHT,
  CELL_WIDTH,
} from './CanvasGrid.consts';
import {
  getCanvasPosition,
  getCellScene,
  getCellPoints,
} from './CanvasGrid.utils';

const props = defineProps(canvasDeviceProps);
const canvasStore = useCanvasStore();
const { cursorMode } = storeToRefs(canvasStore);
const { entities } = storeToRefs(useSimulationStore());
const cellPoints = computed(() =>
  getCellPoints(cursorMode.value),
);

const portCount = computed(
  () =>
    getDirectChildren(entities.value, props.path).length,
);
const bodyHeight = computed(
  () =>
    getDeviceBodyCells(
      portCount.value,
      cursorMode.value !== CanvasCursorMode.Drag,
    ) * CELL_HEIGHT,
);
const position = computed(() =>
  canvasStore.getDevicePosition(props.path),
);
const handlers = useHandlers(
  (nextPosition) =>
    canvasStore.setDevicePosition(props.path, nextPosition),
  (nextPosition) =>
    isDevicePositionAvailable(
      canvasStore.devicePositions,
      props.path,
      nextPosition,
      (path) =>
        getDeviceBodyCells(
          getDirectChildren(entities.value, path).length,
          true,
        ),
    ),
  () => position.value,
);

const groupConfig = computed(() => {
  if (!position.value) return;

  return {
    ...getCanvasPosition(position.value),
    draggable: cursorMode.value === CanvasCursorMode.Select,
    onDragmove: handlers.drag,
  };
});

const bodyConfig = computed(() => ({
  ...getFilledVisualConfig(
    appTheme.c.element.bg,
    appTheme.c.border,
  ),
  sceneFunc: getDeviceBodyScene(
    cellPoints.value,
    bodyHeight.value,
  ),
}));

const baseConfig = computed(() => ({
  ...getFilledVisualConfig(
    appTheme.c.element.bg,
    appTheme.c.border,
  ),
  sceneFunc: getDeviceBaseScene(cellPoints.value),
  y: bodyHeight.value,
  visible: cursorMode.value === CanvasCursorMode.Drag,
  width: CELL_WIDTH,
  height: CELL_HEIGHT,
}));

const capConfig = computed(() => ({
  ...getFilledVisualConfig(
    appTheme.c.accent,
    appTheme.c.accent,
  ),
  sceneFunc: getCellScene(cellPoints.value),
  width: CELL_WIDTH,
  height: CELL_HEIGHT,
  listening: true,
  name: 'device-cap',
}));

const textConfig = computed(() =>
  getCellTextConfig(
    props.capText,
    false,
    cursorMode.value === CanvasCursorMode.Drag,
  ),
);
</script>

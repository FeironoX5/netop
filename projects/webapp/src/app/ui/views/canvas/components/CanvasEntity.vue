<template>
  <VGroup :config="groupConfig">
    <CanvasComputer
      v-if="entity.category === DeviceCategory.COMPUTER"
      v-bind="props"
    />
    <CanvasPort
      v-else-if="
        cursorMode !== CanvasCursorMode.Drag &&
        isPortCategory(entity.category)
      "
      v-bind="props"
    />
    <CanvasDevice
      v-else-if="capText"
      v-bind="props"
      :cap-text="capText"
    />
  </VGroup>
</template>

<script setup lang="ts">
import { DeviceCategory } from '@netop/types';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { Group as VGroup } from 'vue-konva';
import {
  CanvasCursorMode,
  useCanvasStore,
} from '@/app/stores/canvasStore';
import CanvasComputer from './CanvasComputer.vue';
import CanvasDevice from './CanvasDevice.vue';
import {
  CANVAS_ENTITY_NODE_NAME,
  CANVAS_ENTITY_PATH_ATTRIBUTE,
  UNSELECTED_ENTITY_OPACITY,
} from './CanvasEntity.consts';
import { canvasEntityProps } from './CanvasEntity.props';
import {
  getDeviceCapText,
  isPortCategory,
} from './CanvasEntity.utils';
import CanvasPort from './CanvasPort.vue';

const props = defineProps(canvasEntityProps);
const canvasStore = useCanvasStore();
const { cursorMode, selectedEntityPath } =
  storeToRefs(canvasStore);
const capText = computed(() =>
  getDeviceCapText(props.entity.category),
);
const groupConfig = computed(() => ({
  name: CANVAS_ENTITY_NODE_NAME,
  [CANVAS_ENTITY_PATH_ATTRIBUTE]: props.path,
  opacity:
    !selectedEntityPath.value ||
    selectedEntityPath.value === props.path
      ? 1
      : UNSELECTED_ENTITY_OPACITY,
  onClick:
    cursorMode.value === CanvasCursorMode.Select
      ? () => canvasStore.setSelectedEntityPath(props.path)
      : undefined,
}));
</script>

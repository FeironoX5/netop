<template>
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
</template>

<script setup lang="ts">
import { DeviceCategory } from '@netop/types';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import {
  CanvasCursorMode,
  useCanvasStore,
} from '@/app/stores/canvasStore';
import CanvasComputer from './CanvasComputer.vue';
import CanvasDevice from './CanvasDevice.vue';
import { canvasEntityProps } from './CanvasEntity.props';
import {
  getDeviceCapText,
  isPortCategory,
} from './CanvasEntity.utils';
import CanvasPort from './CanvasPort.vue';

const props = defineProps(canvasEntityProps);
const { cursorMode } = storeToRefs(useCanvasStore());
const capText = computed(() =>
  getDeviceCapText(props.entity.category),
);
</script>

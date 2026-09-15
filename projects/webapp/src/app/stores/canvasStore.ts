import { defineStore } from 'pinia';
import { ref } from 'vue';

export enum CanvasCursorMode {
  Select = 'select',
  Drag = 'drag',
  Connect = 'connect',
  Note = 'note',
}

export type CanvasCellPosition = { x: number; y: number };

export const useCanvasStore = defineStore('canvas', () => {
  const cursorMode = ref(CanvasCursorMode.Select);
  const selectedEntityPath = ref<string | null>(null);
  const devicePositions = ref(
    new Map<string, CanvasCellPosition>(),
  );

  function setCursorMode(mode: CanvasCursorMode): void {
    if (cursorMode.value !== mode) {
      selectedEntityPath.value = null;
    }
    cursorMode.value = mode;
  }

  function setSelectedEntityPath(
    path: string | null,
  ): void {
    selectedEntityPath.value = path;
  }

  function getDevicePosition(
    path: string,
  ): CanvasCellPosition | undefined {
    return devicePositions.value.get(path);
  }

  function setDevicePosition(
    path: string,
    position: CanvasCellPosition,
  ): void {
    devicePositions.value.set(path, position);
  }

  return {
    cursorMode,
    selectedEntityPath,
    devicePositions,
    setCursorMode,
    setSelectedEntityPath,
    getDevicePosition,
    setDevicePosition,
  } as const;
});

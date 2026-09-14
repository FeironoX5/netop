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
  const devicePositions = ref(
    new Map<string, CanvasCellPosition>(),
  );

  function setCursorMode(mode: CanvasCursorMode): void {
    cursorMode.value = mode;
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
    devicePositions,
    setCursorMode,
    getDevicePosition,
    setDevicePosition,
  } as const;
});

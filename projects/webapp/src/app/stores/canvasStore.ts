import { defineStore } from 'pinia';
import { ref } from 'vue';

export enum CanvasCursorMode {
  Select = 'select',
  Drag = 'drag',
  Connect = 'connect',
  Note = 'note',
}

export const useCanvasStore = defineStore('canvas', () => {
  const cursorMode = ref(CanvasCursorMode.Select);

  function setCursorMode(mode: CanvasCursorMode): void {
    cursorMode.value = mode;
  }

  return { cursorMode, setCursorMode } as const;
});

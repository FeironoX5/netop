import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export enum CanvasCursorMode {
  Select = 'select',
  Drag = 'drag',
  Connect = 'connect',
  Note = 'note',
}

export type CanvasCellPosition = { x: number; y: number };
export type CanvasPositions = Record<
  string,
  CanvasCellPosition
>;
export type CanvasView = {
  name: string;
  positions: CanvasPositions;
};

export const useCanvasStore = defineStore(
  'canvas',
  () => {
    const cursorMode = ref(CanvasCursorMode.Select);
    const selectedEntityPath = ref<string | null>(null);
    const views = ref<CanvasView[]>([createView(1)]);
    const activeViewIndex = ref(0);
    const activeView = computed(
      () => views.value[activeViewIndex.value]!,
    );
    const devicePositions = computed(
      () => activeView.value.positions,
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

    function setActiveView(index: number): void {
      activeViewIndex.value = index;
    }

    function addView(): void {
      activeViewIndex.value =
        views.value.push(
          createView(views.value.length + 1),
        ) - 1;
    }

    function getDevicePosition(
      path: string,
    ): CanvasCellPosition | undefined {
      return activeView.value.positions[path];
    }

    function setDevicePosition(
      path: string,
      position: CanvasCellPosition,
    ): void {
      activeView.value.positions[path] = position;
    }

    return {
      cursorMode,
      selectedEntityPath,
      views,
      activeViewIndex,
      activeView,
      devicePositions,
      setCursorMode,
      setSelectedEntityPath,
      setActiveView,
      addView,
      getDevicePosition,
      setDevicePosition,
    } as const;
  },
  {
    persist: {
      storage: localStorage,
      pick: ['views', 'activeViewIndex'],
    },
  },
);

function createView(index: number): CanvasView {
  return { name: `View ${index}`, positions: {} };
}

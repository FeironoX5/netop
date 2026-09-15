import { useDebounceFn } from '@vueuse/core';
import type {
  KonvaEventObject,
  Node,
} from 'konva/lib/Node';
import type { Stage } from 'konva/lib/Stage';
import { Easings } from 'konva/lib/Tween';
import { nextTick } from 'vue';
import type { CanvasCellPosition } from '@/app/stores/canvasStore';
import {
  FOCUS_ANIMATION_DURATION,
  SCALE_STEP_MULTIPLIER,
  SCALE_LIMITS,
} from './CanvasView.consts';
import {
  CANVAS_ENTITY_NODE_SELECTOR,
  CANVAS_ENTITY_PATH_ATTRIBUTE,
} from './components/CanvasEntity.consts';
import { GRID_RENDER_DEBOUNCE } from './components/CanvasGrid.consts';
import { getCanvasPosition } from './components/CanvasGrid.utils';

export function useHandlers(
  getStage: () => Stage | undefined,
  updateGrid: (stage: Stage) => void,
  clearSelection: () => void,
  setSize: (width: number, height: number) => void,
) {
  const scheduleUpdate = useDebounceFn(
    () => {
      const stage = getStage();
      if (stage) updateGrid(stage);
    },
    GRID_RENDER_DEBOUNCE,
    { maxWait: GRID_RENDER_DEBOUNCE },
  );

  return {
    mount: () => scheduleUpdate(),

    deselect: (event: KonvaEventObject<MouseEvent>) => {
      if (
        !event.target.findAncestor(
          CANVAS_ENTITY_NODE_SELECTOR,
          true,
        )
      )
        clearSelection();
    },

    focus: (path: string, position: CanvasCellPosition) => {
      const stage = getStage();
      if (!stage) return;
      const entity = stage.findOne(
        (node: Node) =>
          node.getAttr(CANVAS_ENTITY_PATH_ATTRIBUTE) ===
          path,
      );
      if (entity?.isClientRectOnScreen()) return;
      const canvasPosition = getCanvasPosition(position);
      const scale = stage.scaleX();
      stage.to({
        x: stage.width() / 2 - canvasPosition.x * scale,
        y: stage.height() / 2 - canvasPosition.y * scale,
        duration: FOCUS_ANIMATION_DURATION,
        easing: Easings.EaseInOut,
        onUpdate: scheduleUpdate,
        onFinish: scheduleUpdate,
      });
    },

    resize: (e: ResizeObserverEntry) => {
      setSize(e.contentRect.width, e.contentRect.height);
      nextTick(scheduleUpdate);
    },

    wheel: (e: any) => {
      const stage = getStage();
      if (!stage) return;
      e.evt.preventDefault();

      const oldScale = stage.scaleX();
      const pointer = stage.getPointerPosition()!;
      const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };

      let direction = e.evt.deltaY > 0 ? -1 : 1;
      if (e.evt.ctrlKey) direction = -direction;

      const newScale =
        direction > 0
          ? oldScale * SCALE_STEP_MULTIPLIER
          : oldScale / SCALE_STEP_MULTIPLIER;

      const clampedScale = Math.max(
        SCALE_LIMITS.min,
        Math.min(SCALE_LIMITS.max, newScale),
      );

      stage.scale({ x: clampedScale, y: clampedScale });
      stage.position({
        x: pointer.x - mousePointTo.x * clampedScale,
        y: pointer.y - mousePointTo.y * clampedScale,
      });

      scheduleUpdate();
    },

    stageChange: () => scheduleUpdate(),
  };
}

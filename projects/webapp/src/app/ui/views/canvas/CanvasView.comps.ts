import type { Stage } from 'konva/lib/Stage';
import { nextTick } from 'vue';
import {
  SCALE_STEP_MULTIPLIER,
  SCALE_LIMITS,
} from './CanvasView.consts';

export function useHandlers(
  getStage: () => Stage | undefined,
  updateGrid: (stage: Stage) => void,
  setSize: (width: number, height: number) => void,
) {
  let rafId: number | null = null;

  function scheduleUpdate() {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      const stage = getStage();
      if (stage) updateGrid(stage);
    });
  }

  return {
    mount: () => scheduleUpdate(),

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

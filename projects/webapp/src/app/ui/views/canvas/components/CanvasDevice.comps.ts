import type { KonvaEventObject } from 'konva/lib/Node';
import type { CanvasCellPosition } from '@/app/stores/canvasStore';
import {
  getCanvasCellPosition,
  getCanvasPosition,
} from './CanvasGrid.utils';

export function useHandlers(
  setPosition: (position: CanvasCellPosition) => void,
  isPositionAvailable: (
    position: CanvasCellPosition,
  ) => boolean,
  getPosition: () => CanvasCellPosition | undefined,
) {
  function snap(event: KonvaEventObject<DragEvent>) {
    const nextPosition = getCanvasCellPosition(
      event.target.x(),
      event.target.y(),
    );
    event.target.position(getCanvasPosition(nextPosition));
    return nextPosition;
  }

  return {
    drag: (event: KonvaEventObject<DragEvent>) => {
      const nextPosition = snap(event);
      if (isPositionAvailable(nextPosition)) {
        setPosition(nextPosition);
        return;
      }

      const position = getPosition();
      if (position)
        event.target.position(getCanvasPosition(position));
    },
  } as const;
}

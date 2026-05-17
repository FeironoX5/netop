import type { Context } from 'konva/lib/Context';
import type { PropType } from 'vue';
import { drawDiamondCell } from './CanvasView.utils';

export const canvasViewGridProps = {
  cellSize: {
    type: Object as PropType<{
      width: number;
      height: number;
    }>,
    default: () => ({ width: 40, height: 40}),
  },
  zoomThreshold: { type: Number, default: 2 },
  maxCellsPerPiece: { type: Number, default: 30 },
  drawCell: {
    type: Function as PropType<
      (
        ctx: Context,
        x: number,
        y: number,
        w: number,
        h: number,
      ) => void
    >,
    default: drawDiamondCell,
  },
} as const;

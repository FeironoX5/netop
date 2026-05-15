import type { Context } from 'konva/lib/Context';
import type { PropType } from 'vue';
import { CELL_SIZE } from './CanvasView.data';
import { drawDiamondCell } from './CanvasView.utils';

export const canvasViewGridProps = {
  cellSize: {
    type: Object as PropType<{
      width: number;
      height: number;
    }>,
    default: () => CELL_SIZE,
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

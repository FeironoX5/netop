import type { Context } from 'konva/lib/Context';
import type { Stage } from 'konva/lib/Stage';
import { CELL_POINTS } from './CanvasGrid.consts';

export function toAbsoluteScale(
  stage: Stage,
  size: { width: number; height: number },
) {
  const absScale = stage.getAbsoluteScale();
  return {
    width: size.width * absScale.x,
    height: size.height * absScale.y,
  };
}

export function getViewportBounds(stage: Stage) {
  const scale = stage.scaleX();
  const pos = stage.position();
  return {
    left: -pos.x / scale,
    top: -pos.y / scale,
    right: (stage.width() - pos.x) / scale,
    bottom: (stage.height() - pos.y) / scale,
  };
}

export function getBlockAxisLayout(
  viewMin: number,
  viewMax: number,
  blockSize: number,
) {
  const start = Math.floor(viewMin / blockSize) * blockSize;
  const count = Math.ceil((viewMax - start) / blockSize);
  return { start, count };
}

export function drawCell(
  ctx: Context,
  x: number,
  y: number,
) {
  const { left, top, right, bottom } = CELL_POINTS(x, y);
  ctx.moveTo(...left);
  ctx.lineTo(...top);
  ctx.lineTo(...right);
  ctx.lineTo(...bottom);
  ctx.closePath();
}

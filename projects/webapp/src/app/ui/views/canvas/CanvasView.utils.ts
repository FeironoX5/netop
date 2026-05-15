import type { Context } from 'konva/lib/Context';
import type { Stage } from 'konva/lib/Stage';

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

export function drawDiamondCell(
  ctx: Context,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const halfW = width / 2;
  const halfH = height / 2;
  ctx.moveTo(x + halfW, y);
  ctx.lineTo(x + width, y + halfH);
  ctx.lineTo(x + halfW, y + height);
  ctx.lineTo(x, y + halfH);
  ctx.closePath();
}

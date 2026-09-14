import type { Context } from 'konva/lib/Context';
import type { Shape } from 'konva/lib/Shape';
import type { Stage } from 'konva/lib/Stage';
import {
  CanvasCursorMode,
  type CanvasCellPosition,
} from '@/app/stores/canvasStore';
import {
  CELL_HEIGHT,
  CELL_WIDTH,
  DIAMOND_CELL_POINTS,
  RECTANGLE_CELL_POINTS,
  type CellPoints,
} from './CanvasGrid.consts';

export function getCellPoints(
  cursorMode: CanvasCursorMode,
): CellPoints {
  return cursorMode === CanvasCursorMode.Drag
    ? DIAMOND_CELL_POINTS
    : RECTANGLE_CELL_POINTS;
}

export function getCanvasPosition(
  position: CanvasCellPosition,
) {
  return {
    x: position.x * CELL_WIDTH,
    y: position.y * CELL_HEIGHT,
  };
}

export function getCanvasCellPosition(
  x: number,
  y: number,
): CanvasCellPosition {
  return {
    x: Math.round(x / CELL_WIDTH),
    y: Math.round(y / CELL_HEIGHT),
  };
}

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
  context: Context,
  points: CellPoints,
  x: number = 0,
  y: number = 0,
): void {
  const [[firstX, firstY], ...rest] = points;
  context.moveTo(firstX + x, firstY + y);
  rest.forEach(([pointX, pointY]) =>
    context.lineTo(pointX + x, pointY + y),
  );
  context.closePath();
}

export function drawSubcells(
  context: Context,
  points: CellPoints,
  x: number = 0,
  y: number = 0,
): void {
  points.forEach(([pointX, pointY], index) => {
    const [nextX, nextY] =
      points[(index + 1) % points.length]!;
    context.moveTo(x, y);
    context.lineTo(
      x + (pointX + nextX) / 2,
      y + (pointY + nextY) / 2,
    );
  });
}

export function getCellScene(points: CellPoints) {
  return (context: Context, shape: Shape): void => {
    context.beginPath();
    drawCell(context, points);
    context.fillStrokeShape(shape);
  };
}

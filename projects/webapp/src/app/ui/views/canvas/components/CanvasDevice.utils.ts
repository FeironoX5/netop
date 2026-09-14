import type { Context } from 'konva/lib/Context';
import type { Shape } from 'konva/lib/Shape';
import { appTheme } from '@/app/App.theme';
import type { CanvasCellPosition } from '@/app/stores/canvasStore';
import {
  DEVICE_CLEARANCE,
  ISOMETRIC_TEXT,
} from './CanvasDevice.consts';
import {
  CANVAS_STROKE_WIDTH,
  CELL_HEIGHT,
  CELL_WIDTH,
  type CellPoints,
} from './CanvasGrid.consts';

export function getDeviceBodyCells(
  portCount: number,
  expanded: boolean,
): number {
  return expanded ? portCount : 1;
}

export function getDeviceBodyScene(
  points: CellPoints,
  height: number,
) {
  return (context: Context, shape: Shape): void => {
    const lowerEdge = getCellEdge(points, true);

    context.beginPath();
    drawEdge(context, lowerEdge);
    lowerEdge
      .slice()
      .reverse()
      .forEach(([x, y]) => context.lineTo(x, y + height));
    context.closePath();
    context.fillStrokeShape(shape);
  };
}

export function getDeviceOutlineScene(
  points: CellPoints,
  height: number,
) {
  return (context: Context, shape: Shape): void => {
    const upperEdge = getCellEdge(points, false);
    const lowerEdge = getCellEdge(points, true);

    context.beginPath();
    drawEdge(context, upperEdge);
    lowerEdge.forEach(([x, y]) =>
      context.lineTo(x, y + height),
    );
    context.closePath();
    drawEdge(context, lowerEdge);
    context.strokeShape(shape);
  };
}

export function getDeviceBaseScene(points: CellPoints) {
  return (context: Context, shape: Shape): void => {
    context.beginPath();
    drawEdge(context, points);
    context.closePath();
    context.fillShape(shape);

    context.beginPath();
    drawEdge(context, getCellEdge(points, true));
    context.strokeShape(shape);
  };
}

function drawEdge(
  context: Context,
  points: readonly (readonly [number, number])[],
): void {
  points.forEach((point, index) => {
    if (index === 0) context.moveTo(...point);
    else context.lineTo(...point);
  });
}

function getCellEdge(points: CellPoints, lower: boolean) {
  return points
    .filter(([, y]) => (lower ? y >= 0 : y <= 0))
    .sort(([leftX], [rightX]) =>
      lower ? rightX - leftX : leftX - rightX,
    );
}

export function isDevicePositionAvailable(
  positions: ReadonlyMap<string, CanvasCellPosition>,
  path: string,
  position: CanvasCellPosition,
  getBodyCells: (path: string) => number,
): boolean {
  const bottom = position.y + getBodyCells(path);

  for (const [otherPath, otherPosition] of positions) {
    if (
      otherPath !== path &&
      Math.abs(position.x - otherPosition.x) <=
        DEVICE_CLEARANCE.horizontal &&
      position.y <=
        otherPosition.y +
          getBodyCells(otherPath) +
          DEVICE_CLEARANCE.vertical &&
      otherPosition.y - DEVICE_CLEARANCE.vertical <= bottom
    ) {
      return false;
    }
  }

  return true;
}

function getVisualBase() {
  return {
    listening: false,
    perfectDrawEnabled: false,
    shadowEnabled: false,
  };
}

export function getFilledVisualConfig(
  fill: string,
  stroke?: string,
) {
  return {
    ...getVisualBase(),
    fill,
    stroke,
    strokeWidth: CANVAS_STROKE_WIDTH,
    strokeEnabled: stroke !== undefined,
  };
}

export function getOutlineVisualConfig(
  stroke: string,
  strokeWidth: number = CANVAS_STROKE_WIDTH,
) {
  return {
    ...getVisualBase(),
    fillEnabled: false,
    stroke,
    strokeWidth,
    strokeEnabled: true,
  };
}

export function getCellTextConfig(
  text: string,
  ellipsis: boolean,
  isSkewed: boolean,
) {
  const config = {
    text,
    ellipsis,
    fontSize: 8,
    fontFamily: appTheme.f.main,
    fill: appTheme.c.text,
    align: 'center',
    verticalAlign: 'middle',
    width: CELL_WIDTH,
    height: CELL_HEIGHT,
    wrap: 'none',
    listening: false,
  };

  if (!isSkewed)
    return {
      ...config,
      x: -CELL_WIDTH / 2,
      y: -CELL_HEIGHT / 2,
      skewX: 0,
      scaleY: 1,
    };

  return {
    ...config,
    x:
      -CELL_WIDTH / 2 -
      (ISOMETRIC_TEXT.skewX *
        ISOMETRIC_TEXT.scaleY *
        CELL_HEIGHT) /
        2,
    y: -(CELL_HEIGHT / 2) * ISOMETRIC_TEXT.scaleY,
    ...ISOMETRIC_TEXT,
  };
}

export const CELL_WIDTH = 50;
export const CELL_HEIGHT = CELL_WIDTH / Math.sqrt(3);
export const CANVAS_STROKE_WIDTH = 1;
export const SUBCELL_OPACITY = 0.2;
export const GRID_RENDER_DEBOUNCE = 16;

export type CellPoints = readonly [
  readonly [number, number],
  readonly [number, number],
  readonly [number, number],
  readonly [number, number],
];

export const DIAMOND_CELL_POINTS = [
  [-CELL_WIDTH / 2, 0],
  [0, -CELL_HEIGHT / 2],
  [CELL_WIDTH / 2, 0],
  [0, CELL_HEIGHT / 2],
] as const satisfies CellPoints;

export const RECTANGLE_CELL_POINTS = [
  [-CELL_WIDTH / 2, CELL_HEIGHT / 2],
  [-CELL_WIDTH / 2, -CELL_HEIGHT / 2],
  [CELL_WIDTH / 2, -CELL_HEIGHT / 2],
  [CELL_WIDTH / 2, CELL_HEIGHT / 2],
] as const satisfies CellPoints;

export const PIECE_MAX_CELLS = 30;

export const ZOOM_THRESHOLD = 2;

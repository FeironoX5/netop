export const CELL_WIDTH = 50;
export const CELL_HEIGHT = CELL_WIDTH / Math.sqrt(3);

export const CELL_POINTS = (x: number = 0, y: number = 0) =>
  ({
    left: [-CELL_WIDTH / 2 + x, y],
    top: [x, -CELL_HEIGHT / 2 + y],
    right: [CELL_WIDTH / 2 + x, y],
    bottom: [x, CELL_HEIGHT / 2 + y],
    get values(): [
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
    ] {
      return [
        ...this.left,
        ...this.top,
        ...this.right,
        ...this.bottom,
      ];
    },
  }) as const;

export const PIECE_MAX_CELLS = 30;

export const ZOOM_THRESHOLD = 2;

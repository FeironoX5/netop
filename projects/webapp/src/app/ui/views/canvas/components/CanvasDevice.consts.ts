export const DEVICE_CLEARANCE = {
  horizontal: 1,
  vertical: 2,
} as const;

export const ISOMETRIC_TEXT = {
  skewX: -Math.tan((30 * Math.PI) / 180),
  scaleY: Math.cos((30 * Math.PI) / 180),
} as const;

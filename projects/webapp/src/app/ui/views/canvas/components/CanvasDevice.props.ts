import { canvasEntityProps } from './CanvasEntity.props';

export const canvasDeviceProps = {
  ...canvasEntityProps,
  capText: { type: String, required: true },
} as const;

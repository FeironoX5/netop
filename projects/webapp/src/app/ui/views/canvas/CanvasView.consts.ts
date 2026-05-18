export const SCALE_STEP_MULTIPLIER = 1.02;
export const SCALE_LIMITS = { min: 0.8, max: 2.5 };

export const DEVICES: {
  x: number;
  y: number;
  label: string;
  connections: { label: string }[];
}[] = [
  {
    x: 0,
    y: 0,
    label: 'R1',
    connections: [{ label: 'R2' }, { label: 'R3' }],
  },
  { x: 350, y: 250, label: 'R2', connections: [] },
  { x: 550, y: 250, label: 'R3', connections: [] },
];

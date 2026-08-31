import type { Simulation } from '@netop/types';
import type { PropType } from 'vue';

export const connectionDetailsProps = {
  connection: {
    type: Object as PropType<Simulation.Connection>,
    required: true,
  },
} as const;

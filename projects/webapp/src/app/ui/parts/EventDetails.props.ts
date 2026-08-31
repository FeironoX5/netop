import type { SimulationEventMessage } from '@netop/types';
import type { PropType } from 'vue';

export const eventDetailsProps = {
  message: {
    type: Object as PropType<SimulationEventMessage>,
    required: true,
  },
} as const;

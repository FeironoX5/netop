import type { FlatSimulationEntity } from '@netop/types';
import type { PropType } from 'vue';

export const canvasEntityProps = {
  path: { type: String, required: true },
  entity: {
    type: Object as PropType<FlatSimulationEntity>,
    required: true,
  },
} as const;

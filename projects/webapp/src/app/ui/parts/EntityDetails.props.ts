import type { FlatSimulationEntity } from '@netop/types';
import type { PropType } from 'vue';

export const entityDetailsProps = {
  entity: {
    type: Object as PropType<FlatSimulationEntity>,
    required: true,
  },
  path: { type: String, required: true },
} as const;

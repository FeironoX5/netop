import type { PropType } from 'vue';
import type { DetailsRow } from './DetailsTable.types';

export const detailsTableProps = {
  rows: {
    type: Array as PropType<readonly DetailsRow[]>,
    required: true,
  },
} as const;

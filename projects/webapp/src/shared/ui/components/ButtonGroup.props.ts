import type { PropType } from 'vue';
import type { ButtonGroupItemData } from './ButtonGroup.types';

export const buttonGroupProps = {
  items: {
    type: Array as PropType<readonly ButtonGroupItemData[]>,
    required: true,
  },
  isSelectable: {
    type: Boolean,
    default: false,
  },
} as const;

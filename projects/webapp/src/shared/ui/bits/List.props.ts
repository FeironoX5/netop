import type { PropType } from 'vue';

export const listProps = {
  direction: {
    type: String as PropType<'row' | 'column'>,
    default: 'column',
  },
} as const;

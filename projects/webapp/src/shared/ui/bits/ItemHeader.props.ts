import type { PropType } from 'vue';

export type ItemHeaderTone =
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error';

export const itemHeaderProps = {
  icon: { type: String, required: true },
  text: { type: String, required: true },
  tone: {
    type: String as PropType<ItemHeaderTone>,
    default: 'neutral',
  },
} as const;

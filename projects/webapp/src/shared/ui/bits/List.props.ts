import { type CSSProperties, type PropType } from 'vue';

export const listProps = {
  direction: {
    type: String as PropType<CSSProperties['flexDirection']>,
    default: 'column',
  },
} as const;

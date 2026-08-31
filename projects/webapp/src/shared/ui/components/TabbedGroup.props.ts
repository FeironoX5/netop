import type { PropType } from 'vue';
import type { ButtonGroupItemData } from './ButtonGroup.types';

export type TabbedGroupItem = Pick<
  ButtonGroupItemData,
  'icon' | 'name'
> & { value: string };

export type TabbedGroupItems = readonly [
  TabbedGroupItem,
  ...TabbedGroupItem[],
];

export const tabbedGroupProps = {
  items: {
    type: Array as unknown as PropType<TabbedGroupItems>,
    required: true,
  },
} as const;

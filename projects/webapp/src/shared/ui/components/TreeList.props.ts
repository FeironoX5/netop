import type { PropType } from 'vue';

export type TreeListEntry = {
  key: PropertyKey;
  depth: number;
  text: string;
};

export const treeListProps = {
  items: {
    type: Array as PropType<readonly TreeListEntry[]>,
    required: true,
  },
} as const;

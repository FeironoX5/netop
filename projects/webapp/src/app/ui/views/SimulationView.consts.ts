import type { TabbedGroupItems } from '@components/TabbedGroup.props';

export const SIMULATION_TABS = [
  { icon: 'box', name: 'Entities', value: 'entities' },
  {
    icon: 'cable',
    name: 'Connections',
    value: 'connections',
  },
] as const satisfies TabbedGroupItems;

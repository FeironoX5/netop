import ConsoleView from '../views/ConsoleView.vue';
import HistoryView from '../views/HistoryView.vue';
import SimulationView from '../views/SimulationView.vue';
import type { PanelTool } from './EditorPage.types';

export const LEFT_PANEL_TOOLS: PanelTool[] = [
  {
    icon: 'boxes',
    name: 'Simulation',
    view: SimulationView,
  },
  { icon: 'code', name: 'Editor' },
  { icon: 'network', name: 'Network' },
] as const;

export const RIGHT_PANEL_TOOLS: PanelTool[] = [
  {
    icon: 'history',
    name: 'Change History',
    view: HistoryView,
  },
  { icon: 'terminal', name: 'Console', view: ConsoleView },
] as const;

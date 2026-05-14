import ConsoleView from '../views/ConsoleView.vue';
import type { PanelTool } from './EditorPage.types';

export const leftPanelTools: PanelTool[] = [
  { icon: 'box', name: 'Objects' },
  { icon: 'code', name: 'Editor' },
  { icon: 'network', name: 'Network' },
] as const;

export const rightPanelTools: PanelTool[] = [
  { icon: 'history', name: 'Change History' },
  { icon: 'terminal', name: 'Console', view: ConsoleView },
] as const;

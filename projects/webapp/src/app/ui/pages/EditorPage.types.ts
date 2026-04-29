import type { Component } from 'vue';

export type PanelTool = {
  icon: string;
  name: string;
  view?: Component;
};

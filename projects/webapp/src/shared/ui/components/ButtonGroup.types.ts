export type ButtonGroupItemData = {
  icon?: string;
  name?: string;
  action?: () => unknown | Promise<unknown>;
};

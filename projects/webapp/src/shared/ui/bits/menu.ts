import { shallowRef } from 'vue';

export type MenuCloseReason = 'select' | 'dismiss';
export type MenuActionResult = void | MenuCloseReason;

export interface MenuItemData {
  name: string;
  icon?: string;
  endIcon?: string;
  action?: () => MenuActionResult | Promise<MenuActionResult>;
}

export interface MenuEntry {
  id: number;
  items: readonly MenuItemData[];
  x: number;
  y: number;
  resolve: (reason: MenuCloseReason) => void;
}

export const menus = shallowRef<MenuEntry[]>([]);

let id = 0;

export function openMenu(items: readonly MenuItemData[]): Promise<MenuCloseReason> {
  const anchor = getAnchorRect();
  const rootMenu = menus.value[0];
  if (rootMenu) closeMenu(rootMenu, 'dismiss');

  return pushMenu(items, anchor?.left ?? 0, anchor?.bottom ?? 0);
}

export function openSubmenu(items: readonly MenuItemData[]): Promise<MenuCloseReason> {
  const anchorElement = document.activeElement as HTMLElement | null;
  const anchor = anchorElement?.getBoundingClientRect();
  const parentElement = anchorElement?.closest<HTMLElement>('[data-menu]');
  const parentIndex = menus.value.findIndex(
    (entry) => entry.id === Number(parentElement?.dataset.menuId),
  );
  const parent = parentIndex === -1 ? menus.value.at(-1) : menus.value[parentIndex];
  const parentRect = parentElement?.getBoundingClientRect() ?? getMenuRect(parent);

  if (parentIndex !== -1) {
    const child = menus.value[parentIndex + 1];
    if (child) closeMenu(child, 'dismiss');
  }

  return pushMenu(
    items,
    parentRect?.right ?? anchor?.left ?? 0,
    anchor?.top ?? parentRect?.top ?? 0,
  );
}

function pushMenu(items: readonly MenuItemData[], x: number, y: number): Promise<MenuCloseReason> {
  return new Promise((resolve) => {
    menus.value = [...menus.value, { id: id++, items, x, y, resolve }];
  });
}

export function closeMenu(entry: MenuEntry, reason: MenuCloseReason = 'select') {
  const idx = menus.value.indexOf(entry);
  if (idx === -1) return;

  const removed = menus.value.slice(idx);
  menus.value = menus.value.slice(0, idx);
  removed.forEach((menu) => menu.resolve(reason));
}

function getAnchorRect(): DOMRect | undefined {
  return (document.activeElement as HTMLElement | null)?.getBoundingClientRect();
}

function getMenuRect(entry: MenuEntry | undefined): DOMRect | undefined {
  if (!entry) return;
  return document
    .querySelector<HTMLElement>(`[data-menu-id="${entry.id}"]`)
    ?.getBoundingClientRect();
}

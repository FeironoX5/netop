<template>
  <Teleport to="body">
    <div
      v-for="menu in menus"
      :key="menu.id"
      data-menu
      :data-menu-id="menu.id"
      class="menu"
      :style="{ left: `${menu.x}px`, top: `${menu.y}px` }"
      @click.stop
      @mouseleave="handleMouseLeave(menu, $event)"
    >
      <div
        class="menu-item"
        v-for="item in menu.items"
        :key="item.name"
      >
        <Button
          class="menu-item-button"
          :icon="item.icon"
          :text="item.name"
          @click.stop="handleClick(menu, item)"
        />
        <Icon
          class="menu-item-end-icon"
          :icon="item.endIcon"
        />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import Button from '@bits/Button.vue';
import Icon from '@bits/Icon.vue';
import { closeMenu, menus } from '@bits/menu';
import type { MenuEntry, MenuItemData } from '@bits/menu';
import { onMounted, onUnmounted } from 'vue';

async function handleClick(
  menu: MenuEntry,
  item: MenuItemData,
) {
  if (!item.action) {
    closeMenu(menu);
    return;
  }

  let shouldClose = true;

  try {
    const reason = await item.action();
    // Submenu dismiss resolves openSubmenu(), but should not close its parent.
    shouldClose = reason !== 'dismiss';
  } finally {
    if (shouldClose) closeMenu(menu);
  }
}

function closeAllMenus() {
  const rootMenu = menus.value[0];
  if (rootMenu) closeMenu(rootMenu, 'dismiss');
}

function handleMouseLeave(
  menu: MenuEntry,
  event: MouseEvent,
) {
  const target = event.relatedTarget;
  if (target instanceof Element) {
    const targetMenu =
      target.closest<HTMLElement>('[data-menu]');
    const currentIndex = menus.value.indexOf(menu);
    const targetIndex = menus.value.findIndex(
      (entry) =>
        entry.id === Number(targetMenu?.dataset.menuId),
    );

    if (targetIndex > currentIndex) return;
  }

  closeMenu(menu, 'dismiss');
}

onMounted(() =>
  document.addEventListener('click', closeAllMenus),
);
onUnmounted(() =>
  document.removeEventListener('click', closeAllMenus),
);
</script>

<style scoped>
.menu {
  position: fixed;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  min-width: 10rem;
  padding: calc(var(--s-spacing));
  background: var(--c-l1-bg);
  border: var(--border);
  border-radius: var(--s-border-radius-inner);
}

.menu-item {
  position: relative;
}

.menu-item-button {
  justify-content: flex-start;
  width: 100%;
}

.menu-item:has(.menu-item-end-icon) .menu-item-button {
  padding-right: calc(1em + var(--s-button-spacing) * 2);
}

.menu-item-end-icon {
  position: absolute;
  top: 50%;
  right: var(--s-button-spacing);
  pointer-events: none;
  transform: translateY(-50%);
}
</style>

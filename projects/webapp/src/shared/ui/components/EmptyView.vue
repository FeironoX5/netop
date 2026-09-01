<template>
  <div class="empty-view">
    <slot />
  </div>
</template>

<style scoped>
.empty-view {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  min-height: 8rem;
  padding: var(--s-spacing);
  color: var(--c-placeholder-text);
  font-size: var(--s-font-size-sm);
  text-align: center;
}
</style>

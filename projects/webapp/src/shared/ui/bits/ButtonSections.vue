<template>
  <div class="button-sections" role="group">
    <slot />
  </div>
</template>

<style scoped>
.button-sections {
  display: inline-flex;
  overflow: hidden;
  max-height: calc(
    var(--s-font-size) * 2 + var(--s-spacing-sm) * 2
  );
  border-radius: var(--s-border-radius-inner);
}

:deep(button) {
  border-radius: 0;
}
</style>

<template>
  <div class="button-sections" role="group">
    <slot />
  </div>
</template>

<style scoped>
.button-sections {
  display: inline-flex;
  overflow: hidden;
  max-height: var(--max-button-height);
  border-radius: var(--s-border-radius-inner);
}

:deep(button) {
  border-radius: 0;
}
</style>

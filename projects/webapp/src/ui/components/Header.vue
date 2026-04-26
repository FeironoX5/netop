<template>
  <div class="header">
    <img class="logo" src="/logo.svg" />
    <Button text="File" />
    <Button text="View" />
    <Button text="Settings" />
    <span class="spacer" />
    <Button icon="code" text="Source" />
  </div>
</template>

<script setup lang="ts">
import Button from '../bits/Button.vue';
</script>

<style scoped>
.header {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--s-spacing);
  padding: var(--s-spacing) 1rem;
  background-color: var(--c-l1-bg);
  border-bottom: var(--border);
  overflow: hidden;
}

.logo {
  height: 1.3rem;
  width: auto;
  pointer-events: none;
  margin-right: 0.5rem;
}
</style>

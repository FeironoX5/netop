<template>
  <div class="header">
    <List
      direction="row"
      :items="[{ name: 'File' }, { name: 'View' }, { name: 'Settings' }]"
      :endItems="[{ name: 'Source', icon: 'code' }]"
    >
      <img class="logo" src="/logo.svg" />
    </List>
  </div>
</template>

<script setup lang="ts">
import List from './List.vue';
</script>

<style scoped>
.header {
  padding: var(--s-spacing) 1rem;
  background-color: var(--c-l1-bg);
  border-bottom: var(--border);
  overflow: hidden;

  & .logo {
    align-self: center;
    height: 1.3rem;
    width: auto;
    pointer-events: none;
    margin-right: 0.5rem;
  }
}
</style>

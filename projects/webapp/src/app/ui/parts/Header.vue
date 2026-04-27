<template>
  <div class="header">
    <List direction="row">
      <template #start>
        <img class="logo" src="/logo.svg" />
      </template>
      <ButtonGroup
        :items="[
          {
            name: 'File',
          },
          {
            name: 'Edit',
          },
        ]"
      />
      <template #end>
        <Button class="list-item" icon="code" text="Source" />
      </template>
    </List>
  </div>
</template>

<script setup lang="ts">
import Button from '@bits/Button.vue';
import List from '@bits/List.vue';
import ButtonGroup from '@components/ButtonGroup.vue';
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

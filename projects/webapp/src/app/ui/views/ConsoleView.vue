<template>
  <div class="console-view inline-container column full">
    <div class="input-area inline-container row full">
      <span class="prefix">></span>
      <Textarea class="prompt" placeholder="" :rows="2" />
    </div>
    <div class="filter-area inline-container row full">
      <div class="filter-content">
        <ButtonMultiGroup
          :items="[
            { name: 'Thing 1' },
            { name: 'Thing 2' },
            { name: 'Thing 3' },
            { name: 'Thing 4' },
            { name: 'Thing 5' },
          ]"
          v-model:activeItemIndexes="activeItemIndexes"
        />
      </div>
      <!-- <div class="arrow-area"> -->
      <!-- <Icon icon="chevrons-up-down" /> -->
      <!-- </div> -->
    </div>
    <div class="output-area">
      <div
        class="output-item inline-container column"
        v-for="item in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '7', '8', '9', '7', '8', '9']"
      >
        <span class="output-item-content">{{ item }}</span>
        <div class="output-item-actions inline-container row">
          <span class="timestamp">11:05</span>
          <span class="spacer" />
          <Button icon="copy" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@bits/Button.vue';
import Icon from '@bits/Icon.vue';
import Textarea from '@bits/Textarea.vue';
import ButtonMultiGroup from '@components/ButtonMultiGroup.vue';
import { ref } from 'vue';

const activeItemIndexes = ref<number[]>([]);
</script>

<style scoped>
.input-area {
  background: var(--c-l0-bg);
  font-family: var(--f-code);
  line-height: 1;
  padding: var(--s-spacing);
  gap: 5px;
}
.prompt {
  flex: 1;
}
.prefix {
  user-select: none;
  color: var(--c-border);
}
.filter-content {
  padding: var(--s-spacing);
  padding-right: 0;
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}
.arrow-area {
  padding: 5px 10px;
  user-select: none;
  background: var(--c-l0-bg);
  cursor: pointer;
}
.output-area {
  background: var(--c-l0-bg);
  flex: 1;
  overflow: scroll;
  padding-bottom: 30vh;
}
.output-item {
  display: block;
  border-bottom: 1px solid var(--c-border);
  padding: var(--s-spacing);
}
.output-item-content {
  font-family: var(--f-code);
}
.output-item-actions {
  font-size: var(--s-font-size-sm);
}
</style>

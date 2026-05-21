<template>
  <textarea
    ref="textarea"
    v-model="model"
    :placeholder="props.placeholder"
    :rows="props.rows"
    :disabled="props.disabled"
  ></textarea>
</template>

<script setup lang="ts">
import { useTextareaAutosize } from '@vueuse/core';
import { useTemplateRef } from 'vue';
import { textareaProps } from './Textarea.props';

const props = defineProps(textareaProps);
const model = defineModel<string>({ default: '' });
const textareaEl =
  useTemplateRef<HTMLTextAreaElement>('textarea');

useTextareaAutosize({
  element: textareaEl,
  input: model,
});

defineExpose({
  focus: (options?: FocusOptions) =>
    textareaEl.value?.focus(options),
});
</script>

<style scoped>
textarea {
  background: none;
  border: none;
  outline: none;
  resize: none;
  color: var(--c-text);
  padding: 0;
}
textarea::placeholder {
  color: var(--c-placeholder-text);
}
textarea:disabled {
  cursor: wait;
  color: var(--c-disabled-text);
}
</style>

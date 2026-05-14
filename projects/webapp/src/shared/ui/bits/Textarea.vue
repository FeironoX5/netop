<template>
  <textarea
    ref="textarea"
    :placeholder="props.placeholder"
    :rows="props.rows"
    :disabled="props.disabled"
    :value="model"
    @input="onInput"
  ></textarea>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { textareaProps } from './Textarea.props';

const props = defineProps(textareaProps);
const model = defineModel<string>({
  default: '',
});
const textarea =
  useTemplateRef<HTMLTextAreaElement>('textarea');

const onInput = () => {
  const el = textarea.value;
  if (!el) return;
  model.value = el.value;
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
};
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
  color: var(--c-border);
}
textarea:disabled {
  cursor: wait;
  color: var(--c-text-disabled);
}
</style>

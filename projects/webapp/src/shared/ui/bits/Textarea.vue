<template>
  <textarea
    ref="textarea"
    :placeholder="props.placeholder"
    :rows="props.rows"
    @input="resize"
  ></textarea>
</template>
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { textareaProps } from './Textarea.props';

const props = defineProps(textareaProps);
const chat = useTemplateRef<HTMLTextAreaElement>('textarea');

const resize = () => {
  const el = chat.value;
  if (!el) return;
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
</style>

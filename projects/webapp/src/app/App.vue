<template>
  <EditorPage />
  <MenuOutlet />
</template>

<script setup lang="ts">
import MenuOutlet from '@components/MenuOutlet.vue';
import EditorPage from '@ui/pages/EditorPage.vue';
</script>

<style>
@import 'styles/main.css';
@import 'lucide-static/font/lucide.css';
</style>

<template>
  <i v-if="icon" :class="`icon-${icon}`" />
</template>

<script setup lang="ts">
import { iconProps } from './Icon.props';
defineProps(iconProps);
</script>

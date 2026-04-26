<template>
  <div
    v-if="rendered"
    class="sidebar"
    :class="[`side-${side}`, stateClass]"
    :aria-hidden="!isOpen"
    @animationend="onAnimationEnd"
  >
    <div class="sidebar-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: true,
  },
  side: {
    type: String,
    default: 'left',
  },
});

const rendered = ref(props.isOpen);
const animState = ref<'idle' | 'opening' | 'closing'>('idle');

watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      rendered.value = true;
      animState.value = 'opening';
    } else {
      animState.value = 'closing';
    }
  },
  { immediate: true }
);

const stateClass = computed(() => {
  return {
    opening: animState.value === 'opening',
    closing: animState.value === 'closing',
  };
});

function onAnimationEnd() {
  if (animState.value === 'closing') {
    rendered.value = false;
  }
  animState.value = 'idle';
}
</script>

<style scoped>
.sidebar {
  --sidebar-width: 300px;

  width: var(--sidebar-width);
  flex: 0 0 var(--sidebar-width);
  display: flex;
  flex-direction: column;
  gap: var(--s-spacing);
  padding: var(--s-spacing);
  background-color: var(--c-l1-bg);
  overflow: hidden;
}

.sidebar.side-left.opening {
  animation: slide-in-left 0.15s ease-out forwards;
}

.sidebar.side-left.closing {
  animation: slide-out-left 0.15s ease-out forwards;
}

.sidebar.side-right.opening {
  animation: slide-in-right 0.15s ease-out forwards;
}

.sidebar.side-right.closing {
  animation: slide-out-right 0.15s ease-out forwards;
}

@keyframes slide-in-left {
  from {
    margin-left: calc(-1 * var(--sidebar-width));
    opacity: 0;
  }
  to {
    margin-left: 0;
    opacity: 1;
  }
}

@keyframes slide-out-left {
  from {
    margin-left: 0;
    opacity: 1;
  }
  to {
    margin-left: calc(-1 * var(--sidebar-width));
    opacity: 0;
  }
}

@keyframes slide-in-right {
  from {
    margin-right: calc(-1 * var(--sidebar-width));
    opacity: 0;
  }
  to {
    margin-right: 0;
    opacity: 1;
  }
}

@keyframes slide-out-right {
  from {
    margin-right: 0;
    opacity: 1;
  }
  to {
    margin-right: calc(-1 * var(--sidebar-width));
    opacity: 0;
  }
}

.sidebar-content {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: var(--s-spacing);
  min-width: 0;
}

.sidebar-content :deep(.sidebar-section) {
  display: contents;
}

.sidebar-content :deep(.sidebar-section + .sidebar-section) {
  &::before {
    content: '';
    border-left: var(--border);
  }
}
</style>

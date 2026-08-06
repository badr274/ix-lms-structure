<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
});

const dimension = computed(() => {
  switch (props.size) {
    case 'sm':
      return { width: 'w-4', height: 'h-4', stroke: 3 };
    case 'lg':
      return { width: 'w-10', height: 'h-10', stroke: 3.5 };
    case 'md':
    default:
      return { width: 'w-6', height: 'h-6', stroke: 3 };
  }
});
</script>

<template>
  <div :class="['inline-flex items-center justify-center shrink-0', dimension.width, dimension.height, props.class]">
    <svg
      class="animate-spin w-full h-full text-current"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Background subtle translucent track ring -->
      <circle
        class="opacity-20"
        cx="12"
        cy="12"
        r="9.5"
        stroke="currentColor"
        :stroke-width="dimension.stroke"
      />

      <!-- Active animated gradient arc -->
      <path
        class="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  </div>
</template>

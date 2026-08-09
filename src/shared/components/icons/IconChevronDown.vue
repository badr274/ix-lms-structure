<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

interface Props {
  class?: HTMLAttributes['class'];
  size?: number | string;
}
const props = withDefaults(defineProps<Props>(), {
  size: 16,
});
</script>

<template>
  <svg
    :class="props.class"
    :width="props.size"
    :height="props.size"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8 10.6667L4 6.66667H12L8 10.6667Z" fill="currentColor" />
  </svg>
</template>

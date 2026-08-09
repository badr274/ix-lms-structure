<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

interface Props {
  class?: HTMLAttributes['class'];
  size?: number | string;
}
const props = withDefaults(defineProps<Props>(), {
  size: 24,
});
</script>

<template>
  <svg
    :class="props.class"
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20.0508 16C20.5728 16 21 16.4272 21 16.9492V17.0508C21 17.5728 20.5728 18 20.0508 18H3.94824C3.42624 18 3 17.5728 3 17.0508V16.9492C3 16.4272 3.42624 16 3.94824 16H20.0508ZM20.0508 11C20.5728 11 21 11.4272 21 11.9492V12.0508C21 12.5728 20.5728 13 20.0508 13H3.94824C3.42624 13 3 12.5728 3 12.0508V11.9492C3 11.4272 3.42624 11 3.94824 11H20.0508ZM20.0508 6C20.5728 6 21 6.42722 21 6.94922V7.05078C21 7.57278 20.5728 8 20.0508 8H3.94824C3.42624 8 3 7.57278 3 7.05078V6.94922C3 6.42722 3.42624 6 3.94824 6H20.0508Z"
      fill="currentColor"
    />
  </svg>
</template>

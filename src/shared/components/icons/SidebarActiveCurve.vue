<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

interface Props {
  class?: HTMLAttributes['class'];
}
const props = defineProps<Props>();
</script>

<template>
  <!-- Exact Figma Union Curve Shape (268x96px with 24px radius pill and 24px outward fillets) -->
  <svg
    :class="[
      'pointer-events-none fill-background transition-all duration-200 rtl:-scale-x-100',
      props.class,
    ]"
    width="268"
    height="96"
    viewBox="0 0 268 96"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <path
      d="M268 96C268 82.7452 257.255 72 244 72H24C10.7452 72 0 61.2548 0 48C0 34.7452 10.7452 24 24 24H244C257.255 24 268 13.2548 268 0V96Z"
      class="fill-background"
    />
  </svg>
</template>

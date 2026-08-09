<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

interface Props {
  class?: HTMLAttributes['class'];
  hasUnread?: boolean;
  size?: number | string;
}
const props = withDefaults(defineProps<Props>(), {
  hasUnread: true,
  size: 24,
});
</script>

<template>
  <div class="relative inline-flex items-center justify-center">
    <svg
      :class="props.class"
      :width="props.size"
      :height="props.size"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Bell Body -->
      <path
        d="M18.75 10.75C18.75 12.75 20.75 13.75 20.75 15.75C20.75 18.75 16.3056 19.75 12.75 19.75C9.19445 19.75 4.75 18.75 4.75 15.75C4.75 13.75 6.75 12.9914 6.75 10.75C6.75 7.75 8.75 4.75 12.75 4.75C16.75 4.75 18.75 7.75 18.75 10.75Z"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <!-- Bell Clapper -->
      <path
        d="M10.75 20C10.75 20 11.4167 21 12.75 21C14.0834 21 14.75 20 14.75 20"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <!-- Unread Red Indicator Dot (Figma exact: #ea2b31 / bg-destructive) -->
    <span
      v-if="props.hasUnread"
      class="absolute top-0.5 right-0.5 size-1.5 rounded-full bg-destructive"
    />
  </div>
</template>

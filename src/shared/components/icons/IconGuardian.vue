<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

interface Props {
  class?: HTMLAttributes['class'];
  size?: number | string;
}
const props = withDefaults(defineProps<Props>(), {
  size: 20,
});
</script>

<template>
  <svg
    :class="props.class"
    :width="props.size"
    :height="props.size"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.15256 2.35498L10 0.833333L16.8474 2.35498C17.2287 2.43972 17.5 2.77789 17.5 3.16848V11.4908C17.5 13.1625 16.6645 14.7237 15.2735 15.651L10 19.1667L4.7265 15.651C3.33551 14.7237 2.5 13.1625 2.5 11.4908V3.16848C2.5 2.77789 2.77128 2.43972 3.15256 2.35498ZM4.16667 3.83695V11.4908C4.16667 12.6053 4.72367 13.646 5.651 14.2643L10 17.1636L14.349 14.2643C15.2763 13.646 15.8333 12.6053 15.8333 11.4908V3.83695L10 2.54066L4.16667 3.83695ZM10 9.16667C8.84942 9.16667 7.91667 8.23393 7.91667 7.08333C7.91667 5.93274 8.84942 5 10 5C11.1506 5 12.0833 5.93274 12.0833 7.08333C12.0833 8.23393 11.1506 9.16667 10 9.16667ZM6.27288 13.3333C6.48016 11.4583 8.06977 10 10 10C11.9302 10 13.5198 11.4583 13.7271 13.3333H6.27288Z"
      fill="currentColor"
    />
  </svg>
</template>

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
      d="M17.5 15.8333H19.1667V17.5H0.833333V15.8333H2.5V3.33333C2.5 2.8731 2.8731 2.5 3.33333 2.5H11.6667C12.1269 2.5 12.5 2.8731 12.5 3.33333V15.8333H15.8333V9.16667H14.1667V7.5H16.6667C17.1269 7.5 17.5 7.8731 17.5 8.33333V15.8333ZM4.16667 4.16667V15.8333H10.8333V4.16667H4.16667ZM5.83333 9.16667H9.16667V10.8333H5.83333V9.16667ZM5.83333 5.83333H9.16667V7.5H5.83333V5.83333Z"
      fill="currentColor"
    />
  </svg>
</template>

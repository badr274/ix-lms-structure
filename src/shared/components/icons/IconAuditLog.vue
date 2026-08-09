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
      d="M2.5 2.5H17.5C17.9602 2.5 18.3333 2.8731 18.3333 3.33333V16.6667C18.3333 17.1269 17.9602 17.5 17.5 17.5H2.5C2.03977 17.5 1.66667 17.1269 1.66667 16.6667V3.33333C1.66667 2.8731 2.03977 2.5 2.5 2.5ZM3.33333 4.16667V15.8333H16.6667V4.16667H3.33333ZM5.83333 10.8333H7.5V14.1667H5.83333V10.8333ZM9.16667 5.83333H10.8333V14.1667H9.16667V5.83333ZM12.5 8.33333H14.1667V14.1667H12.5V8.33333Z"
      fill="currentColor"
    />
  </svg>
</template>

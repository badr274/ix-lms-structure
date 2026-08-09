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
    :class="['rounded-full overflow-hidden shrink-0', props.class]"
    :width="props.size"
    :height="props.size"
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <clipPath id="circleClip">
      <circle cx="30" cy="30" r="30" />
    </clipPath>
    <g clip-path="url(#circleClip)">
      <rect width="60" height="60" fill="#012169" />
      <path d="M0 0L60 60M60 0L0 60" stroke="#FFFFFF" stroke-width="12" />
      <path d="M0 0L60 60M60 0L0 60" stroke="#C8102E" stroke-width="6" />
      <path d="M30 0V60M0 30H60" stroke="#FFFFFF" stroke-width="18" />
      <path d="M30 0V60M0 30H60" stroke="#C8102E" stroke-width="10" />
    </g>
  </svg>
</template>

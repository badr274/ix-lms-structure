<script setup lang="ts">
import { computed } from 'vue';
import { Button } from '@/components/ui/button';
import AppSpinner from '../ui/AppSpinner.vue';

interface Props {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  loadingText?: string;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'default',
  size: 'default',
  loading: false,
  disabled: false,
  fullWidth: false,
});

const spinnerSize = computed(() => {
  return props.size === 'sm' ? 'sm' : props.size === 'lg' ? 'md' : 'sm';
});
</script>

<template>
  <Button
    :type="type"
    :variant="variant"
    :size="size"
    :disabled="disabled || loading"
    :class="[
      'font-bold cursor-pointer transition-all flex items-center justify-center gap-2 select-none',
      fullWidth && 'w-full',
      loading && 'opacity-90 cursor-not-allowed',
      props.class
    ]"
  >
    <!-- Automatic Unified Spinner when loading: true -->
    <AppSpinner v-if="loading" :size="spinnerSize" />

    <!-- Button Content -->
    <template v-if="loading && loadingText">
      <span>{{ loadingText }}</span>
    </template>
    <template v-else>
      <slot />
    </template>
  </Button>
</template>

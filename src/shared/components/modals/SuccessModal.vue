<script setup lang="ts">
import AppModal from './AppModal.vue';
import { Button } from '@/components/ui/button';

interface Props {
  open: boolean;
  title?: string;
  description?: string;
  buttonText?: string;
}

withDefaults(defineProps<Props>(), {
  open: false,
  title: 'Congratulations !',
  description: 'The operation has been completed successfully.',
  buttonText: 'Continue',
});

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'confirm'): void;
  (e: 'close'): void;
}>();

function handleConfirm() {
  emit('confirm');
  emit('update:open', false);
}
</script>

<template>
  <AppModal
    :open="open"
    size="sm"
    hide-close
    @update:open="(val) => emit('update:open', val)"
    @close="emit('close')"
  >
    <div class="flex flex-col items-center text-center py-2 px-2 select-none">
      <!-- Green Circular Success Badge (Figma Frame 43:308) -->
      <div class="size-16 rounded-full bg-emerald-500 text-white flex items-center justify-center text-3xl shadow-sm mb-4 animate-in zoom-in-75 duration-200">
        ✓
      </div>

      <!-- Success Title -->
      <h3 class="font-zain font-bold text-[24px] text-foreground leading-tight m-0">
        <slot name="title">{{ title }}</slot>
      </h3>

      <!-- Success Description -->
      <p class="font-zain font-light text-[14px] text-muted-foreground leading-[1.4] mt-2 mb-6 max-w-sm m-0">
        <slot name="description">{{ description }}</slot>
      </p>

      <!-- Shadcn Action Button -->
      <Button
        type="button"
        @click="handleConfirm"
        class="w-full max-w-[200px]"
      >
        {{ buttonText }}
      </Button>
    </div>
  </AppModal>
</template>

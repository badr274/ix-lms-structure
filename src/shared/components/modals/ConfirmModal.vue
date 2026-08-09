<script setup lang="ts">
import AppModal from './AppModal.vue';
import { Button } from '@/components/ui/button';

interface Props {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'primary' | 'warning';
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {
  open: false,
  title: 'Are you sure?',
  description: 'This action cannot be undone. Are you sure you want to proceed?',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  variant: 'destructive',
  loading: false,
});

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

function handleConfirm() {
  emit('confirm');
}

function handleCancel() {
  emit('cancel');
  emit('update:open', false);
}
</script>

<template>
  <AppModal
    :open="open"
    size="sm"
    @update:open="(val) => emit('update:open', val)"
    @close="handleCancel"
  >
    <div class="flex flex-col items-center text-center py-2 px-2 select-none">
      <!-- Icon Badge based on Variant -->
      <div
        :class="[
          'size-16 rounded-full flex items-center justify-center text-3xl shadow-xs mb-4 animate-in zoom-in-75 duration-200',
          variant === 'destructive'
            ? 'bg-destructive/10 text-destructive'
            : variant === 'warning'
              ? 'bg-amber-500/10 text-amber-600'
              : 'bg-primary/10 text-primary',
        ]"
      >
        <span v-if="variant === 'destructive'">🗑️</span>
        <span v-else-if="variant === 'warning'">⚠️</span>
        <span v-else>❓</span>
      </div>

      <!-- Confirm Title -->
      <h3 class="font-zain font-bold text-[22px] text-foreground leading-tight m-0">
        <slot name="title">{{ title }}</slot>
      </h3>

      <!-- Confirm Description -->
      <p class="font-zain font-light text-[14px] text-muted-foreground leading-[1.4] mt-2 mb-6 max-w-sm m-0">
        <slot name="description">{{ description }}</slot>
      </p>

      <!-- Shadcn Action Buttons (Cancel + Confirm) -->
      <div class="flex items-center justify-center gap-3 w-full">
        <Button
          type="button"
          variant="outline"
          :disabled="loading"
          @click="handleCancel"
          class="flex-1"
        >
          {{ cancelText }}
        </Button>

        <Button
          type="button"
          :variant="variant === 'destructive' ? 'destructive' : 'default'"
          :disabled="loading"
          @click="handleConfirm"
          class="flex-1"
        >
          <span v-if="loading" class="animate-spin text-sm">⏳</span>
          <span>{{ confirmText }}</span>
        </Button>
      </div>
    </div>
  </AppModal>
</template>

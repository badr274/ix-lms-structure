<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface Props {
  open: boolean;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  hideClose?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  size: 'md',
  hideClose: false,
});

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'close'): void;
}>();

const sizeClasses = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-xl',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
  full: 'sm:max-w-[95vw]',
};
</script>

<template>
  <Dialog
    :open="open"
    @update:open="(val) => { emit('update:open', val); if (!val) emit('close'); }"
  >
    <DialogContent
      :show-close-button="!hideClose"
      :class="sizeClasses[size]"
    >
      <!-- Modal Header -->
      <DialogHeader v-if="title || $slots.header || description || $slots.description">
        <slot name="header">
          <DialogTitle v-if="title">
            {{ title }}
          </DialogTitle>
          <DialogDescription v-if="description || $slots.description">
            <slot name="description">{{ description }}</slot>
          </DialogDescription>
        </slot>
      </DialogHeader>

      <!-- Modal Body Content Slot -->
      <div class="flex-1 w-full flex flex-col">
        <slot />
      </div>

      <!-- Modal Footer Actions Slot -->
      <DialogFooter v-if="$slots.footer">
        <slot name="footer" />
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

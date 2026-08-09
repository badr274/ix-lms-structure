<script setup lang="ts">
import { IconNotification } from '@shared/components/icons';

interface Props {
  hasUnread?: boolean;
}
withDefaults(defineProps<Props>(), {
  hasUnread: true,
});

const emit = defineEmits<{
  (e: 'click'): void;
}>();
</script>

<template>
  <button
    type="button"
    @click="emit('click')"
    class="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground transition-all duration-200 hover:border-primary/50 hover:text-primary cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    title="Notifications"
    aria-label="Notifications"
  >
    <IconNotification :has-unread="hasUnread" :size="22" />
  </button>
</template>

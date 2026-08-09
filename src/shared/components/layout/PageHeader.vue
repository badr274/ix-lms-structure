<script setup lang="ts">
import { computed, type Component } from 'vue';
import { IconPlusCircle } from '@shared/components/icons';
import { Button } from '@/components/ui/button';

interface Props {
  title?: string;
  description?: string;
  actionText?: string;
  actionIcon?: Component;
  actionTo?: string | object;
  showAction?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showAction: true,
  actionIcon: () => IconPlusCircle,
});

const emit = defineEmits<{
  (e: 'action'): void;
  (e: 'actionClick'): void;
}>();

const hasAction = computed(() => {
  return props.showAction && (Boolean(props.actionText) || Boolean(props.actionTo));
});
</script>

<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full pb-6 select-none">
    <!-- Left: Page Title & Description (Figma Node 78:1548) -->
    <div class="flex flex-col gap-1">
      <h2 class="font-zain font-bold text-[24px] sm:text-[28px] text-foreground leading-[1.2] m-0">
        <slot name="title">{{ title }}</slot>
      </h2>
      <p
        v-if="description || $slots.description"
        class="font-zain font-light text-[14px] text-muted-foreground leading-[1.4] tracking-[-0.28px] m-0"
      >
        <slot name="description">{{ description }}</slot>
      </p>
    </div>

    <!-- Right: Optional Action Button (Shadcn Button) -->
    <div v-if="$slots.actions || $slots.action || hasAction" class="flex items-center gap-3 shrink-0">
      <slot name="actions">
        <slot name="action">
          <!-- Router Link Button -->
          <Button
            v-if="actionTo"
            as-child
          >
            <router-link :to="actionTo">
              <component :is="actionIcon" :size="20" class="shrink-0" />
              <span>{{ actionText }}</span>
            </router-link>
          </Button>

          <!-- Standard Action Button -->
          <Button
            v-else-if="actionText"
            type="button"
            @click="emit('action'); emit('actionClick')"
          >
            <component :is="actionIcon" :size="20" class="shrink-0" />
            <span>{{ actionText }}</span>
          </Button>
        </slot>
      </slot>
    </div>
  </div>
</template>

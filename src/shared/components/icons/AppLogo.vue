<script setup lang="ts">
import LogoMark from './LogoMark.vue';
import LogoText from './LogoText.vue';

interface Props {
  class?: string;
  collapsed?: boolean;
}
withDefaults(defineProps<Props>(), {
  collapsed: false,
});
</script>

<template>
  <div :class="['flex items-center gap-3 select-none', $props.class]">
    <!-- Icon Logo Mark -->
    <div class="shrink-0 flex items-center justify-center text-sidebar-foreground">
      <LogoMark :width="34" :height="38" />
    </div>

    <!-- NASAQ Text & Subtitle -->
    <div v-if="!collapsed" class="flex flex-col items-start gap-0.5 overflow-hidden transition-all duration-200">
      <div class="text-sidebar-foreground">
        <LogoText :width="108" :height="24" />
      </div>
      <span class="font-langar text-[8.5px] tracking-wide text-sidebar-foreground/90 uppercase whitespace-nowrap">
        Learning Management System
      </span>
    </div>
  </div>
</template>

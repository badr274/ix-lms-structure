<script setup lang="ts">
import { useThemeStore } from '@stores/theme.store';
import { IconNight, IconLight } from '@shared/components/icons';

const themeStore = useThemeStore();
</script>

<template>
  <button
    type="button"
    @click="themeStore.toggleTheme()"
    class="relative flex h-10 w-20 items-center justify-between rounded-full border border-border bg-background p-1 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    :title="themeStore.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
    aria-label="Toggle Theme"
  >
    <!-- Night / Dark Mode Option -->
    <div
      class="flex size-8 shrink-0 items-center justify-center rounded-full transition-all duration-200"
      :class="
        themeStore.isDark
          ? 'bg-primary text-primary-foreground shadow-xs'
          : 'text-muted-foreground hover:text-foreground'
      "
    >
      <IconNight :size="18" />
    </div>

    <!-- Light Mode Option -->
    <div
      class="flex size-8 shrink-0 items-center justify-center rounded-full transition-all duration-200"
      :class="
        !themeStore.isDark
          ? 'bg-primary text-primary-foreground shadow-xs'
          : 'text-muted-foreground hover:text-foreground'
      "
    >
      <IconLight :size="18" />
    </div>
  </button>
</template>

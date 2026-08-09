<script setup lang="ts">
import { useLocaleStore } from '@stores/locale.store';
import { IconUkFlag } from '@shared/components/icons';

const localeStore = useLocaleStore();
</script>

<template>
  <button
    type="button"
    @click="localeStore.toggleLocale()"
    class="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-background p-2 transition-all duration-200 hover:border-primary/50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    :title="localeStore.currentLocale === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'"
    aria-label="Toggle Language"
  >
    <template v-if="localeStore.currentLocale === 'en'">
      <IconUkFlag :size="24" />
    </template>
    <template v-else>
      <span class="font-bold text-xs text-primary leading-none">ع</span>
    </template>
  </button>
</template>

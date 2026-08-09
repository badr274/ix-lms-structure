<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { Toaster } from 'vue-sonner';
import { ModalHost } from '@shared/components/modals';
import { AppLayout } from '@shared/components/layout';

const route = useRoute();

const currentLayout = computed(() => {
  // Routes that explicitly disable layout (e.g. login, register, or meta.layout === 'none' | false)
  if (
    route.meta?.layout === 'none' ||
    route.meta?.layout === false ||
    route.name === 'login' ||
    route.name === 'register'
  ) {
    return 'div';
  }
  // All dashboard and protected routes automatically use AppLayout!
  return AppLayout;
});
</script>

<template>
  <div class="min-h-screen bg-sidebar text-foreground font-sans transition-colors duration-300">
    <!-- Sonner Toaster component -->
    <Toaster position="top-center" richColors expand closeButton />

    <!-- Global Programmatic Modals Host (Confirm & Success) -->
    <ModalHost />

    <!-- Automatic Global Dynamic Layout Wrapper -->
    <component :is="currentLayout" :title="(route.meta?.title as string) || 'Dashboard'">
      <router-view />
    </component>
  </div>
</template>

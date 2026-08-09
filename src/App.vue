<script setup lang="ts">
import { Toaster } from 'vue-sonner';
import { ModalHost } from '@shared/components/modals';
</script>

<template>
  <div class="min-h-screen bg-sidebar text-foreground font-sans transition-colors duration-300">
    <!-- Sonner Toaster component -->
    <Toaster position="top-center" richColors expand closeButton />

    <!-- Global Programmatic Modals Host (Confirm & Success) -->
    <ModalHost />

    <!-- Vue Router View -->
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { Toaster } from 'vue-sonner';
</script>

<template>
  <div class="min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
    <!-- Off-the-shelf vue-sonner Toaster component -->
    <Toaster position="top-center" richColors expand closeButton />

    <!-- Vue Router View -->
    <router-view />
  </div>
</template>

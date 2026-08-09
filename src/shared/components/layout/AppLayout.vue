<script setup lang="ts">
import { useUiStore } from '@stores/ui.store';
import AppSidebar from './AppSidebar.vue';
import AppHeader from './AppHeader.vue';

interface Props {
  title?: string;
}
withDefaults(defineProps<Props>(), {
  title: 'Dashboard',
});

const uiStore = useUiStore();
</script>

<template>
  <div class="relative min-h-screen w-full bg-sidebar flex overflow-x-hidden font-sans">
    <!-- Desktop Persistent Left Sidebar (Collapsed or Expanded) -->
    <div
      class="hidden lg:block shrink-0 z-20 transition-all duration-300 ease-in-out"
      :class="uiStore.isSidebarCollapsed ? 'w-[88px]' : 'w-[276px]'"
    >
      <AppSidebar :collapsed="uiStore.isSidebarCollapsed" />
    </div>

    <!-- Mobile Backdrop Overlay -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="uiStore.isMobileSidebarOpen"
        @click="uiStore.closeMobileSidebar()"
        class="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        aria-hidden="true"
      />
    </Transition>

    <!-- Mobile Slide-over Drawer -->
    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="-translate-x-full rtl:translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full rtl:translate-x-full"
    >
      <div
        v-if="uiStore.isMobileSidebarOpen"
        class="fixed inset-y-0 start-0 z-50 w-[276px] shadow-2xl lg:hidden"
      >
        <AppSidebar
          show-close
          @navigate="uiStore.closeMobileSidebar()"
          @close="uiStore.closeMobileSidebar()"
        />
      </div>
    </Transition>

    <!-- Main Content Canvas (Figma Frame 10948: rounded-[30px] bg-background) -->
    <main
      class="flex-1 min-w-0 bg-background text-foreground flex flex-col my-2 mx-2 sm:my-4 sm:mx-4 lg:my-5 lg:ms-0 lg:me-5 rounded-2xl sm:rounded-[30px] p-4 sm:p-6 lg:px-8 lg:py-6 shadow-sm transition-all duration-300 overflow-y-auto"
    >
      <!-- Dashboard Canvas Header with Hamburger Menu Toggle -->
      <AppHeader :title="title">
        <template #title>
          <slot name="header-title">{{ title }}</slot>
        </template>
      </AppHeader>

      <!-- Dashboard Main Viewport Slot -->
      <div class="flex-1 w-full pt-4 flex flex-col">
        <slot />
      </div>
    </main>
  </div>
</template>

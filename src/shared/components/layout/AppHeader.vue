<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUiStore } from '@stores/ui.store';
import { IconMenu } from '@shared/components/icons';
import ThemeToggle from './ThemeToggle.vue';
import LanguageToggle from './LanguageToggle.vue';
import NotificationButton from './NotificationButton.vue';
import UserProfile from './UserProfile.vue';

interface Props {
  title?: string;
}
const props = defineProps<Props>();

const route = useRoute();
const uiStore = useUiStore();

const displayTitle = computed(() => {
  if (props.title) return props.title;
  if (route.meta?.title) return route.meta.title as string;
  const name = route.name?.toString();
  if (name === 'dashboard') return 'Dashboard';
  if (name === 'courses-list') return 'Courses';
  const path = route.path.replace('/', '');
  if (!path) return 'Dashboard';
  return path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
});
</script>

<template>
  <header class="flex w-full flex-col gap-3 pb-2 select-none">
    <!-- Top Action Bar (Figma Frame 38) -->
    <div class="flex items-center justify-between gap-4">
      <!-- Left: Menu Hamburger + Page Title -->
      <div class="flex items-center gap-3 sm:gap-4">
        <!-- Hamburger Button (Toggles Sidebar Collapse / Mobile Drawer) -->
        <button
          type="button"
          @click="uiStore.toggleSidebar()"
          class="flex size-10 items-center justify-center rounded-xl text-foreground hover:bg-muted transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          title="Toggle Navigation Menu"
          aria-label="Toggle Navigation Menu"
        >
          <IconMenu :size="24" />
        </button>

        <!-- Page Heading Title (Figma Zain:Bold 16px) -->
        <h1 class="font-zain font-bold text-base sm:text-lg text-foreground tracking-tight m-0">
          <slot name="title">{{ displayTitle }}</slot>
        </h1>
      </div>

      <!-- Right: Controls (Theme Capsule, Language Circle, Divider, Notification, User Profile) -->
      <div class="flex items-center gap-2 sm:gap-4">
        <!-- Night / Light Mode Pill Capsule Switcher -->
        <ThemeToggle />

        <!-- Language Switcher Circle (Flag / Locale) -->
        <LanguageToggle />

        <!-- Vertical Separator Line (Figma Line 73) -->
        <div class="hidden sm:block h-10 w-px bg-border shrink-0" />

        <!-- Notification Bell Circle with Red Dot -->
        <NotificationButton />

        <!-- User Profile Avatar + Saeed Kamel / Lab Manager -->
        <UserProfile />
      </div>
    </div>

    <!-- Header Bottom Divider Line (Figma Rectangle 50) -->
    <div class="h-px w-full bg-border" />
  </header>
</template>

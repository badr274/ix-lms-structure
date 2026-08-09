<script setup lang="ts">
import { type Component } from 'vue';
import { useRoute, RouterLink } from 'vue-router';

interface Props {
  to?: string;
  label: string;
  icon: Component;
  active?: boolean;
  collapsed?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
});

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const route = useRoute();

function checkIsActive(toPath?: string) {
  if (typeof props.active === 'boolean') {
    return props.active;
  }
  if (!toPath) return false;

  const currentPath = route.path.replace(/\/$/, '') || '/';
  const targetPath = toPath.replace(/\/$/, '') || '/';

  // Exact path match
  if (currentPath === targetPath) return true;

  // Subpath match (e.g. /branches/add matches /branches)
  if (targetPath !== '/' && currentPath.startsWith(targetPath + '/')) return true;

  // Courses page associated with Dashboard overview
  if (targetPath === '/dashboard' && (currentPath === '/courses' || currentPath.startsWith('/courses/'))) {
    return true;
  }

  // Named route matching
  if (route.name && typeof route.name === 'string') {
    const routeName = route.name.toLowerCase();
    const cleanTarget = targetPath.replace('/', '').toLowerCase();
    if (routeName === cleanTarget || routeName.startsWith(cleanTarget + '-')) return true;
  }

  return false;
}
</script>

<template>
  <RouterLink
    v-if="to"
    :to="to"
    v-slot="{ href, navigate, isActive: isRouterActive, isExactActive }"
    custom
  >
    <div class="relative w-full h-12 flex items-center">
      <!-- Active Tab Background with Top & Bottom Outward Curve Fillets (Figma Exact) -->
      <div
        v-if="(checkIsActive(to) || isRouterActive || isExactActive) && !collapsed"
        class="absolute inset-y-0 start-0 end-0 bg-background rounded-s-[24px] pointer-events-none z-0 shadow-xs"
      >
        <!-- Top Outward Curve (Concave fillet connecting dark sidebar to top-right canvas edge) -->
        <svg
          class="absolute end-0 -top-6 w-6 h-6 fill-background pointer-events-none rtl:-scale-x-100"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M24 0 V24 H0 C13.2548 24 24 13.2548 24 0 Z" class="fill-background" />
        </svg>

        <!-- Bottom Outward Curve (Concave fillet connecting dark sidebar to bottom-right canvas edge) -->
        <svg
          class="absolute end-0 -bottom-6 w-6 h-6 fill-background pointer-events-none rtl:-scale-x-100"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M24 24 V0 H0 C13.2548 0 24 10.7452 24 24 Z" class="fill-background" />
        </svg>
      </div>

      <!-- Interactive Navigation Link Button -->
      <a
        :href="href"
        @click="(e) => { navigate(e); emit('click'); }"
        :class="[
          'relative z-10 flex h-12 w-full items-center transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary select-none no-underline',
          collapsed ? 'justify-center px-0' : '',
          (checkIsActive(to) || isRouterActive || isExactActive)
            ? collapsed
              ? 'bg-background text-primary font-semibold rounded-2xl mx-auto size-11 shadow-sm'
              : 'ps-8 pe-4 text-primary font-semibold'
            : collapsed
              ? 'text-sidebar-foreground font-normal hover:bg-sidebar-accent/40 rounded-xl mx-auto size-11'
              : 'mx-2 px-6 text-sidebar-foreground font-normal hover:text-sidebar-foreground/90 hover:bg-sidebar-accent/30 rounded-xl',
        ]"
        :title="collapsed ? label : undefined"
        :aria-current="(checkIsActive(to) || isRouterActive || isExactActive) ? 'page' : undefined"
      >
        <!-- Nav Icon -->
        <component
          :is="icon"
          :size="20"
          :class="[
            'shrink-0 transition-colors',
            (checkIsActive(to) || isRouterActive || isExactActive)
              ? 'text-primary'
              : 'text-sidebar-foreground',
          ]"
        />

        <!-- Nav Label (Figma IBM Plex Sans 14px) -->
        <span
          v-if="!collapsed"
          class="font-ibm text-[14px] leading-[1.4] whitespace-nowrap overflow-hidden text-ellipsis ms-4"
        >
          {{ label }}
        </span>
      </a>
    </div>
  </RouterLink>
</template>

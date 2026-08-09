<script setup lang="ts">
import { useNavigation } from '@core/navigation';
import { AppLogo } from '@shared/components/icons';
import SidebarNavItem from './SidebarNavItem.vue';
import BranchSelector from './BranchSelector.vue';

interface Props {
  collapsed?: boolean;
  showClose?: boolean;
}
withDefaults(defineProps<Props>(), {
  collapsed: false,
  showClose: false,
});

const emit = defineEmits<{
  (e: 'navigate'): void;
  (e: 'close'): void;
}>();

const { visibleSections } = useNavigation();
</script>

<template>
  <aside
    :class="[
      'flex h-full flex-col justify-between bg-sidebar py-6 select-none text-sidebar-foreground transition-all duration-300 overflow-visible',
      collapsed ? 'w-[88px]' : 'w-[276px]',
    ]"
  >
    <!-- Top Brand & Navigation Section -->
    <div class="flex flex-col gap-6">
      <!-- NASAQ Brand Logo Header (Figma x=24, y=40) -->
      <div
        :class="[
          'flex items-center',
          collapsed ? 'justify-center px-2' : 'justify-between px-6',
        ]"
      >
        <router-link
          to="/dashboard"
          class="inline-block focus:outline-none"
          @click="emit('navigate')"
        >
          <AppLogo :collapsed="collapsed" />
        </router-link>

        <!-- Mobile Drawer Close Button -->
        <button
          v-if="showClose"
          type="button"
          @click="emit('close')"
          class="flex size-8 items-center justify-center rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground cursor-pointer focus:outline-none lg:hidden"
          aria-label="Close Sidebar"
        >
          ✕
        </button>
      </div>

      <!-- Dynamic RBAC Navigation Sections -->
      <div
        v-for="section in visibleSections"
        :key="section.id"
        class="flex flex-col"
      >
        <!-- Section Header Label (Figma x=24, y=120) -->
        <div v-if="!collapsed && section.title" class="px-6 pb-2 pt-2">
          <span class="font-ibm text-[12px] font-semibold text-sidebar-muted">
            {{ section.title }}
          </span>
        </div>
        <div v-else class="h-3" />

        <!-- Nav Items Stack (with spacing for outer curve fillets) -->
        <nav class="flex flex-col gap-2">
          <SidebarNavItem
            v-for="item in section.items"
            :key="item.to"
            :to="item.to"
            :label="item.label"
            :icon="item.icon"
            :collapsed="collapsed"
            @click="emit('navigate')"
          />
        </nav>
      </div>
    </div>

    <!-- Bottom Branch Selector (Figma x=24, y=562) -->
    <div :class="collapsed ? 'px-3 pt-4' : 'px-6 pt-4'">
      <BranchSelector :collapsed="collapsed" />
    </div>
  </aside>
</template>

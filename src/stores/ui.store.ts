import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUiStore = defineStore('ui', () => {
  // Desktop collapsed state (true: 88px icon-only, false: 276px full width)
  const isSidebarCollapsed = ref<boolean>(
    localStorage.getItem('sidebar_collapsed') === 'true'
  );

  // Mobile drawer open state
  const isMobileSidebarOpen = ref<boolean>(false);

  function toggleSidebar() {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      isMobileSidebarOpen.value = !isMobileSidebarOpen.value;
    } else {
      isSidebarCollapsed.value = !isSidebarCollapsed.value;
      localStorage.setItem('sidebar_collapsed', String(isSidebarCollapsed.value));
    }
  }

  function openMobileSidebar() {
    isMobileSidebarOpen.value = true;
  }

  function closeMobileSidebar() {
    isMobileSidebarOpen.value = false;
  }

  function setSidebarCollapsed(collapsed: boolean) {
    isSidebarCollapsed.value = collapsed;
    localStorage.setItem('sidebar_collapsed', String(collapsed));
  }

  return {
    isSidebarCollapsed,
    isMobileSidebarOpen,
    toggleSidebar,
    openMobileSidebar,
    closeMobileSidebar,
    setSidebarCollapsed,
  };
});

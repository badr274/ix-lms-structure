import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref<boolean>(localStorage.getItem('theme') === 'dark');

  // Initialize DOM class on store instantiation
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', isDark.value);
  }

  function toggleTheme() {
    isDark.value = !isDark.value;
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', isDark.value);
    }
  }

  return { isDark, toggleTheme };
});

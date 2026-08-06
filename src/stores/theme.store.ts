import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useThemeStore = defineStore('theme', () => {
    const isDark = ref<boolean>(localStorage.getItem('theme') === 'dark');

    function toggleTheme() {
        isDark.value = !isDark.value;
        localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', isDark.value);
    }

    return { isDark, toggleTheme };
});

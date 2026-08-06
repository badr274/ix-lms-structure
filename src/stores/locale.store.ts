import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { setLanguage, type SupportedLocale } from '@core/i18n';

export const useLocaleStore = defineStore('locale', () => {
  const currentLocale = ref<SupportedLocale>(
    (localStorage.getItem('user_locale') as SupportedLocale) || 'ar'
  );

  const isRtl = computed(() => currentLocale.value === 'ar');

  function switchLocale(newLocale: SupportedLocale) {
    currentLocale.value = newLocale;
    setLanguage(newLocale);
  }

  function toggleLocale() {
    const nextLocale = currentLocale.value === 'ar' ? 'en' : 'ar';
    switchLocale(nextLocale);
  }

  return { currentLocale, isRtl, switchLocale, toggleLocale };
});

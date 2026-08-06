import { createI18n } from 'vue-i18n';
import ar from './locales/ar.json';
import en from './locales/en.json';

export type SupportedLocale = 'ar' | 'en';

const initialLocale = (localStorage.getItem('user_locale') as SupportedLocale) || 'ar';

if (typeof document !== 'undefined') {
  document.documentElement.dir = initialLocale === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = initialLocale;
}

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: 'ar',
  messages: {
    ar,
    en,
  },
});

export function setLanguage(locale: SupportedLocale) {
  i18n.global.locale.value = locale;
  localStorage.setItem('user_locale', locale);
  document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = locale;
}

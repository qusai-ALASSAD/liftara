import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import de from './locales/de.json';
import en from './locales/en.json';
import ar from './locales/ar.json';
import type { Locale } from '@/types';

export const RTL_LOCALES: Locale[] = ['ar'];
export const isRtl = (l: Locale) => RTL_LOCALES.includes(l);

export const resources = {
  de: { translation: de },
  en: { translation: en },
  ar: { translation: ar }
} as const;

export function detectLocale(): Locale {
  if (typeof navigator === 'undefined') return 'de';
  const nav = navigator.language?.slice(0, 2).toLowerCase();
  if (nav === 'ar' || nav === 'en' || nav === 'de') return nav;
  return 'de';
}

export function applyDocumentLocale(locale: Locale) {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = locale;
  document.documentElement.dir = isRtl(locale) ? 'rtl' : 'ltr';
}

let initialised = false;
export function initI18n(locale: Locale = detectLocale()) {
  if (!initialised) {
    void i18n.use(initReactI18next).init({
      resources,
      lng: locale,
      fallbackLng: 'en',
      supportedLngs: ['de', 'en', 'ar'],
      interpolation: { escapeValue: false },
      returnNull: false
    });
    initialised = true;
  } else {
    void i18n.changeLanguage(locale);
  }
  applyDocumentLocale(locale);
  return i18n;
}

export default i18n;

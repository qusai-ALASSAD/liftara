import type { Settings } from '@/types';
import { detectLocale } from '@/i18n';

const KEY = 'liftara.settings.v1';

export const defaultSettings = (): Settings => ({
  locale: detectLocale(),
  theme: 'system',
  units: 'metric',
  premium: false,
  consent: { decided: false, analytics: false, ads: false, personalizedAds: false },
  completedWorkoutsSinceInterstitial: 0,
  favorites: []
});

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultSettings();
    return { ...defaultSettings(), ...(JSON.parse(raw) as Partial<Settings>) };
  } catch {
    return defaultSettings();
  }
}

export function saveSettings(s: Settings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* Speicher voll oder blockiert – App bleibt funktionsfähig */
  }
}

export function applyTheme(theme: Settings['theme']) {
  if (typeof document === 'undefined') return;
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  const dark = theme === 'dark' || (theme === 'system' && prefersDark);
  document.documentElement.classList.toggle('dark', dark);
}

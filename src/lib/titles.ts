import type { Locale, LocalizedText, MuscleGroup } from '@/types';
import { MUSCLES } from '@/content/muscles';
import { LOCALES } from '@/types';

/** Trainingstitel aus den Fokus-Muskelgruppen – dreisprachig, ohne harte Strings im UI. */
export function focusTitle(focus: MuscleGroup[]): LocalizedText {
  const build = (l: Locale) => focus.slice(0, 3).map((m) => MUSCLES[m].name[l]).join(' · ');
  return Object.fromEntries(LOCALES.map((l) => [l, build(l)])) as unknown as LocalizedText;
}

export const localized = (text: LocalizedText, locale: string): string =>
  text[(LOCALES.includes(locale as Locale) ? locale : 'en') as Locale] ?? text.en;

export const muscleLabel = (m: MuscleGroup, locale: string) => localized(MUSCLES[m].name, locale);

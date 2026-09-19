import { describe, expect, it } from 'vitest';
import type { Consent } from '@/types';
import { LOCALES } from '@/types';
import { canCreateCustomProgram, hasFeature, MAX_FREE_CUSTOM_PROGRAMS } from '@/lib/premium';
import { decideAd, INTERSTITIAL_EVERY } from '@/lib/ads/policy';
import { MockAdProvider } from '@/lib/ads/providers';
import { initI18n, isRtl, resources } from '@/i18n';
import i18n from '@/i18n';

const consent = (p: Partial<Consent> = {}): Consent => ({
  decided: true, analytics: false, ads: true, personalizedAds: false, ...p
});

describe('Free vs. Premium', () => {
  it('gibt Kernfunktionen immer frei', () => {
    const ctx = { premium: false };
    expect(hasFeature('coreLogging', ctx)).toBe(true);
    expect(hasFeature('exerciseLibrary', ctx)).toBe(true);
    expect(hasFeature('muscleMap', ctx)).toBe(true);
    expect(hasFeature('basicProgress', ctx)).toBe(true);
    expect(hasFeature('beginnerPrograms', ctx)).toBe(true);
  });

  it('sperrt Premium-Funktionen im Free-Tarif', () => {
    expect(hasFeature('advancedAnalytics', { premium: false })).toBe(false);
    expect(hasFeature('adFree', { premium: false })).toBe(false);
    expect(hasFeature('cloudBackup', { premium: false })).toBe(false);
  });

  it('gibt alles im Premium-Tarif frei', () => {
    expect(hasFeature('advancedAnalytics', { premium: true })).toBe(true);
    expect(hasFeature('unlimitedCustomPrograms', { premium: true })).toBe(true);
  });

  it('entsperrt den Report zeitlich begrenzt über Rewarded Ad', () => {
    const now = 1_000_000;
    expect(hasFeature('advancedAnalytics', { premium: false, rewardUnlockUntil: now + 1000, now })).toBe(true);
    expect(hasFeature('advancedAnalytics', { premium: false, rewardUnlockUntil: now - 1000, now })).toBe(false);
  });

  it('begrenzt eigene Programme im Free-Tarif', () => {
    expect(canCreateCustomProgram(0, false)).toBe(true);
    expect(canCreateCustomProgram(MAX_FREE_CUSTOM_PROGRAMS, false)).toBe(false);
    expect(canCreateCustomProgram(99, true)).toBe(true);
  });
});

describe('Werbe-Regeln', () => {
  const base = {
    placement: 'bannerHome' as const,
    premium: false,
    consent: consent(),
    inProtectedFlow: false,
    completedWorkoutsSinceInterstitial: 0
  };

  it('zeigt Premium-Nutzern keine Werbung', () => {
    expect(decideAd({ ...base, premium: true })).toEqual({ allowed: false, reason: 'premium' });
  });

  it('zeigt ohne Einwilligung keine Werbung', () => {
    expect(decideAd({ ...base, consent: consent({ ads: false }) }).allowed).toBe(false);
    expect(decideAd({ ...base, consent: { decided: false, analytics: false, ads: true, personalizedAds: true } }).allowed).toBe(false);
  });

  it('unterbricht niemals ein laufendes Training', () => {
    expect(decideAd({ ...base, inProtectedFlow: true })).toEqual({ allowed: false, reason: 'protected-flow' });
  });

  it('hält das Interstitial-Limit von jedem zweiten Training ein', () => {
    const ctx = { ...base, placement: 'interstitialPostWorkout' as const };
    for (let done = 0; done < INTERSTITIAL_EVERY; done += 1) {
      expect(decideAd({ ...ctx, completedWorkoutsSinceInterstitial: done }).allowed).toBe(false);
    }
    expect(decideAd({ ...ctx, completedWorkoutsSinceInterstitial: INTERSTITIAL_EVERY }).allowed).toBe(true);
  });

  it('erlaubt Minderjährigen niemals personalisierte Werbung', () => {
    const d = decideAd({ ...base, consent: consent({ personalizedAds: true }), age: 16 });
    expect(d).toEqual({ allowed: true, personalized: false });
    const adult = decideAd({ ...base, consent: consent({ personalizedAds: true }), age: 30 });
    expect(adult).toEqual({ allowed: true, personalized: true });
  });

  it('liefert mit dem Mock-Provider ein Ergebnis ohne echte Werbe-IDs', async () => {
    const provider = new MockAdProvider();
    expect(provider.isReady()).toBe(true);
    const res = await provider.show({ placement: 'rewardedReport', kind: 'rewarded', personalized: false, locale: 'de' });
    expect(res.shown).toBe(true);
    expect(res.rewardGranted).toBe(true);
  });
});

describe('Mehrsprachigkeit', () => {
  it('hält alle drei Sprachen auf identischem Schlüsselstand', () => {
    // Pluralsuffixe werden entfernt: Arabisch kennt sechs Formen, Deutsch und Englisch zwei.
    const strip = (k: string) => k.replace(/_(zero|one|two|few|many|other)$/, '');
    const keys = (obj: Record<string, unknown>, prefix = ''): string[] =>
      Object.entries(obj).flatMap(([k, v]) =>
        v && typeof v === 'object' ? keys(v as Record<string, unknown>, `${prefix}${k}.`) : [`${prefix}${k}`]
      );
    const base = (o: unknown) => [...new Set(keys(o as Record<string, unknown>).map(strip))].sort();
    const de = base(resources.de.translation);
    const en = base(resources.en.translation);
    const ar = base(resources.ar.translation);
    expect(de).toEqual(en);
    expect(ar).toEqual(en);
    expect(en.length).toBeGreaterThan(300);
  });

  it('bildet arabische Pluralformen vollständig ab', () => {
    initI18n('ar');
    const forms = [0, 1, 2, 3, 11, 100].map((count) => i18n.t('common.minutes', { count }));
    initI18n('en');
    expect(new Set(forms).size).toBeGreaterThanOrEqual(5);
    expect(forms.every((f) => f.length > 0 && !f.includes('common.'))).toBe(true);
  });

  it('fällt bei fehlender Übersetzung auf Englisch zurück', () => {
    initI18n('de');
    i18n.addResourceBundle('en', 'translation', { __test: { only: 'English fallback' } }, true, true);
    expect(i18n.t('__test.only')).toBe('English fallback');
  });

  it('übersetzt dieselbe Bezeichnung in allen Sprachen unterschiedlich', () => {
    const values = LOCALES.map((l) => i18n.getFixedT(l)('nav.today'));
    expect(new Set(values).size).toBe(LOCALES.length);
  });

  it('markiert Arabisch als RTL', () => {
    expect(isRtl('ar')).toBe(true);
    expect(isRtl('de')).toBe(false);
    expect(isRtl('en')).toBe(false);
  });
});

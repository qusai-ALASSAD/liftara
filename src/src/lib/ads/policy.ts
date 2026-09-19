import type { AdPlacement, Consent } from '@/types';

export interface AdContext {
  placement: AdPlacement;
  premium: boolean;
  consent: Consent;
  /** aktives Training, Satz, Pausentimer, Onboarding oder Sicherheitshinweis sichtbar */
  inProtectedFlow: boolean;
  completedWorkoutsSinceInterstitial: number;
  age?: number;
}

export type AdDecision = { allowed: true; personalized: boolean } | { allowed: false; reason: string };

export const INTERSTITIAL_EVERY = 2;

/** Zentrale Regel: Werbung darf niemals ein laufendes Training unterbrechen. */
export function decideAd(ctx: AdContext): AdDecision {
  if (ctx.premium) return { allowed: false, reason: 'premium' };
  if (!ctx.consent.decided || !ctx.consent.ads) return { allowed: false, reason: 'no-consent' };
  if (ctx.inProtectedFlow) return { allowed: false, reason: 'protected-flow' };
  if (ctx.placement === 'interstitialPostWorkout' && ctx.completedWorkoutsSinceInterstitial < INTERSTITIAL_EVERY) {
    return { allowed: false, reason: 'frequency-cap' };
  }
  const minor = typeof ctx.age === 'number' && ctx.age < 18;
  return { allowed: true, personalized: ctx.consent.personalizedAds && !minor };
}

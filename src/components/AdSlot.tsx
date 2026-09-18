import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Megaphone, Sparkles } from 'lucide-react';
import type { AdPlacement } from '@/types';
import { decideAd } from '@/lib/ads/policy';
import { createAdProvider } from '@/lib/ads/providers';
import { useAppStore } from '@/store/appStore';
import { useSessionStore } from '@/store/sessionStore';
import { Button } from './ui';

const provider = createAdProvider(import.meta.env.VITE_AD_PROVIDER === 'web' ? 'web' : 'mock');

function useAdDecision(placement: AdPlacement) {
  const settings = useAppStore((s) => s.settings);
  const profile = useAppStore((s) => s.profile);
  const activeWorkout = useSessionStore((s) => s.workout);
  return decideAd({
    placement,
    premium: settings.premium,
    consent: settings.consent,
    inProtectedFlow: Boolean(activeWorkout) && placement !== 'interstitialPostWorkout',
    completedWorkoutsSinceInterstitial: settings.completedWorkoutsSinceInterstitial,
    age: profile?.age
  });
}

/** Banner nur auf ruhigen Screens – niemals im laufenden Training. */
export function AdBanner({ placement }: { placement: Extract<AdPlacement, 'bannerHome' | 'bannerLibrary'> }) {
  const { t } = useTranslation();
  const decision = useAdDecision(placement);
  if (!decision.allowed) return null;
  return (
    <aside className="card flex items-center gap-3 border-dashed p-3" aria-label={t('ads.label')}>
      <Megaphone className="h-5 w-5 shrink-0 text-royal-500" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide muted">{t('ads.label')}</p>
        <p className="truncate text-sm font-medium">{t('ads.mock')}</p>
      </div>
      <span className="text-[11px] muted">{t('ads.removeHint')}</span>
    </aside>
  );
}

export function InterstitialAd({ onClose }: { onClose: () => void }) {
  const { t, i18n } = useTranslation();
  const decision = useAdDecision('interstitialPostWorkout');
  const patchSettings = useAppStore((s) => s.patchSettings);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!decision.allowed) return;
    let cancelled = false;
    const locale = i18n.resolvedLanguage === 'ar' || i18n.resolvedLanguage === 'en' ? i18n.resolvedLanguage : 'de';
    void provider.show({ placement: 'interstitialPostWorkout', kind: 'interstitial', personalized: decision.personalized, locale }).then((res) => {
      if (!cancelled && res.shown) {
        setShown(true);
        patchSettings({ completedWorkoutsSinceInterstitial: 0 });
      }
    });
    return () => { cancelled = true; };
  }, [decision.allowed, decision.allowed && decision.personalized, i18n.resolvedLanguage, patchSettings]);

  if (!decision.allowed || !shown) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/70 p-6" role="dialog" aria-modal="true" aria-label={t('ads.label')}>
      <div className="card w-full max-w-sm animate-fade-up p-6 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-wide muted">{t('ads.label')}</p>
        <div className="my-6 flex h-40 items-center justify-center rounded-2xl border border-dashed hairline">
          <span className="text-sm muted">{t('ads.mock')}</span>
        </div>
        <Button onClick={() => { setShown(false); onClose(); }} className="w-full">{t('common.close')}</Button>
      </div>
    </div>
  );
}

export function RewardedAdCard() {
  const { t, i18n } = useTranslation();
  const settings = useAppStore((s) => s.settings);
  const grant = useAppStore((s) => s.grantRewardUnlock);
  const decision = useAdDecision('rewardedReport');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (settings.premium) return null;
  return (
    <div className="card border-dashed p-4">
      <div className="flex items-start gap-3">
        <Sparkles className="mt-0.5 h-5 w-5 text-moss-500" aria-hidden />
        <div className="flex-1">
          <p className="font-semibold">{t('ads.rewardTitle')}</p>
          <p className="mt-1 text-sm muted">{done ? t('ads.granted') : t('ads.rewardText')}</p>
          {!done && (
            <Button
              size="sm" variant="secondary" loading={loading} className="mt-3"
              disabled={!decision.allowed}
              onClick={async () => {
                setLoading(true);
                const locale = i18n.resolvedLanguage === 'ar' || i18n.resolvedLanguage === 'en' ? i18n.resolvedLanguage : 'de';
                const res = await provider.show({ placement: 'rewardedReport', kind: 'rewarded', personalized: decision.allowed && decision.personalized, locale });
                setLoading(false);
                if (res.rewardGranted) { grant(); setDone(true); }
              }}
            >
              {t('ads.watch')}
            </Button>
          )}
          {!decision.allowed && !done && <p className="mt-2 text-xs muted">{t('ads.consentRequired')}</p>}
        </div>
      </div>
    </div>
  );
}

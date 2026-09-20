import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle, ChevronDown, Dumbbell, Flame, Gauge, RefreshCw, Repeat, Stethoscope, Timer, TrendingUp, Users
} from 'lucide-react';
import type { EducationTopic } from '@/content/education';
import { EDUCATION } from '@/content/education';
import { Card, SectionTitle } from '@/components/ui';
import { Page } from '@/components/Layout';
import { AdBanner } from '@/components/AdSlot';
import { localized } from '@/lib/titles';
import { LOCALES, type Locale } from '@/types';

const ICONS: Record<EducationTopic['icon'], React.ComponentType<{ className?: string }>> = {
  weight: Dumbbell, reps: Repeat, timer: Timer, gauge: Gauge, trend: TrendingUp,
  flame: Flame, users: Users, refresh: RefreshCw, alert: AlertTriangle
};

export default function EducationScreen() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState<string | null>(EDUCATION[0]?.id ?? null);
  const locale: Locale = LOCALES.includes(i18n.language as Locale) ? (i18n.language as Locale) : 'en';

  return (
    <Page title={t('education.title')} subtitle={t('education.subtitle')}>
      <ul className="space-y-2">
        {EDUCATION.map((topic) => {
          const Icon = ICONS[topic.icon];
          const isOpen = open === topic.id;
          const body = topic.body[locale] ?? topic.body.en;
          return (
            <Card key={topic.id} as="li">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : topic.id)}
                className="flex w-full items-start gap-3 text-start"
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{localized(topic.title, i18n.language)}</span>
                  <span className="mt-0.5 block text-sm muted">{localized(topic.summary, i18n.language)}</span>
                </span>
                <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden />
              </button>
              {isOpen && (
                <div className="mt-3 space-y-2 text-sm">
                  {body.map((p, i) => <p key={i}>{p}</p>)}
                </div>
              )}
            </Card>
          );
        })}
      </ul>

      <SectionTitle>{t('disclaimer.title')}</SectionTitle>
      <Card className="border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
        <p className="flex items-start gap-2 text-sm">
          <Stethoscope className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden />
          <span>{t('disclaimer.text')}</span>
        </p>
      </Card>

      <div className="mt-6">
        <AdBanner placement="bannerLibrary" />
      </div>
    </Page>
  );
}

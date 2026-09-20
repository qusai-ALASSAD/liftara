import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Button, Card, EmptyState } from '@/components/ui';
import { Page } from '@/components/Layout';
import { useAppStore } from '@/store/appStore';

type LegalPage = 'privacy' | 'terms' | 'disclaimer';
const PAGES: LegalPage[] = ['privacy', 'terms', 'disclaimer'];

export default function LegalScreen() {
  const { page } = useParams();
  const { t } = useTranslation();
  const setConsent = useAppStore((s) => s.setConsent);
  const key = PAGES.includes(page as LegalPage) ? (page as LegalPage) : null;

  if (!key) {
    return (
      <Page title={t('errors.notFound')}>
        <EmptyState title={t('errors.notFound')} text={t('errors.notFoundText')} />
      </Page>
    );
  }

  const paragraphs =
    key === 'privacy'
      ? [t('privacy.p1'), t('privacy.p2'), t('privacy.p3'), t('privacy.p4')]
      : key === 'terms'
        ? [t('terms.p1'), t('terms.p2'), t('terms.p3')]
        : [t('disclaimer.text')];

  return (
    <Page
      title={t(`${key}.title`)}
      action={
        <Link to="/profile" className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold text-brand-500 dark:text-brand-300">
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
          {t('common.back')}
        </Link>
      }
    >
      <Card>
        <div className="space-y-3 text-sm leading-relaxed">
          {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        {key === 'privacy' && (
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => setConsent({ ads: false, analytics: false, personalizedAds: false })}
          >
            {t('privacy.withdraw')}
          </Button>
        )}
      </Card>
      <p className="mt-4 text-xs muted">{t('common.estimateNote')}</p>
    </Page>
  );
}

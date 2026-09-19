import { useEffect, useState, type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CalendarCheck, Dumbbell, LineChart, PersonStanding, User, WifiOff, Download, X } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { Button } from './ui';

const ITEMS = [
  { to: '/', key: 'today', Icon: CalendarCheck },
  { to: '/muscles', key: 'muscles', Icon: PersonStanding },
  { to: '/programs', key: 'programs', Icon: Dumbbell },
  { to: '/progress', key: 'progress', Icon: LineChart },
  { to: '/profile', key: 'profile', Icon: User }
];

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white shadow-cta">
        <Dumbbell className="h-5 w-5" aria-hidden />
      </span>
      {!compact && <span className="font-display text-lg font-bold tracking-tight">LIFTARA</span>}
    </span>
  );
}

/** Mobile: Tab-Leiste unten. Desktop: seitliche Navigation (siehe SideNav). */
export function BottomNav() {
  const { t } = useTranslation();
  return (
    <nav
      aria-label={t('common.appName')}
      className="safe-bottom fixed bottom-0 start-0 end-0 z-40 border-t hairline bg-[rgb(var(--surface-raised))]/95 backdrop-blur lg:hidden"
    >
      <ul className="mx-auto flex max-w-app items-stretch justify-between px-2 pt-1.5">
        {ITEMS.map(({ to, key, Icon }) => (
          <li key={key} className="flex-1">
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex min-h-[54px] flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-semibold transition ${
                  isActive ? 'text-brand-600 dark:text-brand-300' : 'muted hover:text-brand-500'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`flex h-7 w-12 items-center justify-center rounded-full transition ${isActive ? 'tint' : ''}`}>
                    <Icon className="h-[21px] w-[21px]" strokeWidth={isActive ? 2.5 : 1.9} aria-hidden />
                  </span>
                  <span>{t(`nav.${key}`)}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SideNav() {
  const { t } = useTranslation();
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-e hairline bg-[rgb(var(--surface-raised))] px-4 py-6 lg:block">
      <div className="px-2">
        <Wordmark />
        <p className="mt-1 ps-12 text-[11px] font-medium muted">{t('common.tagline')}</p>
      </div>
      <nav aria-label={t('common.appName')} className="mt-8">
        <ul className="space-y-1">
          {ITEMS.map(({ to, key, Icon }) => (
            <li key={key}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-brand-500 text-white shadow-cta'
                      : 'text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className="h-5 w-5" strokeWidth={isActive ? 2.4 : 1.9} aria-hidden />
                    {t(`nav.${key}`)}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export function OfflineBadge() {
  const online = useAppStore((s) => s.online);
  const { t } = useTranslation();
  if (online) return null;
  return (
    <div className="mb-3 flex items-center gap-2 rounded-2xl bg-warn-50 px-3.5 py-2.5 text-sm font-medium text-warn-600 dark:bg-warn-500/15 dark:text-warn-100" role="status">
      <WifiOff className="h-4 w-4 shrink-0" aria-hidden />
      <span>{t('today.offlineNote')}</span>
    </div>
  );
}

export function InstallPrompt() {
  const { t } = useTranslation();
  const settings = useAppStore((s) => s.settings);
  const patch = useAppStore((s) => s.patchSettings);
  const [evt, setEvt] = useState<Event | null>(null);

  useEffect(() => {
    const handler = (e: Event) => { e.preventDefault(); setEvt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!evt || settings.installPromptDismissedAt) return null;
  return (
    <div className="card mb-3 flex items-center gap-3 p-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl tint text-brand-500">
        <Download className="h-5 w-5" aria-hidden />
      </span>
      <p className="flex-1 text-sm font-semibold">{t('common.installApp')}</p>
      <Button
        size="sm"
        onClick={async () => {
          const anyEvt = evt as Event & { prompt?: () => Promise<void> };
          await anyEvt.prompt?.();
          setEvt(null);
        }}
      >
        {t('common.start')}
      </Button>
      <button aria-label={t('common.dismiss')} className="rounded-lg p-1 muted" onClick={() => { patch({ installPromptDismissedAt: Date.now() }); setEvt(null); }}>
        <X className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}

/**
 * Seitenrahmen: mobil volle Breite, ab Tablet zentriert mit fester Maximalbreite,
 * damit einzelne Karten nicht über den ganzen Bildschirm gezogen werden.
 */
export function Page({
  title, subtitle, children, action, wide
}: { title?: string; subtitle?: string; children: ReactNode; action?: ReactNode; wide?: boolean }) {
  const location = useLocation();
  useEffect(() => { window.scrollTo({ top: 0 }); }, [location.pathname]);
  return (
    <main className={`mx-auto w-full ${wide ? 'max-w-5xl' : 'max-w-2xl'} px-4 pb-28 pt-6 lg:pb-12 lg:pt-10`}>
      {title && (
        <header className="mb-5 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-display text-[26px] font-bold leading-tight">{title}</h1>
            {subtitle && <p className="mt-1.5 text-sm muted">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </main>
  );
}

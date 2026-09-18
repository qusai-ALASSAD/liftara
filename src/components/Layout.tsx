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

export function BottomNav() {
  const { t } = useTranslation();
  return (
    <nav
      aria-label={t('common.appName')}
      className="safe-bottom fixed bottom-0 start-0 end-0 z-40 border-t hairline bg-[rgb(var(--surface-raised))]/95 backdrop-blur"
    >
      <ul className="mx-auto flex max-w-2xl items-stretch justify-between px-2 pt-1.5">
        {ITEMS.map(({ to, key, Icon }) => (
          <li key={key} className="flex-1">
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[11px] font-medium transition ${
                  isActive ? 'text-royal-600 dark:text-royal-300' : 'muted hover:text-royal-500'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="h-[22px] w-[22px]" strokeWidth={isActive ? 2.4 : 1.8} aria-hidden />
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

export function OfflineBadge() {
  const online = useAppStore((s) => s.online);
  const { t } = useTranslation();
  if (online) return null;
  return (
    <div className="mb-3 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-900/30 dark:text-amber-200" role="status">
      <WifiOff className="h-4 w-4" aria-hidden />
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
      <Download className="h-5 w-5 text-royal-500" aria-hidden />
      <p className="flex-1 text-sm font-medium">{t('common.installApp')}</p>
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

export function Page({ title, subtitle, children, action, wide }: { title?: string; subtitle?: string; children: ReactNode; action?: ReactNode; wide?: boolean }) {
  const location = useLocation();
  useEffect(() => { window.scrollTo({ top: 0 }); }, [location.pathname]);
  return (
    <main className={`mx-auto w-full ${wide ? 'max-w-4xl' : 'max-w-2xl'} px-4 pb-28 pt-6`}>
      {title && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold">{title}</h1>
            {subtitle && <p className="mt-1 text-sm muted">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </main>
  );
}

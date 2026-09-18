import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '@/App';
import type { Locale } from '@/types';
import { demoProfile } from '@/content/demoProfile';
import { profileRepo, wipeAllData } from '@/db/repositories';
import { useAppStore } from '@/store/appStore';
import { useSessionStore } from '@/store/sessionStore';
import { applyDocumentLocale, initI18n } from '@/i18n';

async function boot(locale: Locale) {
  await wipeAllData();
  useSessionStore.setState({ workout: null, activeIndex: 0, rest: null, lastSummaryId: null });
  await profileRepo.put({ ...demoProfile(locale), locale });
  await useAppStore.getState().init();
  initI18n(locale);
  applyDocumentLocale(locale);
}

describe('Oberfläche in allen Sprachen', () => {
  beforeEach(() => cleanup());

  it.each<[Locale, string]>([
    ['de', 'ltr'],
    ['en', 'ltr'],
    ['ar', 'rtl']
  ])('rendert die Startseite auf %s mit Schreibrichtung %s', async (locale, dir) => {
    await boot(locale);
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(document.documentElement.dir).toBe(dir);
    expect(document.documentElement.lang).toBe(locale);
    await waitFor(() => expect(screen.getByRole('heading', { level: 1 })).toBeTruthy());
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('Qusai');
    // Bottom-Navigation mit fünf Einträgen ist in jeder Sprache vorhanden
    expect(screen.getAllByRole('link').length).toBeGreaterThanOrEqual(5);
  });
});

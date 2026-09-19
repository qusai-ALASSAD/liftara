import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';
import type { MuscleGroup } from '@/types';
import { MUSCLE_GROUPS } from '@/types';
import { Card, Chip, Input } from '@/components/ui';
import { Page } from '@/components/Layout';
import { AdBanner } from '@/components/AdSlot';
import { ExerciseFilters, ExerciseList, emptyFilters, filterExercises, type ExerciseFilterState } from '@/components/ExerciseList';
import { EXERCISES } from '@/content/exercises';
import { muscleLabel } from '@/lib/titles';
import { useAppStore } from '@/store/appStore';

export default function LibraryScreen() {
  const { t, i18n } = useTranslation();
  const favorites = useAppStore((s) => s.settings.favorites ?? []);
  const [filters, setFilters] = useState<ExerciseFilterState>(emptyFilters);
  const [muscle, setMuscle] = useState<MuscleGroup | null>(null);

  const items = useMemo(() => {
    const base = muscle ? EXERCISES.filter((ex) => ex.primary.includes(muscle)) : EXERCISES;
    return filterExercises(base, { ...filters, locale: i18n.language, favorites });
  }, [muscle, filters, i18n.language, favorites]);

  const dirty = muscle !== null || filters.query !== '' || filters.equipment.length > 0
    || filters.difficulty.length > 0 || filters.place !== null || filters.onlyFavorites;

  return (
    <Page
      title={t('exercise.library')}
      subtitle={t('exercise.libraryCount', { count: items.length, total: EXERCISES.length })}
      wide
    >
      <Card className="mb-3 p-3">
        <label className="sr-only" htmlFor="ex-search">{t('exercise.searchPh')}</label>
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 shrink-0 muted" aria-hidden />
          <Input
            id="ex-search"
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            placeholder={t('exercise.searchPh')}
            className="border-0 bg-transparent px-0 shadow-none focus:shadow-none"
          />
          {dirty && (
            <button
              type="button"
              onClick={() => { setFilters(emptyFilters); setMuscle(null); }}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold muted hover:text-brand-600"
            >
              <X className="h-3.5 w-3.5" aria-hidden />{t('common.reset')}
            </button>
          )}
        </div>
      </Card>

      <div className="mb-2.5 flex gap-1.5 overflow-x-auto pb-1" role="group" aria-label={t('common.muscles')}>
        <Chip size="sm" active={muscle === null} onClick={() => setMuscle(null)}>{t('common.all')}</Chip>
        {MUSCLE_GROUPS.map((m) => (
          <Chip key={m} size="sm" active={muscle === m} onClick={() => setMuscle(m)}>{muscleLabel(m, i18n.language)}</Chip>
        ))}
      </div>

      <div className="mb-5">
        <ExerciseFilters state={filters} onChange={setFilters} favorites={favorites.length} />
      </div>

      <ExerciseList items={items} columns={2} />

      <div className="mt-6">
        <AdBanner placement="bannerLibrary" />
      </div>
    </Page>
  );
}

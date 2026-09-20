import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Library, Clock } from 'lucide-react';
import type { MuscleGroup } from '@/types';
import { Badge, Card, Chip, Progress, SectionTitle } from '@/components/ui';
import { Page } from '@/components/Layout';
import { AnatomyMap } from '@/components/AnatomyMap';
import { ExerciseFilters, ExerciseList, emptyFilters, filterExercises, type ExerciseFilterState } from '@/components/ExerciseList';
import { AdBanner } from '@/components/AdSlot';
import { EXERCISES } from '@/content/exercises';
import { MUSCLES } from '@/content/muscles';
import { FRONT_REGIONS, BACK_REGIONS, type AnatomyRegion } from '@/content/anatomy';
import { localized, muscleLabel } from '@/lib/titles';
import { useAppStore } from '@/store/appStore';
import { recoveryByMuscle } from '@/lib/recovery';

export default function MusclesScreen() {
  const { t, i18n } = useTranslation();
  const workouts = useAppStore((s) => s.workouts);
  const favorites = useAppStore((s) => s.settings.favorites ?? []);
  const [side, setSide] = useState<'front' | 'back'>('front');
  const [region, setRegion] = useState<AnatomyRegion | null>(FRONT_REGIONS[0] ?? null);
  const [filters, setFilters] = useState<ExerciseFilterState>(emptyFilters);

  const recovery = useMemo(() => recoveryByMuscle(workouts), [workouts]);
  const trained = recovery.filter((r) => r.percent < 90).map((r) => r.muscle);
  const group: MuscleGroup | null = region?.group ?? null;
  const regionRecovery = recovery.find((r) => r.muscle === group);

  const matching = useMemo(() => {
    if (!group) return [];
    const base = EXERCISES.filter((ex) => ex.primary.includes(group) || ex.secondary.includes(group));
    return filterExercises(base, { ...filters, locale: i18n.language, favorites });
  }, [group, filters, i18n.language, favorites]);

  const regions = side === 'front' ? FRONT_REGIONS : BACK_REGIONS;

  return (
    <Page
      title={t('muscles.title')}
      subtitle={t('muscles.subtitle')}
      action={
        <Link to="/library" className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-brand-600 hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-ink-800">
          <Library className="h-4 w-4" aria-hidden />
          {t('exercise.library')}
        </Link>
      }
    >
      <Card className="p-3">
        <div className="mb-3 flex gap-2">
          <Chip active={side === 'front'} onClick={() => setSide('front')}>{t('muscles.front')}</Chip>
          <Chip active={side === 'back'} onClick={() => setSide('back')}>{t('muscles.back')}</Chip>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="media-frame mx-auto h-[360px] w-[190px] shrink-0 p-2">
            <AnatomyMap
              view={side}
              interactive
              selectedRegion={region?.id ?? null}
              onSelect={setRegion}
              title={t('muscles.title')}
            />
          </div>
          <div className="flex-1">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide muted">{t('muscles.regions')}</p>
            <div className="flex flex-wrap gap-1.5">
              {regions.map((r) => (
                <Chip key={r.id} size="sm" active={region?.id === r.id} onClick={() => setRegion(r)}>
                  {t(`anatomy.${r.labelKey}`)}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {region && group ? (
        <>
          <SectionTitle>{t(`anatomy.${region.labelKey}`)}</SectionTitle>
          <Card>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="brand">{muscleLabel(group, i18n.language)}</Badge>
              <Badge tone="accent">{t('muscles.exerciseCount', { count: EXERCISES.filter((e) => e.primary.includes(group)).length })}</Badge>
            </div>
            <p className="mt-3 text-sm"><strong className="font-semibold">{t('muscles.function')}: </strong>{localized(MUSCLES[group].fn, i18n.language)}</p>
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 font-medium"><Clock className="h-3.5 w-3.5" aria-hidden />{t('muscles.recovery')}</span>
                <span className="muted">{t('muscles.recoveryHours', { count: MUSCLES[group].recoveryHours })}</span>
              </div>
              <Progress value={regionRecovery?.percent ?? 100} tone={(regionRecovery?.percent ?? 100) >= 90 ? 'accent' : 'warn'} label={t('muscles.recovery')} />
              <p className="mt-1.5 text-xs muted">
                {(regionRecovery?.percent ?? 100) >= 90 ? t('today.fresh') : t('today.recovering')}
                {trained.includes(group) ? ` · ${t('muscles.trainedRecently')}` : ''}
              </p>
            </div>
          </Card>

          <SectionTitle>{t('muscles.exercisesFor', { muscle: muscleLabel(group, i18n.language) })}</SectionTitle>
          <div className="mb-4">
            <ExerciseFilters state={filters} onChange={setFilters} favorites={favorites.length} />
          </div>
          <ExerciseList items={matching} />
        </>
      ) : (
        <Card className="mt-3"><p className="text-sm muted">{t('muscles.selectHint')}</p></Card>
      )}

      <div className="mt-6">
        <AdBanner placement="bannerLibrary" />
      </div>
    </Page>
  );
}

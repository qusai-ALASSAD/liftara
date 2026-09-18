import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import type { Difficulty, Equipment, MuscleGroup } from '@/types';
import { MUSCLE_GROUPS } from '@/types';
import { Card, Chip, Input } from '@/components/ui';
import { Page } from '@/components/Layout';
import { AdBanner } from '@/components/AdSlot';
import { ExerciseFilters, ExerciseList, filterExercises } from '@/components/ExerciseList';
import { EXERCISES } from '@/content/exercises';
import { muscleLabel } from '@/lib/titles';

export default function LibraryScreen() {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState('');
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty[]>([]);
  const [muscle, setMuscle] = useState<MuscleGroup | null>(null);

  const items = useMemo(() => {
    const base = muscle ? EXERCISES.filter((ex) => ex.primary.includes(muscle)) : EXERCISES;
    return filterExercises(base, { query, equipment, difficulty, locale: i18n.language });
  }, [muscle, query, equipment, difficulty, i18n.language]);

  return (
    <Page title={t('exercise.library')} subtitle={t('common.exercises', { count: EXERCISES.length })}>
      <Card className="mb-3">
        <label className="sr-only" htmlFor="ex-search">{t('exercise.searchPh')}</label>
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 shrink-0 muted" aria-hidden />
          <Input
            id="ex-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('exercise.searchPh')}
            className="border-0 bg-transparent px-0"
          />
        </div>
      </Card>

      <div className="mb-2 flex gap-1.5 overflow-x-auto pb-1" role="group" aria-label={t('common.muscles')}>
        <Chip active={muscle === null} onClick={() => setMuscle(null)}>{t('common.all')}</Chip>
        {MUSCLE_GROUPS.map((m) => (
          <Chip key={m} active={muscle === m} onClick={() => setMuscle(m)}>{muscleLabel(m, i18n.language)}</Chip>
        ))}
      </div>

      <div className="mb-4">
        <ExerciseFilters equipment={equipment} difficulty={difficulty} onEquipment={setEquipment} onDifficulty={setDifficulty} />
      </div>

      <ExerciseList items={items} />

      <div className="mt-6">
        <AdBanner placement="bannerLibrary" />
      </div>
    </Page>
  );
}

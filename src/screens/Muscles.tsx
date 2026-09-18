import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Library } from 'lucide-react';
import type { Difficulty, Equipment, MuscleGroup } from '@/types';
import { Card, Chip, SectionTitle } from '@/components/ui';
import { Page } from '@/components/Layout';
import { MuscleMap } from '@/components/MuscleMap';
import { ExerciseFilters, ExerciseList, filterExercises } from '@/components/ExerciseList';
import { AdBanner } from '@/components/AdSlot';
import { EXERCISES } from '@/content/exercises';
import { MUSCLES } from '@/content/muscles';
import { localized, muscleLabel } from '@/lib/titles';
import { useAppStore } from '@/store/appStore';
import { recoveryByMuscle } from '@/lib/recovery';

export default function MusclesScreen() {
  const { t, i18n } = useTranslation();
  const workouts = useAppStore((s) => s.workouts);
  const [side, setSide] = useState<'front' | 'back'>('front');
  const [selected, setSelected] = useState<MuscleGroup | null>('chest');
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty[]>([]);

  const trained = useMemo(
    () => recoveryByMuscle(workouts).filter((r) => r.percent < 90).map((r) => r.muscle),
    [workouts]
  );

  const matching = useMemo(() => {
    if (!selected) return [];
    const base = EXERCISES.filter((ex) => ex.primary.includes(selected) || ex.secondary.includes(selected));
    return filterExercises(base, { equipment, difficulty, locale: i18n.language });
  }, [selected, equipment, difficulty, i18n.language]);

  return (
    <Page
      title={t('muscles.title')}
      subtitle={t('muscles.subtitle')}
      action={
        <Link to="/library" className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold text-royal-600 hover:bg-sand-100 dark:text-royal-300 dark:hover:bg-navy-800">
          <Library className="h-4 w-4" aria-hidden />
          {t('exercise.library')}
        </Link>
      }
    >
      <div className="mb-3 flex gap-2">
        <Chip active={side === 'front'} onClick={() => setSide('front')}>{t('muscles.front')}</Chip>
        <Chip active={side === 'back'} onClick={() => setSide('back')}>{t('muscles.back')}</Chip>
      </div>

      <Card>
        <div className="mx-auto h-[320px] w-[210px]">
          <MuscleMap side={side} selected={selected} onSelect={setSelected} highlight={trained} />
        </div>
      </Card>

      {selected ? (
        <>
          <SectionTitle>{muscleLabel(selected, i18n.language)}</SectionTitle>
          <Card>
            <p className="text-sm"><strong className="font-semibold">{t('muscles.function')}: </strong>{localized(MUSCLES[selected].fn, i18n.language)}</p>
          </Card>

          <SectionTitle>{t('muscles.exercisesFor', { muscle: muscleLabel(selected, i18n.language) })}</SectionTitle>
          <div className="mb-3">
            <ExerciseFilters equipment={equipment} difficulty={difficulty} onEquipment={setEquipment} onDifficulty={setDifficulty} />
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

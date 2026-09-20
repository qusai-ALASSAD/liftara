import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button, Card, EmptyState, SectionTitle } from '@/components/ui';
import { Page } from '@/components/Layout';
import { ExerciseMedia, ExerciseMeta, ExerciseThumb, InstructionsBlock, exerciseName } from '@/components/ExerciseInfo';
import { FavoriteButton } from '@/components/ExerciseList';
import { EXERCISE_MAP, getExercise } from '@/content/exercises';
import { useSessionStore } from '@/store/sessionStore';
import { muscleLabel } from '@/lib/titles';

export default function ExerciseDetailScreen() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const activeWorkout = useSessionStore((s) => s.workout);
  const addExercise = useSessionStore((s) => s.addExercise);
  const ex = id ? getExercise(id) : undefined;

  if (!ex) {
    return (
      <Page title={t('errors.notFound')}>
        <EmptyState title={t('errors.notFound')} text={t('errors.notFoundText')} />
      </Page>
    );
  }

  const alternatives = ex.alternatives.map((a) => EXERCISE_MAP[a]).filter(Boolean);

  return (
    <Page
      title={exerciseName(ex, i18n.language)}
      subtitle={ex.primary.map((m) => muscleLabel(m, i18n.language)).join(' · ')}
      action={
        <div className="flex items-center gap-1">
          <FavoriteButton exerciseId={ex.id} />
          <Link to="/library" aria-label={t('common.back')} className="flex h-10 w-10 items-center justify-center rounded-xl text-ink-500 hover:text-brand-600">
            <ArrowLeft className="h-5 w-5 rtl:rotate-180" aria-hidden />
          </Link>
        </div>
      }
    >
      <Card>
        <ExerciseMedia ex={ex} className="h-60" />
        <div className="mt-4"><ExerciseMeta ex={ex} /></div>
        {activeWorkout && (
          <Button size="lg" className="mt-4 w-full" onClick={() => addExercise(ex.id)}>
            <Plus className="h-5 w-5" aria-hidden />{t('exercise.addToWorkout')}
          </Button>
        )}
      </Card>

      <SectionTitle>{t('exercise.howTo')}</SectionTitle>
      <Card><InstructionsBlock ex={ex} /></Card>

      {alternatives.length > 0 && (
        <>
          <SectionTitle>{t('exercise.alternatives')}</SectionTitle>
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {alternatives.map((alt) => (
              <li key={alt!.id}>
                <Link to={`/exercise/${alt!.id}`} className="card flex items-center gap-3 p-2.5">
                  <ExerciseThumb ex={alt!} className="h-14 w-20 shrink-0" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{exerciseName(alt!, i18n.language)}</span>
                    <span className="mt-0.5 block truncate text-xs muted">
                      {alt!.equipment.map((e) => t(`equip.${e}`)).join(', ')}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <p className="mt-6 text-xs muted">{t('disclaimer.text')}</p>
    </Page>
  );
}

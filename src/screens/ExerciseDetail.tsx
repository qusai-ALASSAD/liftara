import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button, Card, EmptyState, SectionTitle } from '@/components/ui';
import { Page } from '@/components/Layout';
import { ExerciseIllustration, ExerciseMeta, InstructionsBlock, exerciseName } from '@/components/ExerciseInfo';
import { EXERCISE_MAP, getExercise } from '@/content/exercises';
import { useSessionStore } from '@/store/sessionStore';

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
      action={
        <Link to="/library" className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold text-royal-600 dark:text-royal-300">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t('common.back')}
        </Link>
      }
    >
      <Card>
        <ExerciseIllustration ex={ex} className="h-40 w-full" />
        <div className="mt-3"><ExerciseMeta ex={ex} /></div>
        {activeWorkout && (
          <Button className="mt-4 w-full" onClick={() => addExercise(ex.id)}>
            <Plus className="h-4 w-4" aria-hidden />{t('exercise.addToWorkout')}
          </Button>
        )}
      </Card>

      <SectionTitle>{t('exercise.setup')}</SectionTitle>
      <Card><InstructionsBlock ex={ex} /></Card>

      {alternatives.length > 0 && (
        <>
          <SectionTitle>{t('exercise.alternatives')}</SectionTitle>
          <ul className="space-y-2">
            {alternatives.map((alt) => (
              <li key={alt!.id}>
                <Link to={`/exercise/${alt!.id}`} className="card flex items-center gap-3 p-3">
                  <div className="w-14 shrink-0 text-royal-700 dark:text-royal-200">
                    <ExerciseIllustration ex={alt!} className="h-10 w-full" />
                  </div>
                  <span className="min-w-0 flex-1 truncate font-medium">{exerciseName(alt!, i18n.language)}</span>
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

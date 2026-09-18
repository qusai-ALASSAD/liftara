import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import type { Difficulty, Equipment, Exercise } from '@/types';
import { EQUIPMENT } from '@/types';
import { Chip, EmptyState } from './ui';
import { ExerciseIllustration, exerciseName } from './ExerciseInfo';
import { useSessionStore } from '@/store/sessionStore';

const DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'advanced'];

export function ExerciseFilters({
  equipment, difficulty, onEquipment, onDifficulty
}: {
  equipment: Equipment[];
  difficulty: Difficulty[];
  onEquipment: (e: Equipment[]) => void;
  onDifficulty: (d: Difficulty[]) => void;
}) {
  const { t } = useTranslation();
  const toggle = <T,>(list: T[], v: T): T[] => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5" role="group" aria-label={t('common.equipment')}>
        {EQUIPMENT.map((e) => (
          <Chip key={e} active={equipment.includes(e)} onClick={() => onEquipment(toggle(equipment, e))}>{t(`equip.${e}`)}</Chip>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label={t('common.difficulty')}>
        {DIFFICULTIES.map((d) => (
          <Chip key={d} active={difficulty.includes(d)} onClick={() => onDifficulty(toggle(difficulty, d))}>{t(`diff.${d}`)}</Chip>
        ))}
      </div>
    </div>
  );
}

export function filterExercises(
  list: Exercise[],
  { query, equipment, difficulty, locale }: { query?: string; equipment: Equipment[]; difficulty: Difficulty[]; locale: string }
): Exercise[] {
  const q = (query ?? '').trim().toLowerCase();
  return list.filter((ex) => {
    if (equipment.length > 0 && !ex.equipment.some((e) => equipment.includes(e))) return false;
    if (difficulty.length > 0 && !difficulty.includes(ex.difficulty)) return false;
    if (q && !exerciseName(ex, locale).toLowerCase().includes(q) && !ex.name.en.toLowerCase().includes(q)) return false;
    return true;
  });
}

export function ExerciseList({ items }: { items: Exercise[] }) {
  const { t, i18n } = useTranslation();
  const activeWorkout = useSessionStore((s) => s.workout);
  const addExercise = useSessionStore((s) => s.addExercise);

  if (items.length === 0) return <EmptyState title={t('exercise.noResults')} />;

  return (
    <ul className="space-y-2">
      {items.map((ex) => (
        <li key={ex.id} className="card flex items-center gap-3 p-3">
          <div className="w-16 shrink-0 text-royal-700 dark:text-royal-200">
            <ExerciseIllustration ex={ex} className="h-12 w-full" />
          </div>
          <Link to={`/exercise/${ex.id}`} className="min-w-0 flex-1">
            <span className="block truncate font-medium">{exerciseName(ex, i18n.language)}</span>
            <span className="mt-0.5 block truncate text-xs muted">
              {ex.equipment.map((e) => t(`equip.${e}`)).join(', ')} · {t(`diff.${ex.difficulty}`)}
            </span>
          </Link>
          {activeWorkout && (
            <button
              type="button"
              aria-label={t('exercise.addToWorkout')}
              title={t('exercise.addToWorkout')}
              onClick={() => addExercise(ex.id)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-royal-600 text-white"
            >
              <Plus className="h-4 w-4" aria-hidden />
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

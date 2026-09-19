import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, Plus } from 'lucide-react';
import type { Difficulty, Equipment, Exercise, TrainingPlace } from '@/types';
import { EQUIPMENT } from '@/types';
import { Chip, EmptyState } from './ui';
import { ExerciseThumb, exerciseName } from './ExerciseInfo';
import { useSessionStore } from '@/store/sessionStore';
import { useAppStore } from '@/store/appStore';
import { muscleLabel } from '@/lib/titles';

const DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'advanced'];
const HOME_EQUIPMENT: Equipment[] = ['bodyweight', 'band', 'dumbbell', 'kettlebell'];

export const isHomeFriendly = (ex: Exercise) => ex.equipment.every((e) => HOME_EQUIPMENT.includes(e));

export interface ExerciseFilterState {
  query: string;
  equipment: Equipment[];
  difficulty: Difficulty[];
  place: TrainingPlace | null;
  onlyFavorites: boolean;
}

export const emptyFilters: ExerciseFilterState = {
  query: '', equipment: [], difficulty: [], place: null, onlyFavorites: false
};

export function ExerciseFilters({
  state, onChange, favorites = 0
}: { state: ExerciseFilterState; onChange: (s: ExerciseFilterState) => void; favorites?: number }) {
  const { t } = useTranslation();
  const toggle = <T,>(list: T[], v: T): T[] => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap gap-1.5" role="group" aria-label={t('common.equipment')}>
        {EQUIPMENT.map((e) => (
          <Chip key={e} size="sm" active={state.equipment.includes(e)} onClick={() => onChange({ ...state, equipment: toggle(state.equipment, e) })}>
            {t(`equip.${e}`)}
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {DIFFICULTIES.map((d) => (
          <Chip key={d} size="sm" active={state.difficulty.includes(d)} onClick={() => onChange({ ...state, difficulty: toggle(state.difficulty, d) })}>
            {t(`diff.${d}`)}
          </Chip>
        ))}
        <span className="mx-1 w-px bg-ink-200 dark:bg-ink-700" aria-hidden />
        {(['gym', 'home'] as TrainingPlace[]).map((p) => (
          <Chip key={p} size="sm" active={state.place === p} onClick={() => onChange({ ...state, place: state.place === p ? null : p })}>
            {t(`place.${p}`)}
          </Chip>
        ))}
        <Chip size="sm" active={state.onlyFavorites} onClick={() => onChange({ ...state, onlyFavorites: !state.onlyFavorites })}>
          <Heart className="h-3.5 w-3.5" aria-hidden />
          {t('exercise.favorites')}{favorites > 0 ? ` (${favorites})` : ''}
        </Chip>
      </div>
    </div>
  );
}

export function filterExercises(
  list: Exercise[],
  state: ExerciseFilterState & { locale: string; favorites?: string[] }
): Exercise[] {
  const q = state.query.trim().toLowerCase();
  return list.filter((ex) => {
    if (state.equipment.length > 0 && !ex.equipment.some((e) => state.equipment.includes(e))) return false;
    if (state.difficulty.length > 0 && !state.difficulty.includes(ex.difficulty)) return false;
    if (state.place === 'home' && !isHomeFriendly(ex)) return false;
    if (state.place === 'gym' && isHomeFriendly(ex) && !ex.equipment.some((e) => ['machine', 'cable', 'barbell', 'bench'].includes(e))) return false;
    if (state.onlyFavorites && !(state.favorites ?? []).includes(ex.id)) return false;
    if (q && !exerciseName(ex, state.locale).toLowerCase().includes(q) && !ex.name.en.toLowerCase().includes(q)) return false;
    return true;
  });
}

export function FavoriteButton({ exerciseId, className = '' }: { exerciseId: string; className?: string }) {
  const { t } = useTranslation();
  const favorites = useAppStore((s) => s.settings.favorites ?? []);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const active = favorites.includes(exerciseId);
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={t(active ? 'exercise.removeFavorite' : 'exercise.addFavorite')}
      title={t(active ? 'exercise.removeFavorite' : 'exercise.addFavorite')}
      onClick={(e) => { e.preventDefault(); toggleFavorite(exerciseId); }}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
        active ? 'tint text-brand-500' : 'text-ink-400 hover:text-brand-500'
      } ${className}`}
    >
      <Heart className="h-5 w-5" fill={active ? 'currentColor' : 'none'} aria-hidden />
    </button>
  );
}

export function ExerciseList({ items, columns = 1 }: { items: Exercise[]; columns?: 1 | 2 }) {
  const { t, i18n } = useTranslation();
  const activeWorkout = useSessionStore((s) => s.workout);
  const addExercise = useSessionStore((s) => s.addExercise);

  if (items.length === 0) return <EmptyState title={t('exercise.noResults')} />;

  return (
    <ul className={`grid gap-2.5 ${columns === 2 ? 'sm:grid-cols-2' : ''}`}>
      {items.map((ex) => (
        <li key={ex.id} className="card flex items-center gap-3 p-2.5">
          <ExerciseThumb ex={ex} className="h-16 w-24 shrink-0" />
          <Link to={`/exercise/${ex.id}`} className="min-w-0 flex-1">
            <span className="block truncate font-semibold">{exerciseName(ex, i18n.language)}</span>
            <span className="mt-0.5 block truncate text-xs font-medium text-brand-600 dark:text-brand-300">
              {ex.primary.map((m) => muscleLabel(m, i18n.language)).join(' · ')}
            </span>
            <span className="mt-0.5 block truncate text-xs muted">
              {ex.equipment.map((e) => t(`equip.${e}`)).join(', ')} · {t(`diff.${ex.difficulty}`)}
            </span>
          </Link>
          <FavoriteButton exerciseId={ex.id} />
          {activeWorkout && (
            <button
              type="button"
              aria-label={t('exercise.addToWorkout')}
              title={t('exercise.addToWorkout')}
              onClick={() => addExercise(ex.id)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white shadow-cta"
            >
              <Plus className="h-5 w-5" aria-hidden />
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

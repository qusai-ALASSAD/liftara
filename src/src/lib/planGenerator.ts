import type {
  Exercise, Equipment, MuscleGroup, PlannedExercise, PlannedWorkout, Profile, Workout
} from '@/types';
import { EXERCISES, EXERCISE_MAP } from '@/content/exercises';
import { exerciseHistory, initialWeight, suggestProgression } from './progression';
import { recentlyTrained } from './recovery';
import { weekdayIndex, startOfWeek } from './date';

export interface PlanInput {
  profile: Profile;
  workouts: Workout[];
  now?: number;
  /** Ruhetag ignorieren ("trotzdem trainieren") */
  force?: boolean;
}

export interface PlanResult {
  restDay: boolean;
  workout: PlannedWorkout;
}

const SPLITS: Record<number, MuscleGroup[][]> = {
  2: [['quads', 'chest', 'back'], ['hamstrings', 'back', 'shoulders']],
  3: [['chest', 'back', 'quads'], ['back', 'hamstrings', 'shoulders'], ['quads', 'glutes', 'core']],
  4: [['chest', 'back', 'triceps'], ['quads', 'glutes', 'calves'], ['back', 'shoulders', 'biceps'], ['hamstrings', 'glutes', 'core']],
  5: [['chest', 'shoulders', 'triceps'], ['back', 'biceps'], ['quads', 'hamstrings', 'glutes'], ['chest', 'shoulders', 'core'], ['back', 'biceps', 'forearms']],
  6: [['chest', 'shoulders', 'triceps'], ['back', 'biceps'], ['quads', 'hamstrings', 'glutes'], ['chest', 'shoulders', 'triceps'], ['back', 'biceps'], ['glutes', 'quads', 'calves']]
};

const ALWAYS_AVAILABLE: Equipment[] = ['bodyweight'];

export function availableEquipment(profile: Profile): Equipment[] {
  return [...new Set([...profile.equipment, ...ALWAYS_AVAILABLE])];
}

function allowedDifficulty(profile: Profile): Exercise['difficulty'][] {
  if (profile.experience === 'advanced') return ['beginner', 'intermediate', 'advanced'];
  if (profile.experience === 'intermediate') return ['beginner', 'intermediate'];
  return ['beginner'];
}

export function candidatePool(profile: Profile): Exercise[] {
  const equip = availableEquipment(profile);
  const diff = allowedDifficulty(profile);
  return EXERCISES.filter((ex) => {
    if (profile.avoidExerciseIds.includes(ex.id)) return false;
    if (!diff.includes(ex.difficulty)) return false;
    if (!ex.equipment.some((e) => equip.includes(e))) return false;
    if (ex.contraindications.some((c) => profile.restrictions.includes(c))) return false;
    return true;
  });
}

/** Deterministischer Score – gleiche Eingaben ergeben immer denselben Plan. */
function score(ex: Exercise, profile: Profile, muscle: MuscleGroup, index: number): number {
  let s = 0;
  if (ex.primary.includes(muscle)) s += 10;
  if (ex.isCompound) s += profile.goal === 'strength' ? 5 : 3;
  const beginnerish = profile.experience === 'beginner' || profile.experience === 'returning' || profile.returningAfterBreak;
  if (beginnerish) {
    if (ex.equipment.includes('machine')) s += 4;
    if (ex.equipment.includes('cable')) s += 2;
    if (ex.equipment.includes('barbell')) s -= 3;
    if (ex.difficulty === 'beginner') s += 3;
  } else if (ex.equipment.includes('barbell')) s += 1;
  if (profile.place === 'home' && ex.equipment.includes('bodyweight')) s += 3;
  // stabile, aber nicht immer identische Reihenfolge über Einheiten hinweg
  s -= ((ex.id.charCodeAt(0) + index) % 3) * 0.5;
  return s;
}

export function exerciseCountFor(profile: Profile): number {
  const byTime = Math.floor(profile.sessionMinutes / 10);
  let count = Math.max(4, Math.min(8, byTime));
  if (profile.returningAfterBreak || profile.experience === 'returning') count = Math.max(4, count - 1);
  return count;
}

function setsFor(ex: Exercise, profile: Profile): number {
  const beginnerish = profile.returningAfterBreak || profile.experience === 'returning' || profile.experience === 'beginner';
  if (beginnerish) return ex.isCompound ? 3 : 2;
  return ex.isCompound ? 4 : 3;
}

function repRangeFor(ex: Exercise, profile: Profile): [number, number] {
  if (ex.loadStep === 0 && !ex.isCompound) return [10, 20];
  if (profile.goal === 'strength' && ex.isCompound) return [5, 8];
  if (ex.isCompound) return [6, 10];
  return [10, 15];
}

const restFor = (ex: Exercise) => (ex.isCompound ? 150 : 75);

function warmupFor(ex: Exercise, profile: Profile): number {
  if (ex.loadStep === 0) return 0;
  if (!ex.isCompound) return 0;
  return profile.returningAfterBreak || profile.experience !== 'advanced' ? 2 : 1;
}

export function isTrainingDay(profile: Profile, now = Date.now()): boolean {
  if (profile.weekdays.length === 0) return true;
  return profile.weekdays.includes(weekdayIndex(now));
}

export function generatePlan({ profile, workouts, now = Date.now(), force = false }: PlanInput): PlanResult {
  const completed = workouts.filter((w) => w.status === 'completed');
  const doneThisWeek = completed.filter((w) => w.startedAt >= startOfWeek(now)).length;
  const restDay = !force && !isTrainingDay(profile, now) && doneThisWeek >= profile.daysPerWeek;

  const splits = SPLITS[Math.min(6, Math.max(2, profile.daysPerWeek))] ?? SPLITS[3]!;
  const fatigued = recentlyTrained(completed, 40, now);

  // Split wählen: Rotation, aber ermüdete Muskelgruppen möglichst überspringen.
  const base = completed.length % splits.length;
  let splitIndex = base;
  for (let i = 0; i < splits.length; i += 1) {
    const idx = (base + i) % splits.length;
    const overlap = splits[idx]!.filter((m) => fatigued.includes(m)).length;
    if (overlap === 0) { splitIndex = idx; break; }
    if (i === splits.length - 1) splitIndex = base;
  }
  const focus = splits[splitIndex]!;

  const pool = candidatePool(profile);
  const count = exerciseCountFor(profile);
  const picked: Exercise[] = [];
  let i = 0;
  while (picked.length < count && i < count * 4) {
    const muscle = focus[picked.length % focus.length]!;
    const next = pool
      .filter((ex) => !picked.some((p) => p.id === ex.id))
      .filter((ex) => ex.primary.includes(muscle))
      .sort((a, b) => score(b, profile, muscle, completed.length) - score(a, profile, muscle, completed.length))[0];
    if (next) picked.push(next);
    else {
      const filler = pool
        .filter((ex) => !picked.some((p) => p.id === ex.id) && focus.some((m) => ex.primary.includes(m) || ex.secondary.includes(m)))
        .sort((a, b) => score(b, profile, muscle, completed.length) - score(a, profile, muscle, completed.length))[0];
      if (!filler) break;
      picked.push(filler);
    }
    i += 1;
  }
  // Grundübungen zuerst
  picked.sort((a, b) => Number(b.isCompound) - Number(a.isCompound));

  const experienceFactor = profile.experience === 'advanced' ? 1.1 : profile.returningAfterBreak ? 0.55 : 0.75;

  const exercises: PlannedExercise[] = picked.map((ex) => {
    const repRange = repRangeFor(ex, profile);
    const history = exerciseHistory(completed, ex.id);
    const sug = suggestProgression(ex, repRange, history);
    const weight =
      sug.action === 'noData'
        ? initialWeight(ex.id, profile.weightKg, experienceFactor)
        : sug.action === 'increase' || sug.action === 'deload'
          ? sug.suggestedWeight
          : sug.currentWeight;
    return {
      exerciseId: ex.id,
      sets: setsFor(ex, profile),
      repRange,
      restSec: restFor(ex),
      warmupSets: warmupFor(ex, profile),
      suggestedWeight: weight,
      rirTarget: profile.experience === 'advanced' ? 1 : 2
    };
  });

  const rationale: PlannedWorkout['rationale'] = [];
  if (profile.returningAfterBreak || profile.experience === 'returning') rationale.push({ key: 'rationale.returning' });
  rationale.push({ key: 'rationale.days', values: { days: profile.daysPerWeek } });
  rationale.push({ key: 'rationale.duration', values: { minutes: profile.sessionMinutes } });
  rationale.push({ key: 'rationale.equipment' });
  if (fatigued.length > 0) rationale.push({ key: 'rationale.recovery', values: { muscles: fatigued.slice(0, 3).join(', ') } });
  if (profile.experience === 'beginner' || profile.experience === 'returning') rationale.push({ key: 'rationale.machines' });
  rationale.push({ key: 'rationale.compound' });
  if (profile.restrictions.length > 0) rationale.push({ key: 'rationale.restrictions', values: { areas: profile.restrictions.join(', ') } });
  if (completed.length > 0) rationale.push({ key: 'rationale.progression' });

  const estimatedMinutes = Math.round(
    exercises.reduce((m, e) => m + e.sets * (e.restSec + 45) / 60 + e.warmupSets * 1.2, 0)
  );

  return {
    restDay,
    workout: {
      id: `plan-${splitIndex}-${completed.length}`,
      titleKey: focus.map((f) => f).join('-'),
      focus,
      estimatedMinutes,
      exercises,
      rationale
    }
  };
}

/**
 * Baut einen Trainingsplan aus einer festen Übungsliste (Programmtag).
 * Gewichte kommen aus der Progressions-Engine bzw. aus konservativen Startwerten.
 */
export function planFromExercises(
  exerciseIds: string[],
  profile: Profile,
  workouts: Workout[],
  focus: MuscleGroup[],
  titleKey = 'program'
): PlannedWorkout {
  const completed = workouts.filter((w) => w.status === 'completed');
  const experienceFactor = profile.experience === 'advanced' ? 1.1 : profile.returningAfterBreak ? 0.55 : 0.75;
  const list = exerciseIds.map((id) => EXERCISE_MAP[id]).filter(Boolean) as Exercise[];

  const exercises: PlannedExercise[] = list.map((ex) => {
    const repRange = repRangeFor(ex, profile);
    const sug = suggestProgression(ex, repRange, exerciseHistory(completed, ex.id));
    const weight =
      sug.action === 'noData'
        ? initialWeight(ex.id, profile.weightKg, experienceFactor)
        : sug.action === 'increase' || sug.action === 'deload'
          ? sug.suggestedWeight
          : sug.currentWeight;
    return {
      exerciseId: ex.id,
      sets: setsFor(ex, profile),
      repRange,
      restSec: restFor(ex),
      warmupSets: warmupFor(ex, profile),
      suggestedWeight: weight,
      rirTarget: profile.experience === 'advanced' ? 1 : 2
    };
  });

  return {
    id: `program-${titleKey}`,
    titleKey,
    focus,
    estimatedMinutes: Math.round(exercises.reduce((m, e) => m + (e.sets * (e.restSec + 45)) / 60 + e.warmupSets * 1.2, 0)),
    exercises,
    rationale: [{ key: 'rationale.equipment' }, { key: 'rationale.compound' }]
  };
}

/** Alternativen für den Austausch einer Übung im laufenden Training. */
export function replacementOptions(exerciseId: string, profile: Profile, excludeIds: string[] = []): Exercise[] {
  const source = EXERCISE_MAP[exerciseId];
  if (!source) return [];
  const pool = candidatePool(profile).filter((e) => e.id !== exerciseId && !excludeIds.includes(e.id));
  const direct = source.alternatives.map((id) => pool.find((p) => p.id === id)).filter(Boolean) as Exercise[];
  const sameMuscle = pool.filter((e) => e.primary[0] === source.primary[0] && !direct.some((d) => d.id === e.id));
  return [...direct, ...sameMuscle].slice(0, 6);
}

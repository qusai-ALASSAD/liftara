import type { MuscleGroup, PersonalRecord, Workout } from '@/types';
import { EXERCISE_MAP } from '@/content/exercises';
import { DAY_MS, dayKey, startOfDay } from './date';

/** Epley-Formel – ausdrücklich eine Schätzung, kein Maximalversuch. */
export const estimate1RM = (weight: number, reps: number): number =>
  reps <= 0 || weight <= 0 ? 0 : Math.round(weight * (1 + reps / 30) * 10) / 10;

export const setVolume = (weight: number, reps: number) => weight * reps;

export function workoutVolume(w: Workout): number {
  return w.exercises.reduce(
    (sum, ex) => sum + ex.sets.filter((s) => s.done && !s.warmup).reduce((a, s) => a + setVolume(s.weight, s.reps), 0),
    0
  );
}

export function completedSetCount(w: Workout): number {
  return w.exercises.reduce((n, ex) => n + ex.sets.filter((s) => s.done && !s.warmup).length, 0);
}

export function workoutDurationMs(w: Workout): number {
  return Math.max(0, (w.finishedAt ?? Date.now()) - w.startedAt);
}

/** Sehr grobe Schätzung: MET-basiert, klar als Schätzung gekennzeichnet. */
export function estimateCalories(w: Workout, bodyWeightKg: number): number {
  const minutes = workoutDurationMs(w) / 60_000;
  const met = 5;
  return Math.round((met * 3.5 * (bodyWeightKg || 70) / 200) * minutes);
}

export function musclesTrained(w: Workout): MuscleGroup[] {
  const set = new Set<MuscleGroup>();
  for (const ex of w.exercises) {
    if (ex.skipped || !ex.sets.some((s) => s.done)) continue;
    EXERCISE_MAP[ex.exerciseId]?.primary.forEach((m) => set.add(m));
  }
  return [...set];
}

export function setsPerMuscle(workouts: Workout[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const w of workouts) {
    for (const ex of w.exercises) {
      const meta = EXERCISE_MAP[ex.exerciseId];
      if (!meta) continue;
      const done = ex.sets.filter((s) => s.done && !s.warmup).length;
      if (!done) continue;
      for (const m of meta.primary) out[m] = (out[m] ?? 0) + done;
      for (const m of meta.secondary) out[m] = (out[m] ?? 0) + done * 0.5;
    }
  }
  return out;
}

/** Streak = aufeinanderfolgende Kalendertage mit abgeschlossenem Training (heute oder gestern als Start). */
export function currentStreak(workouts: Workout[], now = Date.now()): number {
  const days = new Set(workouts.filter((w) => w.status === 'completed').map((w) => dayKey(w.startedAt)));
  if (days.size === 0) return 0;
  let cursor = startOfDay(now);
  if (!days.has(dayKey(cursor))) {
    cursor -= DAY_MS;
    if (!days.has(dayKey(cursor))) return 0;
  }
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor -= DAY_MS;
  }
  return streak;
}

export function longestStreak(workouts: Workout[]): number {
  const days = [...new Set(workouts.filter((w) => w.status === 'completed').map((w) => startOfDay(w.startedAt)))].sort((a, b) => a - b);
  let best = 0;
  let run = 0;
  let prev = 0;
  for (const d of days) {
    run = prev && d - prev === DAY_MS ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  }
  return best;
}

export function weeklyWorkoutCount(workouts: Workout[], weekStart: number): number {
  return workouts.filter((w) => w.status === 'completed' && w.startedAt >= weekStart && w.startedAt < weekStart + 7 * DAY_MS).length;
}

/** Ermittelt neue persönliche Rekorde eines Workouts gegen die bisherige Bestenliste. */
export function findNewRecords(w: Workout, existing: PersonalRecord[]): PersonalRecord[] {
  const best = new Map<string, number>();
  for (const r of existing) best.set(r.exerciseId, Math.max(best.get(r.exerciseId) ?? 0, r.estimated1RM));
  const out: PersonalRecord[] = [];
  for (const ex of w.exercises) {
    let topSet: { weight: number; reps: number; e1rm: number } | null = null;
    for (const s of ex.sets) {
      if (!s.done || s.warmup || s.weight <= 0) continue;
      const e = estimate1RM(s.weight, s.reps);
      if (!topSet || e > topSet.e1rm) topSet = { weight: s.weight, reps: s.reps, e1rm: e };
    }
    if (!topSet) continue;
    if (topSet.e1rm > (best.get(ex.exerciseId) ?? 0)) {
      best.set(ex.exerciseId, topSet.e1rm);
      out.push({
        id: `${w.id}:${ex.exerciseId}`,
        exerciseId: ex.exerciseId,
        date: w.finishedAt ?? w.startedAt,
        weight: topSet.weight,
        reps: topSet.reps,
        estimated1RM: topSet.e1rm,
        volume: setVolume(topSet.weight, topSet.reps)
      });
    }
  }
  return out;
}

export interface GoalProgress { start: number; current: number; goal: number; percent: number; remaining: number; reached: boolean }

export function goalWeightProgress(startKg: number, currentKg: number, goalKg: number): GoalProgress {
  const total = Math.abs(goalKg - startKg);
  const done = Math.abs(currentKg - startKg);
  const gaining = goalKg > startKg;
  const wrongDirection = gaining ? currentKg < startKg : currentKg > startKg;
  const percent = total === 0 ? 100 : Math.max(0, Math.min(100, Math.round((wrongDirection ? 0 : done / total) * 100)));
  const remaining = Math.round(Math.abs(goalKg - currentKg) * 10) / 10;
  const reached = gaining ? currentKg >= goalKg : currentKg <= goalKg;
  return { start: startKg, current: currentKg, goal: goalKg, percent: reached ? 100 : percent, remaining: reached ? 0 : remaining, reached };
}

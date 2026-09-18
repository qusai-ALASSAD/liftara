import type { MuscleGroup, Workout } from '@/types';
import { EXERCISE_MAP } from '@/content/exercises';
import { MUSCLES } from '@/content/muscles';
import { hoursSince } from './date';

export interface RecoveryState { muscle: MuscleGroup; percent: number; lastTrained?: number }

/** 0 % = gerade trainiert, 100 % = vollständig erholt (lineare Annäherung). */
export function recoveryByMuscle(workouts: Workout[], now = Date.now()): RecoveryState[] {
  const last = new Map<MuscleGroup, number>();
  for (const w of workouts) {
    if (w.status !== 'completed') continue;
    for (const ex of w.exercises) {
      const meta = EXERCISE_MAP[ex.exerciseId];
      if (!meta || !ex.sets.some((s) => s.done && !s.warmup)) continue;
      const t = w.finishedAt ?? w.startedAt;
      for (const m of meta.primary) last.set(m, Math.max(last.get(m) ?? 0, t));
    }
  }
  return (Object.keys(MUSCLES) as MuscleGroup[]).map((m) => {
    const t = last.get(m);
    if (!t) return { muscle: m, percent: 100 };
    const pct = Math.min(100, Math.round((hoursSince(t, now) / MUSCLES[m].recoveryHours) * 100));
    return { muscle: m, percent: pct, lastTrained: t };
  });
}

export function recentlyTrained(workouts: Workout[], withinHours = 40, now = Date.now()): MuscleGroup[] {
  return recoveryByMuscle(workouts, now)
    .filter((r) => r.lastTrained !== undefined && hoursSince(r.lastTrained, now) < withinHours)
    .map((r) => r.muscle);
}

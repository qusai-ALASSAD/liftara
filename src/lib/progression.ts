import type { Exercise, MuscleGroup, SetLog, Workout } from '@/types';
import { EXERCISE_MAP } from '@/content/exercises';
import { round } from './units';

const LOWER: MuscleGroup[] = ['quads', 'hamstrings', 'glutes', 'calves'];

export const isLowerBody = (ex: Exercise) => ex.primary.some((m) => LOWER.includes(m));

/** Kleine Schritte oben, etwas größere unten – wie im Trainingsalltag üblich. */
export function incrementFor(ex: Exercise): number {
  if (ex.loadStep === 0) return 0;
  const factor = isLowerBody(ex) ? 2 : 1;
  return round(ex.loadStep * factor, 0.5);
}

export type ProgressionAction = 'increase' | 'hold' | 'deload' | 'noData';

export interface ProgressionSuggestion {
  action: ProgressionAction;
  currentWeight: number;
  suggestedWeight: number;
  increment: number;
  /** Vorschlag, niemals automatisch angewendet. */
  requiresConfirmation: boolean;
}

export interface SessionPerformance { weight: number; sets: SetLog[] }

/**
 * Doppelte Progression:
 * - alle Arbeitssätze am oberen Ende des Wiederholungsbereichs und RIR >= 1 → Gewicht leicht erhöhen
 * - zwei Sessions in Folge unter dem unteren Ende → Last reduzieren
 * - sonst Gewicht halten
 */
export function suggestProgression(
  exercise: Exercise,
  repRange: [number, number],
  history: SessionPerformance[]
): ProgressionSuggestion {
  const working = (p: SessionPerformance) => p.sets.filter((s) => s.done && !s.warmup);
  const sessions = history.filter((h) => working(h).length > 0);
  if (sessions.length === 0) {
    return { action: 'noData', currentWeight: 0, suggestedWeight: 0, increment: incrementFor(exercise), requiresConfirmation: false };
  }
  const last = sessions[0]!;
  const lastSets = working(last);
  const weight = last.weight || Math.max(...lastSets.map((s) => s.weight), 0);
  const inc = incrementFor(exercise);

  const hitTop = lastSets.every((s) => s.reps >= repRange[1]);
  const effortOk = lastSets.every((s) => s.rir === undefined || s.rir >= 1);
  if (hitTop && effortOk && inc > 0) {
    return { action: 'increase', currentWeight: weight, suggestedWeight: round(weight + inc, 0.5), increment: inc, requiresConfirmation: true };
  }

  const failed = (p: SessionPerformance) => {
    const s = working(p);
    return s.length > 0 && s.filter((x) => x.reps < repRange[0]).length >= Math.ceil(s.length / 2);
  };
  if (sessions.length >= 2 && failed(sessions[0]!) && failed(sessions[1]!)) {
    const reduced = round(Math.max(0, weight * 0.9), 0.5);
    return { action: 'deload', currentWeight: weight, suggestedWeight: reduced, increment: inc, requiresConfirmation: true };
  }
  return { action: 'hold', currentWeight: weight, suggestedWeight: weight, increment: inc, requiresConfirmation: false };
}

/** Historie einer Übung aus abgeschlossenen Workouts (neueste zuerst). */
export function exerciseHistory(workouts: Workout[], exerciseId: string, limit = 5): SessionPerformance[] {
  return workouts
    .filter((w) => w.status === 'completed')
    .sort((a, b) => b.startedAt - a.startedAt)
    .flatMap((w) => {
      const ex = w.exercises.find((e) => e.exerciseId === exerciseId);
      if (!ex) return [];
      const done = ex.sets.filter((s) => s.done && !s.warmup);
      if (done.length === 0) return [];
      return [{ weight: Math.max(...done.map((s) => s.weight)), sets: done }];
    })
    .slice(0, limit);
}

/** Startgewicht für Nutzer ohne Historie: bewusst konservativ. */
export function initialWeight(exerciseId: string, bodyWeightKg: number, experienceFactor: number): number {
  const ex = EXERCISE_MAP[exerciseId];
  if (!ex || ex.loadStep === 0) return 0;
  const base: Record<string, number> = {
    horizontalPress: 0.35, inclinePress: 0.3, verticalPress: 0.22, horizontalPull: 0.35, verticalPull: 0.4,
    squat: 0.45, hinge: 0.4, lunge: 0.15, curl: 0.12, triceps: 0.15, lateralRaise: 0.05, rearDelt: 0.05,
    calf: 0.35, coreBrace: 0, coreFlexion: 0.1, hipAbduction: 0.25, forearm: 0.06, carryFullBody: 0.25
  };
  const raw = (base[ex.pattern] ?? 0.2) * (bodyWeightKg || 70) * experienceFactor;
  return Math.max(ex.loadStep, round(raw, ex.loadStep));
}

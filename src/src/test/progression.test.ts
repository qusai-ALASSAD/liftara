import { describe, expect, it } from 'vitest';
import type { SetLog, Workout } from '@/types';
import { EXERCISE_MAP } from '@/content/exercises';
import { exerciseHistory, incrementFor, initialWeight, suggestProgression } from '@/lib/progression';
import {
  completedSetCount, currentStreak, estimate1RM, findNewRecords, goalWeightProgress,
  longestStreak, musclesTrained, weeklyWorkoutCount, workoutVolume
} from '@/lib/stats';
import { DAY_MS, startOfDay, startOfWeek } from '@/lib/date';

const bench = EXERCISE_MAP['bench-press-dumbbell'] ?? EXERCISE_MAP['chest-press-machine']!;
const set = (weight: number, reps: number, extra: Partial<SetLog> = {}): SetLog => ({
  id: `s-${Math.random()}`, weight, reps, done: true, warmup: false, ...extra
});

const workoutAt = (ts: number, exerciseId: string, sets: SetLog[]): Workout => ({
  id: `w-${ts}`,
  startedAt: ts,
  finishedAt: ts + 45 * 60_000,
  status: 'completed',
  title: { de: 'Test', en: 'Test', ar: 'اختبار' },
  focus: ['chest'],
  exercises: [{ exerciseId, plannedSets: sets.length, repRange: [8, 12], restSec: 90, sets }]
});

describe('Progressions-Engine', () => {
  it('meldet ohne Historie noData', () => {
    const s = suggestProgression(bench, [8, 12], []);
    expect(s.action).toBe('noData');
    expect(s.requiresConfirmation).toBe(false);
  });

  it('schlägt eine Steigerung vor, wenn alle Sätze das obere Ende erreichen', () => {
    const s = suggestProgression(bench, [8, 12], [{ weight: 20, sets: [set(20, 12, { rir: 2 }), set(20, 12, { rir: 1 })] }]);
    expect(s.action).toBe('increase');
    expect(s.suggestedWeight).toBeGreaterThan(s.currentWeight);
    expect(s.requiresConfirmation).toBe(true);
  });

  it('hält das Gewicht, wenn das obere Ende nicht erreicht wurde', () => {
    const s = suggestProgression(bench, [8, 12], [{ weight: 20, sets: [set(20, 10), set(20, 9)] }]);
    expect(s.action).toBe('hold');
    expect(s.suggestedWeight).toBe(20);
  });

  it('schlägt nach zwei schwachen Einheiten ein Deload vor', () => {
    const weak = { weight: 30, sets: [set(30, 5), set(30, 4)] };
    const s = suggestProgression(bench, [8, 12], [weak, weak]);
    expect(s.action).toBe('deload');
    expect(s.suggestedWeight).toBeLessThan(30);
  });

  it('nutzt für Unterkörperübungen den größeren Schritt', () => {
    const legPress = EXERCISE_MAP['leg-press']!;
    expect(incrementFor(legPress)).toBeGreaterThanOrEqual(incrementFor(bench));
  });

  it('ändert niemals bereits protokollierte Gewichte', () => {
    const history = [{ weight: 20, sets: [set(20, 12), set(20, 12)] }];
    const before = JSON.stringify(history);
    suggestProgression(bench, [8, 12], history);
    expect(JSON.stringify(history)).toBe(before);
  });

  it('liest die Historie neueste Einheit zuerst', () => {
    const older = workoutAt(Date.now() - 3 * DAY_MS, bench.id, [set(20, 10)]);
    const newer = workoutAt(Date.now() - DAY_MS, bench.id, [set(25, 10)]);
    const history = exerciseHistory([older, newer], bench.id);
    expect(history[0]!.weight).toBe(25);
  });

  it('berechnet konservative Startgewichte', () => {
    const w = initialWeight(bench.id, 62, 0.55);
    expect(w).toBeGreaterThan(0);
    expect(w).toBeLessThan(62);
  });
});

describe('Streaks und Statistik', () => {
  it('zählt aufeinanderfolgende Trainingstage', () => {
    const now = startOfDay(Date.now()) + 10 * 3_600_000;
    const workouts = [0, 1, 2].map((i) => workoutAt(startOfDay(now) - i * DAY_MS + 3_600_000, bench.id, [set(20, 10)]));
    expect(currentStreak(workouts, now)).toBe(3);
  });

  it('bricht die Serie bei einer Lücke ab', () => {
    const now = startOfDay(Date.now()) + 10 * 3_600_000;
    const workouts = [0, 3, 4].map((i) => workoutAt(startOfDay(now) - i * DAY_MS + 3_600_000, bench.id, [set(20, 10)]));
    expect(currentStreak(workouts, now)).toBe(1);
    expect(longestStreak(workouts)).toBe(2);
  });

  it('zählt Einheiten der laufenden Woche', () => {
    const now = Date.now();
    const weekStart = startOfWeek(now);
    const workouts = [workoutAt(weekStart + 3_600_000, bench.id, [set(20, 10)]), workoutAt(weekStart - 3 * DAY_MS, bench.id, [set(20, 10)])];
    expect(weeklyWorkoutCount(workouts, weekStart)).toBe(1);
  });

  it('rechnet Volumen und Sätze nur aus erledigten Arbeitssätzen', () => {
    const w = workoutAt(Date.now(), bench.id, [
      set(20, 10),
      set(20, 10, { done: false }),
      set(10, 10, { warmup: true })
    ]);
    expect(workoutVolume(w)).toBe(200);
    expect(completedSetCount(w)).toBe(1);
    expect(musclesTrained(w).length).toBeGreaterThan(0);
  });

  it('schätzt 1RM nach Epley', () => {
    expect(estimate1RM(100, 0)).toBe(0);
    expect(estimate1RM(100, 10)).toBeCloseTo(133.3, 1);
  });

  it('findet neue persönliche Rekorde gegen die Bestenliste', () => {
    const w = workoutAt(Date.now(), bench.id, [set(30, 8)]);
    const first = findNewRecords(w, []);
    expect(first).toHaveLength(1);
    expect(findNewRecords(w, first)).toHaveLength(0);
  });
});

describe('Zielgewicht', () => {
  it('rechnet den Fortschritt beim Aufbau', () => {
    const p = goalWeightProgress(62, 66.5, 71);
    expect(p.percent).toBe(50);
    expect(p.remaining).toBe(4.5);
    expect(p.reached).toBe(false);
  });

  it('erkennt das erreichte Ziel', () => {
    const p = goalWeightProgress(62, 71.4, 71);
    expect(p.reached).toBe(true);
    expect(p.percent).toBe(100);
    expect(p.remaining).toBe(0);
  });

  it('rechnet auch beim Abnehmen korrekt', () => {
    const p = goalWeightProgress(90, 85, 80);
    expect(p.percent).toBe(50);
    expect(p.reached).toBe(false);
  });

  it('bleibt bei falscher Richtung bei 0 Prozent', () => {
    const p = goalWeightProgress(62, 60, 71);
    expect(p.percent).toBe(0);
  });
});

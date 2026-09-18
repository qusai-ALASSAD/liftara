import { describe, expect, it } from 'vitest';
import type { Profile } from '@/types';
import { demoProfile } from '@/content/demoProfile';
import { EXERCISE_MAP } from '@/content/exercises';
import { candidatePool, exerciseCountFor, generatePlan, isTrainingDay, planFromExercises } from '@/lib/planGenerator';

const profileWith = (patch: Partial<Profile>): Profile => ({ ...demoProfile('de'), ...patch });

describe('Plan-Generator', () => {
  it('erzeugt 4 bis 8 Übungen und ist deterministisch', () => {
    const profile = demoProfile('de');
    const a = generatePlan({ profile, workouts: [], now: Date.UTC(2025, 0, 6) });
    const b = generatePlan({ profile, workouts: [], now: Date.UTC(2025, 0, 6) });

    expect(a.workout.exercises.length).toBeGreaterThanOrEqual(4);
    expect(a.workout.exercises.length).toBeLessThanOrEqual(8);
    expect(a.workout.exercises.map((e) => e.exerciseId)).toEqual(b.workout.exercises.map((e) => e.exerciseId));
  });

  it('nutzt nur Übungen, die zum verfügbaren Equipment passen', () => {
    const profile = profileWith({ place: 'home', equipment: ['bodyweight', 'band'] });
    const plan = generatePlan({ profile, workouts: [] });
    for (const e of plan.workout.exercises) {
      const ex = EXERCISE_MAP[e.exerciseId]!;
      expect(ex.equipment.some((eq) => ['bodyweight', 'band'].includes(eq))).toBe(true);
    }
  });

  it('entfernt Übungen mit passender Kontraindikation und Übungen der Sperrliste', () => {
    const profile = profileWith({ restrictions: ['kneePain'], avoidExerciseIds: ['leg-press'] });
    const pool = candidatePool(profile);
    expect(pool.some((e) => e.id === 'leg-press')).toBe(false);
    expect(pool.every((e) => !e.contraindications.includes('kneePain'))).toBe(true);
  });

  it('liefert eine nachvollziehbare Begründung als i18n-Keys', () => {
    const plan = generatePlan({ profile: demoProfile('de'), workouts: [] });
    expect(plan.workout.rationale.length).toBeGreaterThan(2);
    expect(plan.workout.rationale.every((r) => r.key.startsWith('rationale.'))).toBe(true);
  });

  it('kennzeichnet Trainingstage anhand der gewählten Wochentage', () => {
    const profile = profileWith({ weekdays: [0] }); // nur Montag
    expect(isTrainingDay(profile, Date.UTC(2025, 0, 6, 12))).toBe(true); // Montag
    expect(isTrainingDay(profile, Date.UTC(2025, 0, 7, 12))).toBe(false); // Dienstag
  });

  it('baut aus einem Programmtag einen vollständigen Plan', () => {
    const plan = planFromExercises(['leg-press', 'lat-pulldown'], demoProfile('de'), [], ['quads', 'back']);
    expect(plan.exercises).toHaveLength(2);
    expect(plan.exercises[0]!.sets).toBeGreaterThan(0);
    expect(plan.estimatedMinutes).toBeGreaterThan(0);
  });
});

describe('Wiedereinstieg nach Pause', () => {
  it('reduziert die Anzahl der Übungen gegenüber Fortgeschrittenen', () => {
    const returning = profileWith({ experience: 'returning', returningAfterBreak: true, sessionMinutes: 60 });
    const advanced = profileWith({ experience: 'advanced', returningAfterBreak: false, sessionMinutes: 60 });
    expect(exerciseCountFor(returning)).toBeLessThan(exerciseCountFor(advanced));
  });

  it('reduziert das Satzvolumen im generierten Plan', () => {
    const returning = profileWith({ experience: 'returning', returningAfterBreak: true });
    const advanced = profileWith({ experience: 'advanced', returningAfterBreak: false });
    const sets = (p: Profile) =>
      generatePlan({ profile: p, workouts: [] }).workout.exercises.reduce((s, e) => s + e.sets, 0);
    expect(sets(returning)).toBeLessThan(sets(advanced));
  });

  it('startet mit konservativeren Gewichten als Fortgeschrittene', () => {
    const returning = generatePlan({ profile: profileWith({ experience: 'returning', returningAfterBreak: true }), workouts: [] });
    const advanced = generatePlan({ profile: profileWith({ experience: 'advanced', returningAfterBreak: false }), workouts: [] });
    const first = (plan: typeof returning) => plan.workout.exercises.find((e) => (e.suggestedWeight ?? 0) > 0);
    expect(first(returning)!.suggestedWeight!).toBeLessThan(first(advanced)!.suggestedWeight! * 1.5);
  });

  it('begründet die Reduktion im Plan', () => {
    const plan = generatePlan({ profile: profileWith({ returningAfterBreak: true }), workouts: [] });
    expect(plan.workout.rationale.some((r) => r.key === 'rationale.returning')).toBe(true);
  });
});

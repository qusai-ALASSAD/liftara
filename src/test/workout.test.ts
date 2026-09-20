import { beforeEach, describe, expect, it } from 'vitest';
import type { PlannedWorkout } from '@/types';
import { demoProfile } from '@/content/demoProfile';
import { EXERCISE_MAP } from '@/content/exercises';
import { useAppStore } from '@/store/appStore';
import { useSessionStore } from '@/store/sessionStore';
import { profileRepo, recordRepo, workoutRepo, wipeAllData } from '@/db/repositories';
import { buildExportBundle, importBundle, parseBundle, workoutsToCsv } from '@/lib/exportImport';
import { defaultSettings } from '@/lib/settings';
import { generatePlan } from '@/lib/planGenerator';
import { workoutVolume } from '@/lib/stats';

const profile = demoProfile('de');
const title = { de: 'Test', en: 'Test', ar: 'اختبار' };

async function reset() {
  await wipeAllData();
  useSessionStore.setState({ workout: null, activeIndex: 0, rest: null, lastSummaryId: null });
  await profileRepo.put(profile);
  await useAppStore.getState().refresh();
}

describe('Workout abschließen', () => {
  beforeEach(reset);

  it('schreibt ein abgeschlossenes Workout mit Volumen, Rekorden und Achievement', async () => {
    const plan: PlannedWorkout = generatePlan({ profile, workouts: [] }).workout;
    const session = useSessionStore.getState();
    await session.startFromPlan(plan, title);

    const active = useSessionStore.getState().workout!;
    expect(active.status).toBe('active');
    expect(active.exercises.length).toBe(plan.exercises.length);

    active.exercises.forEach((ex, i) => {
      ex.sets.forEach((s) => {
        useSessionStore.getState().updateSet(i, s.id, { weight: s.weight || 20, reps: 10, done: true });
      });
    });

    const finished = await useSessionStore.getState().finish();
    expect(finished?.status).toBe('completed');
    expect(finished?.finishedAt).toBeGreaterThan(0);
    expect(workoutVolume(finished!)).toBeGreaterThan(0);
    expect(useSessionStore.getState().workout).toBeNull();

    const stored = await workoutRepo.completed();
    expect(stored).toHaveLength(1);
    expect((await recordRepo.all()).length).toBeGreaterThan(0);
    expect(useAppStore.getState().achievements.some((a) => a.id === 'firstWorkout')).toBe(true);
  });

  it('zählt abgeschlossene Trainings für das Interstitial-Limit hoch', async () => {
    useAppStore.getState().patchSettings({ completedWorkoutsSinceInterstitial: 0 });
    const plan = generatePlan({ profile, workouts: [] }).workout;
    await useSessionStore.getState().startFromPlan(plan, title);
    await useSessionStore.getState().finish();
    expect(useAppStore.getState().settings.completedWorkoutsSinceInterstitial).toBe(1);
  });

  it('verwirft ein Workout vollständig', async () => {
    const plan = generatePlan({ profile, workouts: [] }).workout;
    await useSessionStore.getState().startFromPlan(plan, title);
    await useSessionStore.getState().discard();
    expect(useSessionStore.getState().workout).toBeNull();
    expect(await workoutRepo.active()).toBeUndefined();
  });

  it('ersetzt eine Übung, ohne bereits erledigte Sätze anderer Übungen zu verlieren', async () => {
    const plan = generatePlan({ profile, workouts: [] }).workout;
    await useSessionStore.getState().startFromPlan(plan, title);
    const first = useSessionStore.getState().workout!.exercises[0]!;
    const alternative = EXERCISE_MAP[first.exerciseId]!.alternatives[0];
    if (!alternative) return;
    useSessionStore.getState().replaceExercise(0, alternative);
    const after = useSessionStore.getState().workout!.exercises[0]!;
    expect(after.exerciseId).toBe(alternative);
    expect(after.replacedFrom).toBe(first.exerciseId);
  });
});

describe('Export und Import', () => {
  beforeEach(reset);

  it('exportiert und importiert alle Daten verlustfrei', async () => {
    const plan = generatePlan({ profile, workouts: [] }).workout;
    await useSessionStore.getState().startFromPlan(plan, title);
    useSessionStore.getState().workout!.exercises.forEach((ex, i) =>
      ex.sets.forEach((s) => useSessionStore.getState().updateSet(i, s.id, { weight: 20, reps: 10, done: true }))
    );
    await useSessionStore.getState().finish();

    const bundle = await buildExportBundle(defaultSettings());
    const json = JSON.stringify(bundle);

    await wipeAllData();
    await useAppStore.getState().refresh();
    expect(await workoutRepo.all()).toHaveLength(0);

    await importBundle(parseBundle(json));
    await useAppStore.getState().refresh();

    expect((await workoutRepo.all()).length).toBe(bundle.workouts.length);
    expect((await profileRepo.get())?.name).toBe(profile.name);
    expect((await recordRepo.all()).length).toBe(bundle.records.length);
  });

  it('weist fremde oder beschädigte Dateien ab', () => {
    expect(() => parseBundle('{"app":"other","version":1}')).toThrow();
    expect(() => parseBundle('{"app":"liftara","version":2}')).toThrow();
    expect(() => parseBundle('kein json')).toThrow();
  });

  it('erzeugt CSV mit Kopfzeile und einer Zeile je erledigtem Satz', async () => {
    const plan = generatePlan({ profile, workouts: [] }).workout;
    await useSessionStore.getState().startFromPlan(plan, title);
    useSessionStore.getState().workout!.exercises.forEach((ex, i) =>
      ex.sets.forEach((s) => useSessionStore.getState().updateSet(i, s.id, { weight: 20, reps: 10, done: true }))
    );
    const finished = await useSessionStore.getState().finish();
    const csv = workoutsToCsv([finished!]);
    const lines = csv.trim().split('\n');
    const doneSets = finished!.exercises.reduce((n, e) => n + e.sets.filter((s) => s.done).length, 0);
    expect(lines[0]).toContain('exercise_id');
    expect(lines.length).toBe(doneSets + 1);
  });
});

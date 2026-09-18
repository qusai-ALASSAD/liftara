import { create } from 'zustand';
import type { LocalizedText, PlannedWorkout, SetLog, Workout } from '@/types';
import { EXERCISE_MAP } from '@/content/exercises';
import { workoutRepo, recordRepo, achievementRepo, programStateRepo } from '@/db/repositories';
import { getProgram } from '@/content/programs';
import { uid } from '@/lib/id';
import { findNewRecords, workoutVolume } from '@/lib/stats';
import { evaluateAchievements } from '@/lib/achievements';
import { useAppStore } from './appStore';

interface RestTimer { exerciseId: string; endsAt: number; total: number }

interface SessionState {
  workout: Workout | null;
  activeIndex: number;
  rest: RestTimer | null;
  lastSummaryId: string | null;
  startFromPlan: (plan: PlannedWorkout, title: LocalizedText, programId?: string) => Promise<void>;
  resume: (w: Workout) => void;
  setActiveIndex: (i: number) => void;
  updateSet: (exerciseIndex: number, setId: string, patch: Partial<SetLog>) => void;
  addSet: (exerciseIndex: number) => void;
  addExercise: (exerciseId: string) => void;
  removeSet: (exerciseIndex: number, setId: string) => void;
  toggleDone: (exerciseIndex: number, setId: string) => void;
  applySuggestedWeight: (exerciseIndex: number, weight: number) => void;
  setExerciseNotes: (exerciseIndex: number, notes: string) => void;
  skipExercise: (exerciseIndex: number) => void;
  replaceExercise: (exerciseIndex: number, newExerciseId: string) => void;
  startRest: (exerciseId: string, seconds: number) => void;
  stopRest: () => void;
  setFeedback: (f: Workout['difficultyFeedback']) => void;
  setNotes: (n: string) => void;
  finish: () => Promise<Workout | null>;
  discard: () => Promise<void>;
}

const buildSets = (plannedSets: number, warmup: number, weight: number, reps: number): SetLog[] => [
  ...Array.from({ length: warmup }, () => ({
    id: uid('set'), weight: Math.round(weight * 0.5 * 2) / 2, reps: Math.max(5, Math.round(reps * 0.6)), done: false, warmup: true
  })),
  ...Array.from({ length: plannedSets }, () => ({ id: uid('set'), weight, reps, done: false, warmup: false }))
];

async function persist(w: Workout | null) {
  if (w) await workoutRepo.put(w);
  await useAppStore.getState().refresh();
}

export const useSessionStore = create<SessionState>((set, get) => {
  const mutate = (fn: (w: Workout) => Workout) => {
    const current = get().workout;
    if (!current) return;
    const next = fn(structuredClone(current));
    set({ workout: next });
    void persist(next);
  };

  return {
    workout: null,
    activeIndex: 0,
    rest: null,
    lastSummaryId: null,

    startFromPlan: async (plan, title, programId) => {
      const workout: Workout = {
        id: uid('workout'),
        startedAt: Date.now(),
        status: 'active',
        title,
        focus: plan.focus,
        programId,
        bodyweightAtTime: useAppStore.getState().profile?.weightKg,
        exercises: plan.exercises.map((p) => ({
          exerciseId: p.exerciseId,
          plannedSets: p.sets,
          repRange: p.repRange,
          restSec: p.restSec,
          suggestedWeight: p.suggestedWeight,
          sets: buildSets(p.sets, p.warmupSets, p.suggestedWeight ?? 0, p.repRange[1])
        }))
      };
      set({ workout, activeIndex: 0, rest: null });
      await persist(workout);
    },

    resume: (w) => set({ workout: w, activeIndex: 0, rest: null }),
    setActiveIndex: (i) => set({ activeIndex: i }),

    updateSet: (exerciseIndex, setId, patch) =>
      mutate((w) => {
        const ex = w.exercises[exerciseIndex];
        if (!ex) return w;
        ex.sets = ex.sets.map((s) => (s.id === setId ? { ...s, ...patch } : s));
        return w;
      }),

    addSet: (exerciseIndex) =>
      mutate((w) => {
        const ex = w.exercises[exerciseIndex];
        if (!ex) return w;
        const last = [...ex.sets].reverse().find((s) => !s.warmup);
        ex.sets.push({ id: uid('set'), weight: last?.weight ?? ex.suggestedWeight ?? 0, reps: last?.reps ?? ex.repRange[1], done: false, warmup: false });
        return w;
      }),

    addExercise: (exerciseId) =>
      mutate((w) => {
        const meta = EXERCISE_MAP[exerciseId];
        if (!meta || w.exercises.some((e) => e.exerciseId === exerciseId)) return w;
        const repRange: [number, number] = meta.isCompound ? [6, 10] : [10, 15];
        w.exercises.push({
          exerciseId,
          plannedSets: 3,
          repRange,
          restSec: meta.isCompound ? 150 : 75,
          suggestedWeight: 0,
          sets: buildSets(3, 0, 0, repRange[1])
        });
        return w;
      }),

    removeSet: (exerciseIndex, setId) =>
      mutate((w) => {
        const ex = w.exercises[exerciseIndex];
        if (!ex) return w;
        ex.sets = ex.sets.filter((s) => s.id !== setId);
        return w;
      }),

    toggleDone: (exerciseIndex, setId) => {
      const w = get().workout;
      const ex = w?.exercises[exerciseIndex];
      const target = ex?.sets.find((s) => s.id === setId);
      const willBeDone = target ? !target.done : false;
      mutate((draft) => {
        const e = draft.exercises[exerciseIndex];
        if (!e) return draft;
        e.sets = e.sets.map((s) => (s.id === setId ? { ...s, done: !s.done } : s));
        return draft;
      });
      if (willBeDone && ex) get().startRest(ex.exerciseId, ex.restSec);
    },

    applySuggestedWeight: (exerciseIndex, weight) =>
      mutate((w) => {
        const ex = w.exercises[exerciseIndex];
        if (!ex) return w;
        ex.suggestedWeight = weight;
        ex.sets = ex.sets.map((s) => (s.done ? s : { ...s, weight: s.warmup ? Math.round(weight * 0.5 * 2) / 2 : weight }));
        return w;
      }),

    setExerciseNotes: (exerciseIndex, notes) =>
      mutate((w) => {
        const ex = w.exercises[exerciseIndex];
        if (ex) ex.notes = notes;
        return w;
      }),

    skipExercise: (exerciseIndex) =>
      mutate((w) => {
        const ex = w.exercises[exerciseIndex];
        if (ex) ex.skipped = !ex.skipped;
        return w;
      }),

    replaceExercise: (exerciseIndex, newExerciseId) =>
      mutate((w) => {
        const ex = w.exercises[exerciseIndex];
        if (!ex || !EXERCISE_MAP[newExerciseId]) return w;
        const keepWeight = ex.suggestedWeight ?? 0;
        w.exercises[exerciseIndex] = {
          ...ex,
          replacedFrom: ex.exerciseId,
          exerciseId: newExerciseId,
          sets: buildSets(ex.plannedSets, 0, keepWeight, ex.repRange[1]),
          skipped: false
        };
        return w;
      }),

    startRest: (exerciseId, seconds) =>
      set({ rest: { exerciseId, endsAt: Date.now() + seconds * 1000, total: seconds } }),
    stopRest: () => set({ rest: null }),

    setFeedback: (f) => mutate((w) => ({ ...w, difficultyFeedback: f })),
    setNotes: (n) => mutate((w) => ({ ...w, notes: n })),

    finish: async () => {
      const current = get().workout;
      if (!current) return null;
      const finished: Workout = { ...current, status: 'completed', finishedAt: Date.now() };
      await workoutRepo.put(finished);

      const app = useAppStore.getState();
      const newRecords = findNewRecords(finished, app.records);
      for (const r of newRecords) await recordRepo.put(r);

      const allWorkouts = [...app.workouts.filter((w) => w.id !== finished.id), finished];
      const unlocked = evaluateAchievements(allWorkouts, [...app.records, ...newRecords], app.achievements);
      for (const a of unlocked) await achievementRepo.put(a);

      if (finished.programId) {
        const programState = await programStateRepo.get(finished.programId);
        if (programState) {
          const program = getProgram(finished.programId.split(':')[0]!);
          const completedDays = programState.completedDays + 1;
          const totalDays = program ? program.daysPerWeek * program.weeks : Number.POSITIVE_INFINITY;
          await programStateRepo.put({
            ...programState,
            completedDays,
            lastCompletedAt: finished.finishedAt,
            status: completedDays >= totalDays ? 'completed' : programState.status
          });
        }
      }

      app.patchSettings({ completedWorkoutsSinceInterstitial: app.settings.completedWorkoutsSinceInterstitial + 1 });
      await app.refresh();
      set({ workout: null, rest: null, activeIndex: 0, lastSummaryId: finished.id });
      return finished;
    },

    discard: async () => {
      const current = get().workout;
      if (current) await workoutRepo.remove(current.id);
      set({ workout: null, rest: null, activeIndex: 0 });
      await useAppStore.getState().refresh();
    }
  };
});

export const sessionVolume = (w: Workout | null) => (w ? workoutVolume(w) : 0);

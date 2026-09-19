import type {
  Achievement, BodyMeasurement, PersonalRecord, ProgramState, ProgressPhoto, Profile, Workout
} from '@/types';
import { db } from './db';

/** Repository-Interfaces – später durch Backend-Implementierungen ersetzbar. */
export interface WorkoutRepository {
  all(): Promise<Workout[]>;
  completed(): Promise<Workout[]>;
  active(): Promise<Workout | undefined>;
  get(id: string): Promise<Workout | undefined>;
  put(w: Workout): Promise<void>;
  remove(id: string): Promise<void>;
}

export const workoutRepo: WorkoutRepository = {
  all: () => db.workouts.orderBy('startedAt').reverse().toArray(),
  completed: async () => (await db.workouts.where('status').equals('completed').toArray()).sort((a, b) => b.startedAt - a.startedAt),
  active: async () => (await db.workouts.where('status').equals('active').toArray())[0],
  get: (id) => db.workouts.get(id),
  put: async (w) => { await db.workouts.put(w); },
  remove: async (id) => { await db.workouts.delete(id); }
};

export const profileRepo = {
  get: () => db.profile.get(1),
  put: async (p: Profile) => { await db.profile.put({ ...p, id: 1 }); },
  clear: async () => { await db.profile.clear(); }
};

export const measurementRepo = {
  all: () => db.measurements.orderBy('date').toArray(),
  put: async (m: BodyMeasurement) => { await db.measurements.put(m); },
  remove: async (id: string) => { await db.measurements.delete(id); }
};

export const photoRepo = {
  all: () => db.photos.orderBy('date').reverse().toArray(),
  put: async (p: ProgressPhoto) => { await db.photos.put(p); },
  remove: async (id: string) => { await db.photos.delete(id); }
};

export const recordRepo = {
  all: () => db.records.toArray(),
  forExercise: (exerciseId: string) => db.records.where('exerciseId').equals(exerciseId).toArray(),
  put: async (r: PersonalRecord) => { await db.records.put(r); }
};

export const achievementRepo = {
  all: () => db.achievements.toArray(),
  put: async (a: Achievement) => { await db.achievements.put(a); }
};

export const programStateRepo = {
  all: () => db.programStates.toArray(),
  get: (programId: string) => db.programStates.get(programId),
  put: async (s: ProgramState) => { await db.programStates.put(s); },
  remove: async (programId: string) => { await db.programStates.delete(programId); }
};

export async function wipeAllData() {
  await Promise.all([
    db.profile.clear(), db.workouts.clear(), db.measurements.clear(),
    db.photos.clear(), db.records.clear(), db.achievements.clear(), db.programStates.clear()
  ]);
}

import Dexie, { type Table } from 'dexie';
import type { Achievement, BodyMeasurement, PersonalRecord, ProgramState, ProgressPhoto, Profile, Workout } from '@/types';

export class LiftaraDB extends Dexie {
  profile!: Table<Profile, number>;
  workouts!: Table<Workout, string>;
  measurements!: Table<BodyMeasurement, string>;
  photos!: Table<ProgressPhoto, string>;
  records!: Table<PersonalRecord, string>;
  achievements!: Table<Achievement, string>;
  programStates!: Table<ProgramState, string>;

  constructor() {
    super('liftara');
    this.version(1).stores({
      profile: 'id',
      workouts: 'id, startedAt, status',
      measurements: 'id, date',
      photos: 'id, date',
      records: 'id, exerciseId, date',
      achievements: 'id, unlockedAt',
      programStates: 'programId, status'
    });
  }
}

export const db = new LiftaraDB();

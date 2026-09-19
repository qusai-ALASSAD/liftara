import type { Profile } from '@/types';

/** Auswählbares Demo-Profil laut Produktvorgabe. */
export const demoProfile = (locale: Profile['locale'] = 'de'): Profile => ({
  id: 1,
  name: 'Qusai',
  age: 35,
  gender: 'male',
  heightCm: 174,
  weightKg: 62,
  goalWeightKg: 71,
  units: 'metric',
  goal: 'muscle',
  experience: 'returning',
  returningAfterBreak: true,
  place: 'gym',
  equipment: ['machine', 'cable', 'dumbbell', 'barbell', 'bench', 'bodyweight'],
  daysPerWeek: 4,
  weekdays: [0, 2, 4, 5],
  sessionMinutes: 60,
  restrictions: [],
  avoidExerciseIds: [],
  locale,
  createdAt: Date.now(),
  onboardingComplete: true
});

import type { Achievement, PersonalRecord, Workout } from '@/types';
import { currentStreak, workoutVolume } from './stats';

export const ACHIEVEMENT_IDS = ['firstWorkout', 'tenWorkouts', 'streak7', 'streak30', 'firstPr', 'volume10k'] as const;
export type AchievementId = (typeof ACHIEVEMENT_IDS)[number];

export function evaluateAchievements(
  workouts: Workout[],
  records: PersonalRecord[],
  unlocked: Achievement[],
  now = Date.now()
): Achievement[] {
  const have = new Set(unlocked.map((a) => a.id));
  const completed = workouts.filter((w) => w.status === 'completed');
  const totalVolume = completed.reduce((sum, w) => sum + workoutVolume(w), 0);
  const streak = currentStreak(completed, now);
  const out: Achievement[] = [];
  const add = (id: AchievementId, value?: number) => {
    if (!have.has(id)) out.push({ id, unlockedAt: now, value });
  };
  if (completed.length >= 1) add('firstWorkout');
  if (completed.length >= 10) add('tenWorkouts', completed.length);
  if (streak >= 7) add('streak7', streak);
  if (streak >= 30) add('streak30', streak);
  if (records.length >= 1) add('firstPr');
  if (totalVolume >= 10_000) add('volume10k', Math.round(totalVolume));
  return out;
}

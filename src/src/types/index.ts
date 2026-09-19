/** Zentrale Typen / schemas of LIFTARA. Alle Repositories arbeiten gegen diese Typen. */

export type Locale = 'de' | 'en' | 'ar';
export const LOCALES: Locale[] = ['de', 'en', 'ar'];

export type MuscleGroup =
  | 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'forearms'
  | 'core' | 'glutes' | 'quads' | 'hamstrings' | 'calves' | 'fullBody';

export const MUSCLE_GROUPS: MuscleGroup[] = [
  'chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms',
  'core', 'glutes', 'quads', 'hamstrings', 'calves', 'fullBody'
];

export type Equipment =
  | 'machine' | 'cable' | 'dumbbell' | 'barbell' | 'bodyweight' | 'band' | 'kettlebell' | 'bench';

export const EQUIPMENT: Equipment[] = [
  'machine', 'cable', 'dumbbell', 'barbell', 'bodyweight', 'band', 'kettlebell', 'bench'
];

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type MovementPattern =
  | 'horizontalPress' | 'inclinePress' | 'verticalPress' | 'horizontalPull' | 'verticalPull'
  | 'squat' | 'hinge' | 'lunge' | 'curl' | 'triceps' | 'lateralRaise' | 'rearDelt'
  | 'calf' | 'coreBrace' | 'coreFlexion' | 'hipAbduction' | 'forearm' | 'carryFullBody';

export type ContraindicationTag =
  | 'shoulderPain' | 'lowerBackPain' | 'kneePain' | 'wristPain' | 'elbowPain' | 'neckPain' | 'highImpact';

export interface LocalizedText { de: string; en: string; ar: string }

/**
 * Medienmodell einer Übung.
 * Reale Fotos kommen aus dem Import (free-exercise-db, Public Domain).
 * `targetMuscleImage` ist kein Dateipfad, sondern die Ansicht der eigenen
 * Körperkarte – sie wird zur Laufzeit aus den Zielmuskeln gezeichnet.
 */
export interface ExerciseMedia {
  startImage?: string;
  finishImage?: string;
  /** Lehrschleife Start -> Ende -> Start, ohne Ton */
  executionVideo?: string;
  executionKind?: 'instructional-loop' | 'recorded';
  equipmentImage?: string;
  /** gerendertes Zielmuskel-Bild; die Körperkarte dient als Rückfallebene */
  targetMuscleImage?: string;
  targetMuscleView: 'front' | 'back';
  source?: string;
  sourceName?: string;
  license?: string;
  licenseUrl?: string;
}

export interface Exercise {
  id: string;
  name: LocalizedText;
  pattern: MovementPattern;
  primary: MuscleGroup[];
  secondary: MuscleGroup[];
  equipment: Equipment[];
  difficulty: Difficulty;
  isCompound: boolean;
  /** kleinste sinnvolle Laststeigerung in kg */
  loadStep: number;
  /** Original-SVG-Platzhalter, später durch eigene Videos ersetzbar */
  media: { type: 'svg' | 'video'; ref: string };
  alternatives: string[];
  contraindications: ContraindicationTag[];
  /** exercise-spezifischer Zusatz-Cue je Sprache */
  cue: LocalizedText;
  unilateral?: boolean;
}

export interface ExerciseInstructions {
  setup: string[];
  execution: string[];
  breathing: string;
  mistakes: string[];
  safety: string[];
}

export type ProgramGoal = 'muscle' | 'strength' | 'fatLoss' | 'health' | 'returning';
export type ExperienceLevel = 'beginner' | 'returning' | 'intermediate' | 'advanced';
export type TrainingPlace = 'gym' | 'home' | 'mixed';
export type UnitSystem = 'metric' | 'imperial';
export type Gender = 'male' | 'female' | 'other' | 'unspecified';

export interface PlannedExercise {
  exerciseId: string;
  sets: number;
  repRange: [number, number];
  restSec: number;
  warmupSets: number;
  suggestedWeight?: number;
  rirTarget: number;
}

export interface PlannedWorkout {
  id: string;
  titleKey: string;
  focus: MuscleGroup[];
  estimatedMinutes: number;
  exercises: PlannedExercise[];
  /** Begründung der Plan-Engine, bereits als i18n-Keys + Werte */
  rationale: { key: string; values?: Record<string, string | number> }[];
}

export interface ProgramDay { dayIndex: number; workoutTitle: LocalizedText; focus: MuscleGroup[]; exerciseIds: string[] }

export interface Program {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  level: ExperienceLevel[];
  daysPerWeek: number;
  weeks: number;
  place: TrainingPlace;
  equipment: Equipment[];
  premium: boolean;
  goal: ProgramGoal;
  days: ProgramDay[];
}

export interface ProgramState {
  programId: string;
  startedAt: number;
  status: 'active' | 'paused' | 'completed';
  completedDays: number;
  weekdays: number[];
  lastCompletedAt?: number;
  custom?: boolean;
}

export interface SetLog {
  id: string;
  weight: number;
  reps: number;
  done: boolean;
  warmup: boolean;
  rir?: number;
}

export interface SessionExercise {
  exerciseId: string;
  plannedSets: number;
  repRange: [number, number];
  restSec: number;
  suggestedWeight?: number;
  sets: SetLog[];
  notes?: string;
  skipped?: boolean;
  replacedFrom?: string;
}

export type WorkoutStatus = 'active' | 'completed' | 'discarded';

export interface Workout {
  id: string;
  startedAt: number;
  finishedAt?: number;
  status: WorkoutStatus;
  title: LocalizedText;
  focus: MuscleGroup[];
  programId?: string;
  exercises: SessionExercise[];
  difficultyFeedback?: 'easy' | 'right' | 'hard';
  notes?: string;
  bodyweightAtTime?: number;
}

export interface Profile {
  id: number;
  name: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  goalWeightKg: number;
  units: UnitSystem;
  goal: ProgramGoal;
  experience: ExperienceLevel;
  returningAfterBreak: boolean;
  place: TrainingPlace;
  equipment: Equipment[];
  daysPerWeek: number;
  weekdays: number[];
  sessionMinutes: number;
  restrictions: ContraindicationTag[];
  avoidExerciseIds: string[];
  locale: Locale;
  createdAt: number;
  onboardingComplete: boolean;
}

export interface BodyMeasurement {
  id: string; date: number; weightKg?: number;
  chest?: number; waist?: number; hips?: number; arm?: number; thigh?: number;
}

export interface ProgressPhoto { id: string; date: number; blob: Blob; note?: string }

export interface PersonalRecord {
  id: string; exerciseId: string; date: number;
  weight: number; reps: number; estimated1RM: number; volume: number;
}

export interface Achievement { id: string; unlockedAt: number; value?: number }

export type AdPlacement = 'bannerHome' | 'bannerLibrary' | 'interstitialPostWorkout' | 'rewardedReport';
export type AdKind = 'banner' | 'interstitial' | 'rewarded';

export interface AdRequest { placement: AdPlacement; kind: AdKind; personalized: boolean; locale: Locale }
export interface AdResult { shown: boolean; reason?: string; rewardGranted?: boolean }

export interface AdProvider {
  readonly id: string;
  isReady(): boolean;
  show(req: AdRequest): Promise<AdResult>;
}

export interface Consent {
  decided: boolean;
  analytics: boolean;
  ads: boolean;
  personalizedAds: boolean;
  decidedAt?: number;
}

export interface Settings {
  locale: Locale;
  theme: 'light' | 'dark' | 'system';
  units: UnitSystem;
  premium: boolean;
  consent: Consent;
  completedWorkoutsSinceInterstitial: number;
  /** gemerkte Übungen (Favoriten) */
  favorites: string[];
  lastRewardUnlockAt?: number;
  installPromptDismissedAt?: number;
}

export interface ExportBundle {
  app: 'liftara';
  version: 1;
  exportedAt: number;
  profile: Profile | null;
  workouts: Workout[];
  measurements: BodyMeasurement[];
  records: PersonalRecord[];
  achievements: Achievement[];
  programStates: ProgramState[];
  settings: Settings;
}

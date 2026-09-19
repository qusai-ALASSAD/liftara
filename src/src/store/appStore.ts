import { create } from 'zustand';
import type {
  Achievement, BodyMeasurement, Consent, Locale, PersonalRecord, ProgramState, Profile, Settings, UnitSystem, Workout
} from '@/types';
import {
  achievementRepo, measurementRepo, profileRepo, programStateRepo, recordRepo, workoutRepo, wipeAllData
} from '@/db/repositories';
import { applyTheme, defaultSettings, loadSettings, saveSettings } from '@/lib/settings';
import { applyDocumentLocale, initI18n } from '@/i18n';

interface AppState {
  ready: boolean;
  online: boolean;
  settings: Settings;
  profile: Profile | null;
  workouts: Workout[];
  measurements: BodyMeasurement[];
  records: PersonalRecord[];
  achievements: Achievement[];
  programStates: ProgramState[];
  init: () => Promise<void>;
  refresh: () => Promise<void>;
  setOnline: (v: boolean) => void;
  patchSettings: (p: Partial<Settings>) => void;
  setLocale: (l: Locale) => void;
  setUnits: (u: UnitSystem) => void;
  setTheme: (t: Settings['theme']) => void;
  setPremium: (v: boolean) => void;
  setConsent: (c: Partial<Consent>) => void;
  grantRewardUnlock: () => void;
  toggleFavorite: (exerciseId: string) => void;
  saveProfile: (p: Profile) => Promise<void>;
  addMeasurement: (m: BodyMeasurement) => Promise<void>;
  putProgramState: (s: ProgramState) => Promise<void>;
  removeProgramState: (id: string) => Promise<void>;
  deleteEverything: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  ready: false,
  online: typeof navigator === 'undefined' ? true : navigator.onLine,
  settings: defaultSettings(),
  profile: null,
  workouts: [],
  measurements: [],
  records: [],
  achievements: [],
  programStates: [],

  init: async () => {
    const settings = loadSettings();
    initI18n(settings.locale);
    applyTheme(settings.theme);
    set({ settings });
    await get().refresh();
    set({ ready: true });
  },

  refresh: async () => {
    const [profile, workouts, measurements, records, achievements, programStates] = await Promise.all([
      profileRepo.get(), workoutRepo.all(), measurementRepo.all(),
      recordRepo.all(), achievementRepo.all(), programStateRepo.all()
    ]);
    set({ profile: profile ?? null, workouts, measurements, records, achievements, programStates });
  },

  setOnline: (v) => set({ online: v }),

  patchSettings: (p) => {
    const next = { ...get().settings, ...p };
    saveSettings(next);
    set({ settings: next });
  },

  setLocale: (l) => {
    get().patchSettings({ locale: l });
    initI18n(l);
    applyDocumentLocale(l);
    const profile = get().profile;
    if (profile) void profileRepo.put({ ...profile, locale: l }).then(() => set({ profile: { ...profile, locale: l } }));
  },

  setUnits: (u) => get().patchSettings({ units: u }),

  setTheme: (t) => {
    get().patchSettings({ theme: t });
    applyTheme(t);
  },

  setPremium: (v) => get().patchSettings({ premium: v }),

  setConsent: (c) => {
    const current = get().settings.consent;
    const age = get().profile?.age;
    const merged: Consent = { ...current, ...c, decided: true, decidedAt: Date.now() };
    if (typeof age === 'number' && age < 18) merged.personalizedAds = false;
    if (!merged.ads) merged.personalizedAds = false;
    get().patchSettings({ consent: merged });
  },

  grantRewardUnlock: () => get().patchSettings({ lastRewardUnlockAt: Date.now() }),

  toggleFavorite: (exerciseId) => {
    const current = get().settings.favorites ?? [];
    const next = current.includes(exerciseId) ? current.filter((id) => id !== exerciseId) : [...current, exerciseId];
    get().patchSettings({ favorites: next });
  },

  saveProfile: async (p) => {
    await profileRepo.put(p);
    set({ profile: { ...p, id: 1 } });
    get().patchSettings({ units: p.units, locale: p.locale });
  },

  addMeasurement: async (m) => {
    await measurementRepo.put(m);
    set({ measurements: await measurementRepo.all() });
    const profile = get().profile;
    if (profile && m.weightKg) await get().saveProfile({ ...profile, weightKg: m.weightKg });
  },

  putProgramState: async (s) => {
    await programStateRepo.put(s);
    set({ programStates: await programStateRepo.all() });
  },

  removeProgramState: async (id) => {
    await programStateRepo.remove(id);
    set({ programStates: await programStateRepo.all() });
  },

  deleteEverything: async () => {
    await wipeAllData();
    const fresh = defaultSettings();
    saveSettings(fresh);
    set({ settings: fresh, profile: null, workouts: [], measurements: [], records: [], achievements: [], programStates: [] });
  }
}));

export const rewardUnlockUntil = (s: Settings) =>
  s.lastRewardUnlockAt ? s.lastRewardUnlockAt + 24 * 3_600_000 : undefined;

export type Feature =
  | 'adFree' | 'advancedAnalytics' | 'unlimitedCustomPrograms' | 'advancedProgression'
  | 'extraTemplates' | 'multipleGymProfiles' | 'advancedExport' | 'cloudBackup'
  | 'coreLogging' | 'exerciseLibrary' | 'muscleMap' | 'basicProgress' | 'beginnerPrograms';

const FREE_FEATURES: Feature[] = ['coreLogging', 'exerciseLibrary', 'muscleMap', 'basicProgress', 'beginnerPrograms'];

export interface AccessContext { premium: boolean; rewardUnlockUntil?: number; now?: number }

export function hasFeature(feature: Feature, ctx: AccessContext): boolean {
  if (FREE_FEATURES.includes(feature)) return true;
  if (ctx.premium) return true;
  if (feature === 'advancedAnalytics' && ctx.rewardUnlockUntil) {
    return (ctx.now ?? Date.now()) < ctx.rewardUnlockUntil;
  }
  return false;
}

export const MAX_FREE_CUSTOM_PROGRAMS = 1;

export function canCreateCustomProgram(existing: number, premium: boolean): boolean {
  return premium || existing < MAX_FREE_CUSTOM_PROGRAMS;
}

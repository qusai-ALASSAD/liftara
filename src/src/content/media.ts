import type { Exercise, ExerciseMedia, MuscleGroup } from '@/types';
import type { EquipmentVisual } from '@/components/EquipmentArt';
import { preferredView } from './anatomy';
import manifest from './mediaManifest.json';

/** Ergebnis des Imports aus scripts/import-exercise-media.mjs */
interface ManifestEntry {
  startImage?: string;
  finishImage?: string;
  executionVideo?: string;
  executionKind?: 'instructional-loop' | 'recorded';
  equipmentImage?: string;
  muscleImage?: string;
  source?: string;
  sourceName?: string;
  license?: string;
  licenseUrl?: string;
  sourceUrl?: string;
  matchedBy?: 'automatic' | 'override';
  confidence?: number;
  equipmentMatch?: boolean;
  equipmentNote?: string | null;
}

export const MEDIA_MANIFEST = manifest as unknown as Record<string, ManifestEntry>;

/** Basis-Pfad berücksichtigen, damit die App auch unter /liftara/ läuft. */
const withBase = (p: string) => (p.startsWith('data:') ? p : `${import.meta.env.BASE_URL.replace(/\/$/, '')}${p}`);

/**
 * Vollständiges Medienmodell einer Übung.
 * Fehlt ein echtes Foto, bleibt das Feld leer und die Oberfläche fällt auf die
 * eigene SVG-Zeichnung zurück.
 */
export function mediaFor(ex: Exercise): ExerciseMedia {
  const entry = MEDIA_MANIFEST[ex.id];
  return {
    startImage: entry?.startImage ? withBase(entry.startImage) : undefined,
    finishImage: entry?.finishImage ? withBase(entry.finishImage) : undefined,
    executionVideo: entry?.executionVideo ? withBase(entry.executionVideo) : undefined,
    executionKind: entry?.executionKind,
    equipmentImage: entry?.equipmentImage ? withBase(entry.equipmentImage) : undefined,
    targetMuscleImage: entry?.muscleImage ? withBase(entry.muscleImage) : undefined,
    targetMuscleView: targetView(ex),
    source: entry?.sourceUrl,
    sourceName: entry?.sourceName,
    license: entry?.license,
    licenseUrl: entry?.licenseUrl
  };
}

export const hasRealMedia = (ex: Exercise) => Boolean(MEDIA_MANIFEST[ex.id]?.startImage);

/**
 * Jede Übung bekommt drei Bildebenen:
 *  1. Gerät / Aufbau  -> EquipmentArt (diese Zuordnung)
 *  2. Zielmuskeln     -> AnatomyMap mit den Muskeln der Übung (automatisch korrekt)
 *  3. Ausführung      -> ExerciseArt anhand des Bewegungsmusters
 *
 * Ein Test (`src/test/media.test.ts`) prüft, dass alle 85 Übungen vollständig
 * abgedeckt sind und kein Platzhalter übrig bleibt.
 */
export const EQUIPMENT_VISUAL: Record<string, EquipmentVisual> = {
  // Brust
  'bench-press-barbell': 'flatBenchBarbell',
  'bench-press-dumbbell': 'flatBenchDumbbell',
  'chest-press-machine': 'chestPressMachine',
  'incline-press-dumbbell': 'inclineBenchDumbbell',
  'incline-press-barbell': 'inclineBenchBarbell',
  'cable-fly': 'cableCrossover',
  'pec-deck': 'pecDeck',
  'push-up': 'mat',
  'push-up-incline': 'flatBench',

  // Rücken
  'lat-pulldown': 'latPulldown',
  'lat-pulldown-neutral': 'latPulldown',
  'pull-up-assisted': 'assistedPullup',
  'pull-up': 'pullupBar',
  'seated-row-cable': 'seatedRowCable',
  'row-machine-chest-supported': 'chestSupportedRow',
  'dumbbell-row': 'flatBenchDumbbell',
  'barbell-row': 'barbellFloor',
  'straight-arm-pulldown': 'cableHighBar',
  'band-row': 'band',
  'inverted-row': 'smithMachine',

  // Schultern
  'shoulder-press-machine': 'shoulderPressMachine',
  'shoulder-press-dumbbell': 'dumbbellPair',
  'overhead-press-barbell': 'squatRack',
  'lateral-raise-dumbbell': 'dumbbellPair',
  'lateral-raise-cable': 'cableLow',
  'lateral-raise-band': 'band',
  'rear-delt-fly-machine': 'pecDeck',
  'face-pull': 'cableRope',
  'rear-delt-fly-dumbbell': 'dumbbellPair',

  // Bizeps
  'biceps-curl-dumbbell': 'dumbbellPair',
  'hammer-curl': 'dumbbellPair',
  'biceps-curl-barbell': 'barbellFloor',
  'preacher-curl': 'preacherBench',
  'cable-curl': 'cableLow',
  'incline-curl': 'inclineBenchDumbbell',
  'band-curl': 'band',

  // Trizeps
  'triceps-pushdown': 'cableHighBar',
  'rope-pushdown': 'cableRope',
  'overhead-triceps-dumbbell': 'dumbbellPair',
  skullcrusher: 'flatBenchBarbell',
  'triceps-dips-bench': 'flatBench',
  'triceps-machine': 'tricepsMachine',
  'diamond-push-up': 'mat',

  // Unterarme und Griff
  'wrist-curl': 'dumbbellPair',
  'reverse-wrist-curl': 'dumbbellPair',
  'farmer-hold': 'farmerCarry',
  'reverse-curl': 'barbellFloor',

  // Rumpf
  plank: 'mat',
  'side-plank': 'mat',
  'dead-bug': 'mat',
  crunch: 'mat',
  'cable-crunch': 'cableRope',
  'leg-raise': 'mat',
  'hanging-knee-raise': 'captainsChair',
  'pallof-press': 'cableLow',

  // Gesäß und Hüfte
  'hip-thrust': 'hipThrustBench',
  'glute-bridge': 'mat',
  'cable-kickback': 'cableLow',
  'hip-abduction-machine': 'abductionMachine',
  'band-hip-abduction': 'band',
  'step-up': 'calfStep',

  // Beine
  'back-squat': 'squatRack',
  'goblet-squat': 'kettlebell',
  'leg-press': 'legPress',
  'hack-squat': 'legPress',
  'leg-extension': 'legExtension',
  'split-squat': 'flatBenchDumbbell',
  'walking-lunge': 'dumbbellPair',
  'bodyweight-squat': 'mat',
  'wall-sit': 'mat',
  'romanian-deadlift': 'barbellFloor',
  deadlift: 'barbellFloor',
  'leg-curl-lying': 'legCurlLying',
  'leg-curl-seated': 'legCurlSeated',
  'good-morning': 'squatRack',
  'nordic-curl-assisted': 'mat',

  // Waden
  'standing-calf-raise': 'calfMachine',
  'seated-calf-raise': 'seatedCalfMachine',
  'calf-raise-bodyweight': 'calfStep',
  'single-leg-calf-raise': 'calfStep',

  // Ganzkörper
  'kettlebell-swing': 'kettlebell',
  'farmer-walk': 'farmerCarry',
  'dumbbell-thruster': 'dumbbellPair',
  'bear-crawl': 'mat',
  'burpee-step': 'mat'
};

/** Fallback nur für später ergänzte Übungen – der Test verhindert, dass er im Alltag greift. */
export function equipmentVisualFor(ex: Exercise): EquipmentVisual {
  const mapped = EQUIPMENT_VISUAL[ex.id];
  if (mapped) return mapped;
  if (ex.equipment.includes('machine')) return 'chestPressMachine';
  if (ex.equipment.includes('cable')) return 'cableLow';
  if (ex.equipment.includes('barbell')) return 'barbellFloor';
  if (ex.equipment.includes('kettlebell')) return 'kettlebell';
  if (ex.equipment.includes('band')) return 'band';
  if (ex.equipment.includes('dumbbell')) return 'dumbbellPair';
  return 'mat';
}

/** Ansicht, auf der die Zielmuskeln der Übung am besten sichtbar sind. */
export function targetView(ex: Exercise): 'front' | 'back' {
  const first = ex.primary[0] as MuscleGroup | undefined;
  return first ? preferredView(first) : 'front';
}

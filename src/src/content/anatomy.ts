import type { MuscleGroup } from '@/types';

/**
 * Anatomisches Körpermodell für LIFTARA.
 * Eigene Zeichnung – keine fremden Vorlagen, damit die Assets frei weitergegeben
 * werden können und die PWA offline funktioniert.
 *
 * Aufbau: eine männliche Silhouette mit ausmodellierten Muskelbäuchen. Eine Region
 * ist feiner aufgelöst als die Datenmodell-Muskelgruppe ("lats" und "upperBack"
 * zeigen beide auf `back`), damit die Karte anatomisch korrekt beschriftet werden
 * kann, ohne das bestehende Übungs- und Testmodell zu verändern.
 */
export interface AnatomyRegion {
  id: string;
  group: MuscleGroup;
  /** i18n-Schlüssel unter `anatomy.` */
  labelKey: string;
  /** Pfad(e) der linken Körperhälfte – die rechte wird gespiegelt gerendert. */
  paths: string[];
  /** true = Pfad ist bereits symmetrisch und wird nicht gespiegelt */
  symmetric?: boolean;
  /** feine Faserlinien für die anatomische Anmutung */
  fibers?: string[];
}

export const BODY_VIEWBOX = '0 0 240 560';
/** Spiegelachse: x = 120 */
export const MIRROR = 'translate(240,0) scale(-1,1)';

/* ------------------------------------------------------------------ */
/* Silhouette                                                          */
/* ------------------------------------------------------------------ */

export interface SilhouettePart { d: string; mirror: boolean }

/** Mittige Teile (nicht spiegeln) */
const CENTER_PARTS: string[] = [
  // Kopf
  'M120 14c-14 0-24 11-25 26-1 10 2 20 7 26 2 3 3 7 3 11h30c0-4 1-8 3-11 5-6 8-16 7-26-1-15-11-26-25-26z',
  // Hals
  'M105 77l-1 13c4 5 9 7 16 7s12-2 16-7l-1-13z',
  // Rumpf von der Schulter bis zur Hüfte
  'M120 86c-15 0-27 5-35 14-10 11-16 28-16 46 0 20 5 40 11 58 6 18 11 28 12 40 1 14-2 28-6 44-3 12 4 24 16 24h36c12 0 19-12 16-24-4-16-7-30-6-44 1-12 6-22 12-40 6-18 11-38 11-58 0-18-6-35-16-46-8-9-20-14-35-14z'
];

/** Linke Körperhälfte (wird gespiegelt) */
const SIDE_PARTS: string[] = [
  // Oberarm
  'M86 96c-13 6-21 22-25 46-4 25-6 50-5 72 1 11 12 14 18 5 9-16 15-42 17-68 2-22 1-41-5-55z',
  // Unterarm
  'M58 214c-9 16-14 40-15 64-1 16 1 28 5 34 6 5 15 1 17-9 4-20 6-46 4-66-2-12-5-20-11-23z',
  // Hand
  'M47 314c-7 8-9 22-6 34 3 11 13 11 17 0 3-12 4-26 0-34-2-5-8-5-11 0z',
  // Oberschenkel
  'M113 298c-13 0-24 6-28 20-6 22-8 48-6 72 2 16 5 26 9 32 8 5 18 1 20-9 4-22 6-48 8-70 2-16 3-32-3-45z',
  // Unterschenkel
  'M89 424c-7 14-11 40-11 64 0 18 2 32 6 40 6 5 15 1 17-9 4-20 6-46 4-68-2-15-8-25-16-27z',
  // Fuß
  'M81 528c-8 4-14 11-12 17 3 6 16 8 28 6 7-1 10-6 9-12-1-6-6-11-13-11z'
];

export const SILHOUETTE_FRONT: SilhouettePart[] = [
  ...CENTER_PARTS.map((d) => ({ d, mirror: false })),
  ...SIDE_PARTS.map((d) => ({ d, mirror: true }))
];

export const SILHOUETTE_BACK: SilhouettePart[] = SILHOUETTE_FRONT;

/* ------------------------------------------------------------------ */
/* Vorderansicht                                                       */
/* ------------------------------------------------------------------ */

export const FRONT_REGIONS: AnatomyRegion[] = [
  {
    id: 'traps',
    group: 'shoulders',
    labelKey: 'traps',
    paths: ['M118 92c-13 2-25 6-34 14 3 8 8 15 15 20 6-12 12-24 19-31z'],
    fibers: ['M104 99c4 9 9 18 14 25']
  },
  {
    id: 'frontDelts',
    group: 'shoulders',
    labelKey: 'frontDelts',
    paths: [
      'M82 101c-11 5-19 16-22 30-2 12-1 23 3 31 12-5 21-17 25-32 3-12 2-23-6-29z',
      'M68 118c-6 8-9 20-9 33 0 8 1 15 4 20 6-5 9-15 10-27 1-11 0-20-5-26z'
    ],
    fibers: ['M76 112c5 11 8 23 7 35', 'M64 126c3 9 5 19 4 28']
  },
  {
    id: 'chest',
    group: 'chest',
    labelKey: 'chest',
    paths: [
      'M118 110c-13-1-25 2-34 8-3 7-3 15 0 22 10 7 22 10 34 9z',
      'M118 149c-12 1-24-2-33-9-2 8-1 17 3 24 9 9 20 13 30 12z'
    ],
    fibers: ['M112 120c-9-1-18 1-25 5', 'M113 133c-10-1-19 0-26 4', 'M114 158c-9 0-18-2-25-6']
  },
  {
    id: 'serratus',
    group: 'chest',
    labelKey: 'serratus',
    paths: ['M88 158c-4 3-7 9-8 16 5 3 10 4 15 3 0-7-2-14-7-19z'],
    fibers: ['M84 164c4 3 8 6 11 10']
  },
  {
    id: 'biceps',
    group: 'biceps',
    labelKey: 'biceps',
    paths: [
      'M67 122c-7 9-11 24-11 40 0 12 2 22 7 28 8-6 14-18 16-33 2-15-2-29-12-35z',
      'M80 132c-4 9-6 22-5 34 1 9 3 16 6 20 5-6 8-17 8-30 0-13-3-22-9-24z'
    ],
    fibers: ['M65 140c4 12 6 26 5 38', 'M79 146c3 10 4 22 3 32']
  },
  {
    id: 'forearms',
    group: 'forearms',
    labelKey: 'forearms',
    paths: [
      'M59 218c-8 13-12 31-12 49 0 14 2 25 6 32 8-7 13-21 14-38 2-19-1-34-8-43z',
      'M73 232c-4 11-6 26-5 40 1 11 3 19 6 23 4-7 7-19 7-33 0-15-3-26-8-30z'
    ],
    fibers: ['M57 236c4 14 6 30 4 45', 'M73 246c3 12 4 25 3 36']
  },
  {
    id: 'abs',
    group: 'core',
    labelKey: 'abs',
    paths: [
      'M118 166h-20a5 5 0 0 0-5 5v13a5 5 0 0 0 5 5h20z',
      'M118 193h-20a5 5 0 0 0-5 5v13a5 5 0 0 0 5 5h20z',
      'M118 220h-19a5 5 0 0 0-5 5v13a5 5 0 0 0 5 5h19z',
      'M118 247h-18a5 5 0 0 0-5 5v11a5 5 0 0 0 5 5h18z',
      'M118 272h-16c-4 4-6 10-6 17 0 6 2 11 5 14h17z'
    ]
  },
  {
    id: 'obliques',
    group: 'core',
    labelKey: 'obliques',
    paths: [
      'M92 176c-6 10-10 25-10 40 0 16 3 30 9 39 5-7 8-22 8-40 0-19-2-33-7-39z',
      'M87 232c-4 8-6 18-5 28 1 8 3 14 6 18 3-6 5-15 5-25 0-11-2-18-6-21z'
    ],
    fibers: ['M89 192c3 12 4 26 3 39', 'M85 240c2 9 3 18 2 26']
  },
  {
    id: 'quads',
    group: 'quads',
    labelKey: 'quads',
    paths: [
      'M102 330c-5 12-8 33-8 57 0 22 2 40 6 51 6-8 9-30 10-55 1-24-2-42-8-53z',
      'M88 334c-10 10-15 32-15 56 0 22 3 40 9 50 7-9 11-30 12-54 1-25-1-43-6-52z',
      'M106 400c-7 9-11 24-11 39 0 10 2 18 5 22 6-6 9-19 10-33 1-12-1-23-4-28z'
    ],
    fibers: ['M100 348c4 20 5 44 3 66', 'M88 356c3 18 4 38 2 56', 'M106 414c2 12 2 26 0 38']
  },
  {
    id: 'tibialis',
    group: 'calves',
    labelKey: 'calves',
    paths: ['M98 448c-8 12-13 32-13 52 0 17 3 31 7 38 7-9 11-27 11-46 0-21-2-37-5-44z'],
    fibers: ['M97 466c3 14 4 30 2 46']
  }
];

/* ------------------------------------------------------------------ */
/* Rückansicht                                                         */
/* ------------------------------------------------------------------ */

export const BACK_REGIONS: AnatomyRegion[] = [
  {
    id: 'upperBack',
    group: 'back',
    labelKey: 'upperBack',
    paths: [
      'M118 90c-16 2-30 8-39 18 5 15 13 28 23 38 7-16 12-40 16-56z',
      'M118 146c-9-3-17-9-24-17-4 8-5 18-2 27 8 6 17 9 26 9z'
    ],
    fibers: ['M101 100c5 15 11 29 17 40', 'M89 113c6 12 13 23 21 32']
  },
  {
    id: 'rearDelts',
    group: 'shoulders',
    labelKey: 'rearDelts',
    paths: ['M80 101c-11 5-19 16-21 30-2 12 0 22 4 30 12-6 20-17 23-32 3-12 2-23-6-28z'],
    fibers: ['M72 113c5 11 8 22 8 33']
  },
  {
    id: 'lats',
    group: 'back',
    labelKey: 'lats',
    paths: ['M90 136c-12 13-17 35-15 57 2 18 9 32 18 39 11-12 18-32 20-54 2-20-8-35-23-42z'],
    fibers: ['M96 150c8 13 12 30 11 48', 'M88 163c6 13 9 28 8 43', 'M102 172c4 12 5 25 3 37']
  },
  {
    id: 'triceps',
    group: 'triceps',
    labelKey: 'triceps',
    paths: [
      'M65 120c-7 11-11 27-10 42 1 13 4 22 9 28 9-7 14-21 16-36 2-17-4-30-15-34z',
      'M79 130c-4 10-6 23-5 35 1 9 3 16 6 20 5-6 8-17 8-30 0-13-3-23-9-25z'
    ],
    fibers: ['M63 137c5 12 7 27 6 41', 'M79 144c3 11 4 23 3 33']
  },
  {
    id: 'forearmsBack',
    group: 'forearms',
    labelKey: 'forearms',
    paths: [
      'M58 218c-8 13-12 31-12 49 0 14 2 25 6 32 8-7 13-21 14-38 2-19-1-34-8-43z',
      'M72 232c-4 11-6 26-5 40 1 11 3 19 6 23 4-7 7-19 7-33 0-15-3-26-8-30z'
    ]
  },
  {
    id: 'lowerBack',
    group: 'core',
    labelKey: 'lowerBack',
    paths: ['M118 196h-13c-7 7-11 22-11 38 0 15 3 28 9 35h15z'],
    fibers: ['M107 208c3 15 4 32 2 48']
  },
  {
    id: 'glutes',
    group: 'glutes',
    labelKey: 'glutes',
    paths: ['M118 270H99c-13 2-22 14-23 30-1 17 9 30 25 32 7 1 12-1 17-5z'],
    fibers: ['M101 282c6 11 9 24 9 37']
  },
  {
    id: 'hamstrings',
    group: 'hamstrings',
    labelKey: 'hamstrings',
    paths: [
      'M103 338c-6 12-9 32-9 54 0 21 3 38 8 47 6-9 9-31 10-56 1-23-2-39-9-45z',
      'M89 342c-10 11-15 32-15 54 0 20 4 36 10 45 7-10 11-31 11-55 0-24-2-40-6-44z'
    ],
    fibers: ['M102 356c4 17 5 37 3 54', 'M88 360c3 16 4 34 2 50']
  },
  {
    id: 'calves',
    group: 'calves',
    labelKey: 'calves',
    paths: [
      'M101 444c-6 11-10 27-10 44 0 15 2 27 6 34 6-9 9-25 9-43 0-19-2-31-5-35z',
      'M87 446c-8 11-13 28-13 46 0 16 3 29 8 36 6-9 10-26 10-45 0-18-2-32-5-37z',
      'M96 510c-4 8-6 18-6 28 0 7 1 13 3 16 4-5 6-14 6-24 0-9-1-17-3-20z'
    ],
    fibers: ['M100 460c3 14 4 30 2 45', 'M87 462c3 13 4 29 2 43']
  }
];

export const ALL_REGIONS = [...FRONT_REGIONS, ...BACK_REGIONS];

/** Auf welcher Ansicht ist eine Muskelgruppe am besten sichtbar? */
export function preferredView(group: MuscleGroup): 'front' | 'back' {
  if (FRONT_REGIONS.some((r) => r.group === group)) return 'front';
  if (BACK_REGIONS.some((r) => r.group === group)) return 'back';
  return 'front';
}

export const regionsForGroup = (group: MuscleGroup, view: 'front' | 'back') =>
  (view === 'front' ? FRONT_REGIONS : BACK_REGIONS).filter((r) => r.group === group);

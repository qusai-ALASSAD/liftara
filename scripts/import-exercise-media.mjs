#!/usr/bin/env node
/**
 * LIFTARA – automatischer Import von Übungsmedien.
 *
 * Quelle: https://github.com/yuhonas/free-exercise-db (Unlicense / Public Domain)
 *
 * Ablauf:
 *   1. Datensatz beschaffen (git clone oder vorhandenes Verzeichnis).
 *   2. LIFTARA-Übungen aus src/content/exercises.ts laden (über esbuild transpiliert).
 *   3. Jede Übung gegen den Datensatz matchen: Name, Equipment, Zielmuskel, Bewegungsmuster.
 *   4. Nur sichere Treffer übernehmen; unsichere landen im Unmatched-Report.
 *   5. Bilder nach WebP konvertieren (max. 1200 px, Ziel < 180 kB).
 *   6. Manifest + Quellen-/Lizenzangabe je Übung schreiben.
 *
 * Aufruf:  node scripts/import-exercise-media.mjs [--dataset <pfad>] [--dry-run]
 */

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const DATASET_DIR = path.resolve(opt('dataset', process.env.EXERCISE_DB_DIR ?? '/tmp/free-exercise-db'));
const DATASET_REPO = 'https://github.com/yuhonas/free-exercise-db.git';
const MEDIA_DIR = path.join(ROOT, 'public/media/exercises');
const MANIFEST_FILE = path.join(ROOT, 'src/content/mediaManifest.json');
const UNMATCHED_FILE = path.join(ROOT, 'media-reports/unmatched-report.json');
const STATS_FILE = path.join(ROOT, 'media-reports/import-stats.json');
const DRY = flag('dry-run');

const SOURCE = {
  name: 'free-exercise-db',
  url: 'https://github.com/yuhonas/free-exercise-db',
  license: 'Unlicense (public domain)',
  licenseUrl: 'https://github.com/yuhonas/free-exercise-db/blob/main/LICENSE.md',
  attributionRequired: false
};

/* ------------------------------------------------------------------ */
/* 1. Datensatz                                                        */
/* ------------------------------------------------------------------ */

function ensureDataset() {
  if (fs.existsSync(path.join(DATASET_DIR, 'exercises'))) return;
  console.log(`> Klone ${DATASET_REPO} nach ${DATASET_DIR}`);
  execFileSync('git', ['clone', '--depth', '1', DATASET_REPO, DATASET_DIR], { stdio: 'inherit' });
}

function loadDataset() {
  const distFile = path.join(DATASET_DIR, 'dist/exercises.json');
  if (fs.existsSync(distFile)) return JSON.parse(fs.readFileSync(distFile, 'utf8'));
  const dir = path.join(DATASET_DIR, 'exercises');
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
}

/* ------------------------------------------------------------------ */
/* 2. LIFTARA-Übungen                                                  */
/* ------------------------------------------------------------------ */

async function loadLiftaraExercises() {
  const out = path.join(ROOT, 'node_modules/.cache/liftara-exercises.mjs');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await esbuild.build({
    entryPoints: [path.join(ROOT, 'src/content/exercises.ts')],
    bundle: true,
    format: 'esm',
    platform: 'node',
    outfile: out,
    logLevel: 'silent',
    alias: { '@': path.join(ROOT, 'src') }
  });
  const mod = await import(`file://${out}?v=${Date.now()}`);
  return mod.EXERCISES;
}

/* ------------------------------------------------------------------ */
/* 3. Zuordnungstabellen                                               */
/* ------------------------------------------------------------------ */

/** LIFTARA-Muskelgruppe -> Muskeln im Datensatz */
const MUSCLE_MAP = {
  chest: ['chest'],
  back: ['lats', 'middle back', 'lower back', 'traps'],
  shoulders: ['shoulders', 'traps'],
  biceps: ['biceps'],
  triceps: ['triceps'],
  forearms: ['forearms'],
  core: ['abdominals', 'lower back'],
  glutes: ['glutes', 'abductors', 'adductors'],
  quads: ['quadriceps'],
  hamstrings: ['hamstrings'],
  calves: ['calves'],
  fullBody: []
};

/** LIFTARA-Equipment -> Equipment im Datensatz ("bench" ist nur Zubehör) */
const EQUIPMENT_MAP = {
  machine: ['machine'],
  cable: ['cable'],
  dumbbell: ['dumbbell'],
  barbell: ['barbell', 'e-z curl bar'],
  bodyweight: ['body only'],
  band: ['bands'],
  kettlebell: ['kettlebells'],
  bench: []
};

/**
 * Manuelle Zuordnung für Übungen, deren Namen im Datensatz deutlich abweichen.
 * Jeder Eintrag wurde einzeln geprüft (Name, Equipment, Zielmuskel, Anleitung).
 * `null` bedeutet: im Datensatz gibt es bewusst keine passende Übung.
 */
const OVERRIDES = {
  // Der automatische Abgleich findet diese Übungen nicht oder greift daneben.
  // Jeder Eintrag wurde einzeln gegen Name, Equipment, Zielmuskel und Anleitung geprüft.
  'bench-press-barbell': 'Barbell_Bench_Press_-_Medium_Grip',
  'push-up': 'Pushups',
  'pec-deck': 'Butterfly',
  'cable-fly': 'Cable_Crossover',
  'lat-pulldown': 'Wide-Grip_Lat_Pulldown',
  'lat-pulldown-neutral': 'V-Bar_Pulldown',
  'pull-up-assisted': 'Band_Assisted_Pull-Up',
  'pull-up': 'Pullups',
  'row-machine-chest-supported': 'Leverage_High_Row',
  'band-row': null,
  'shoulder-press-machine': 'Leverage_Shoulder_Press',
  'shoulder-press-dumbbell': 'Seated_Dumbbell_Press',
  'overhead-press-barbell': 'Standing_Military_Press',
  'lateral-raise-dumbbell': 'Side_Lateral_Raise',
  'lateral-raise-band': 'Lateral_Raise_-_With_Bands',
  'band-curl': null,
  'rear-delt-fly-machine': 'Reverse_Machine_Flyes',
  'biceps-curl-dumbbell': 'Dumbbell_Bicep_Curl',
  'hammer-curl': 'Hammer_Curls',
  'biceps-curl-barbell': 'Barbell_Curl',
  'cable-curl': 'Standing_Biceps_Cable_Curl',
  'overhead-triceps-dumbbell': 'Standing_Dumbbell_Triceps_Extension',
  skullcrusher: 'EZ-Bar_Skullcrusher',
  'diamond-push-up': 'Push-Ups_-_Close_Triceps_Position',
  'wrist-curl': 'Palms-Up_Barbell_Wrist_Curl_Over_A_Bench',
  'reverse-wrist-curl': 'Palms-Down_Wrist_Curl_Over_A_Bench',
  'farmer-hold': 'Farmers_Walk',
  'reverse-curl': 'Reverse_Barbell_Curl',
  'side-plank': 'Side_Bridge',
  crunch: 'Crunches',
  'glute-bridge': 'Butt_Lift_Bridge',
  'cable-kickback': 'One-Legged_Cable_Kickback',
  'hip-abduction-machine': 'Thigh_Abductor',
  'band-hip-abduction': null,
  'step-up': 'Dumbbell_Step_Ups',
  'leg-extension': 'Leg_Extensions',
  'walking-lunge': 'Dumbbell_Lunges',
  'wall-sit': null,
  deadlift: 'Barbell_Deadlift',
  'standing-calf-raise': 'Standing_Calf_Raises',
  'calf-raise-bodyweight': null,
  'single-leg-calf-raise': 'Standing_Dumbbell_Calf_Raise',
  'kettlebell-swing': 'One-Arm_Kettlebell_Swings',
  'farmer-walk': 'Farmers_Walk',
  'dumbbell-thruster': null,
  'bear-crawl': null,
  'burpee-step': null,
  'nordic-curl-assisted': 'Natural_Glute_Ham_Raise'
};

/* ------------------------------------------------------------------ */
/* 4. Matching                                                         */
/* ------------------------------------------------------------------ */

const STOPWORDS = new Set(['the', 'a', 'an', 'with', 'on', 'in', 'to', 'and', 'of', 'over', 'up', 'down']);

const normalize = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss')
    .replace(/[_\-–—/]/g, ' ')
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const tokens = (s) => normalize(s).split(' ').filter((w) => w && !STOPWORDS.has(w));

/** Jaccard-Ähnlichkeit plus Bonus für identische Wortfolge. */
function nameScore(a, b) {
  const ta = new Set(tokens(a));
  const tb = new Set(tokens(b));
  if (ta.size === 0 || tb.size === 0) return 0;
  let shared = 0;
  for (const t of ta) if (tb.has(t)) shared += 1;
  const jaccard = shared / (ta.size + tb.size - shared);
  const exact = normalize(a) === normalize(b) ? 0.25 : 0;
  return Math.min(1, jaccard + exact);
}

function equipmentScore(liftara, candidate) {
  const wanted = new Set(liftara.equipment.flatMap((e) => EQUIPMENT_MAP[e] ?? []));
  if (wanted.size === 0) return 0.5;
  if (!candidate.equipment) return 0.25;
  return wanted.has(candidate.equipment) ? 1 : 0;
}

function muscleScore(liftara, candidate) {
  const wanted = new Set(liftara.primary.flatMap((m) => MUSCLE_MAP[m] ?? []));
  if (wanted.size === 0) return 0.5;
  const prim = (candidate.primaryMuscles ?? []).some((m) => wanted.has(m));
  if (prim) return 1;
  const sec = (candidate.secondaryMuscles ?? []).some((m) => wanted.has(m));
  return sec ? 0.4 : 0;
}

/** Bewegungsmuster grob gegen force/mechanic des Datensatzes prüfen. */
const PATTERN_FORCE = {
  horizontalPress: 'push', inclinePress: 'push', verticalPress: 'push', triceps: 'push',
  horizontalPull: 'pull', verticalPull: 'pull', curl: 'pull', rearDelt: 'pull',
  hinge: 'pull', lateralRaise: 'pull', forearm: 'pull',
  squat: 'push', lunge: 'push', calf: 'push', hipAbduction: 'push',
  coreBrace: 'static', coreFlexion: 'pull', carryFullBody: 'static'
};

function patternScore(liftara, candidate) {
  const want = PATTERN_FORCE[liftara.pattern];
  if (!want || !candidate.force) return 0.5;
  return candidate.force === want ? 1 : 0.2;
}

function score(liftara, candidate) {
  const parts = {
    name: nameScore(liftara.name.en, candidate.name),
    equipment: equipmentScore(liftara, candidate),
    muscle: muscleScore(liftara, candidate),
    pattern: patternScore(liftara, candidate)
  };
  const total = parts.name * 0.45 + parts.equipment * 0.2 + parts.muscle * 0.25 + parts.pattern * 0.1;
  return { total: Number(total.toFixed(4)), parts };
}

function bestMatches(liftara, dataset, limit = 5) {
  return dataset
    .map((c) => ({ candidate: c, ...score(liftara, c) }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}

/* ------------------------------------------------------------------ */
/* 5. Bildverarbeitung                                                 */
/* ------------------------------------------------------------------ */

const MAX_DIM = 1200;
const TARGET_BYTES = 180 * 1024;

async function toWebp(srcFile, destFile) {
  const original = fs.statSync(srcFile).size;
  let quality = 82;
  let buffer = null;
  // Qualität so lange senken, bis die Datei unter dem Zielwert liegt.
  for (let i = 0; i < 5; i += 1) {
    buffer = await sharp(srcFile)
      .rotate()
      .resize({ width: MAX_DIM, height: MAX_DIM, fit: 'inside', withoutEnlargement: true })
      .webp({ quality, effort: 5 })
      .toBuffer();
    if (buffer.length <= TARGET_BYTES || quality <= 55) break;
    quality -= 8;
  }
  if (!DRY) {
    fs.mkdirSync(path.dirname(destFile), { recursive: true });
    fs.writeFileSync(destFile, buffer);
  }
  const meta = await sharp(buffer).metadata();
  return {
    original,
    optimized: buffer.length,
    quality,
    width: meta.width,
    height: meta.height,
    sha256: createHash('sha256').update(buffer).digest('hex').slice(0, 16)
  };
}

/* ------------------------------------------------------------------ */
/* 6. Hauptlauf                                                        */
/* ------------------------------------------------------------------ */

const AUTO_ACCEPT = 0.72;   // ab hier automatisch übernommen
const REVIEW_FLOOR = 0.55;  // darunter: nie automatisch, immer Report

async function main() {
  ensureDataset();
  const dataset = loadDataset();
  const byId = new Map(dataset.map((e) => [e.id, e]));
  const exercises = await loadLiftaraExercises();

  console.log(`> Datensatz: ${dataset.length} Übungen, LIFTARA: ${exercises.length} Übungen`);

  const manifest = {};
  const unmatched = [];
  const stats = {
    generatedAt: new Date().toISOString(),
    source: SOURCE,
    total: exercises.length,
    automatic: 0,
    override: 0,
    unmatched: 0,
    images: 0,
    bytesOriginal: 0,
    bytesOptimized: 0
  };

  for (const ex of exercises) {
    const ranked = bestMatches(ex, dataset);
    const overrideId = Object.prototype.hasOwnProperty.call(OVERRIDES, ex.id) ? OVERRIDES[ex.id] : undefined;

    let chosen = null;
    let how = null;

    if (overrideId === null) {
      // Bewusst kein Treffer im Datensatz.
      unmatched.push({
        liftaraId: ex.id,
        name: ex.name.en,
        reason: 'no-suitable-source-exercise',
        note: 'Im Datensatz existiert keine fachlich korrekte Entsprechung; LIFTARA nutzt die eigene SVG-Zeichnung.',
        bestCandidates: ranked.map((r) => ({ id: r.candidate.id, score: r.total }))
      });
      stats.unmatched += 1;
      continue;
    }

    if (overrideId) {
      const candidate = byId.get(overrideId);
      if (!candidate) {
        unmatched.push({
          liftaraId: ex.id, name: ex.name.en, reason: 'override-id-not-found', overrideId,
          bestCandidates: ranked.map((r) => ({ id: r.candidate.id, score: r.total }))
        });
        stats.unmatched += 1;
        continue;
      }
      chosen = { candidate, ...score(ex, candidate) };
      how = 'override';
    } else if (ranked[0] && ranked[0].total >= AUTO_ACCEPT) {
      chosen = ranked[0];
      how = 'automatic';
    }

    if (!chosen) {
      unmatched.push({
        liftaraId: ex.id,
        name: ex.name.en,
        reason: ranked[0] && ranked[0].total >= REVIEW_FLOOR ? 'below-auto-accept-threshold' : 'no-plausible-candidate',
        bestCandidates: ranked.map((r) => ({ id: r.candidate.id, name: r.candidate.name, score: r.total, parts: r.parts }))
      });
      stats.unmatched += 1;
      continue;
    }

    /*
     * Plausibilitätsprüfung.
     * - Der Zielmuskel muss immer passen, sonst wäre die Zuordnung fachlich falsch.
     * - Das Equipment muss bei automatischen Treffern passen. Bei manuell geprüften
     *   Overrides darf es abweichen (z. B. Farmer's Walk ist im Datensatz als "other"
     *   geführt, LIFTARA kennt Kurzhantel und Kettlebell) – die Abweichung wird
     *   dokumentiert statt verschwiegen.
     */
    const sanity = {
      equipment: chosen.parts.equipment >= 0.25,
      muscle: chosen.parts.muscle >= 0.4
    };
    const equipmentNote = sanity.equipment
      ? null
      : `Equipment im Datensatz ("${chosen.candidate.equipment ?? 'unbekannt'}") weicht ab; Zuordnung manuell geprüft.`;
    if (!sanity.muscle || (how === 'automatic' && !sanity.equipment)) {
      unmatched.push({
        liftaraId: ex.id, name: ex.name.en, reason: 'sanity-check-failed', sanity,
        candidate: { id: chosen.candidate.id, name: chosen.candidate.name, equipment: chosen.candidate.equipment, primaryMuscles: chosen.candidate.primaryMuscles },
        score: chosen.total
      });
      stats.unmatched += 1;
      continue;
    }

    const images = chosen.candidate.images ?? [];
    const outDir = path.join(MEDIA_DIR, ex.id);
    const files = {};
    const fileMeta = [];

    const names = ['start', 'finish'];
    for (let i = 0; i < Math.min(images.length, 2); i += 1) {
      const srcFile = path.join(DATASET_DIR, 'exercises', images[i]);
      if (!fs.existsSync(srcFile)) continue;
      const destFile = path.join(outDir, `${names[i]}.webp`);
      const info = await toWebp(srcFile, destFile);
      files[names[i] === 'start' ? 'startImage' : 'finishImage'] = `/media/exercises/${ex.id}/${names[i]}.webp`;
      fileMeta.push({ role: names[i], sourceFile: images[i], ...info });
      stats.images += 1;
      stats.bytesOriginal += info.original;
      stats.bytesOptimized += info.optimized;
    }

    if (fileMeta.length === 0) {
      unmatched.push({
        liftaraId: ex.id, name: ex.name.en, reason: 'no-images-in-source',
        candidate: { id: chosen.candidate.id, name: chosen.candidate.name }
      });
      stats.unmatched += 1;
      continue;
    }

    const sourceRecord = {
      liftaraId: ex.id,
      liftaraName: ex.name.en,
      sourceId: chosen.candidate.id,
      sourceName: chosen.candidate.name,
      sourceEquipment: chosen.candidate.equipment ?? null,
      sourcePrimaryMuscles: chosen.candidate.primaryMuscles ?? [],
      sourceSecondaryMuscles: chosen.candidate.secondaryMuscles ?? [],
      sourceLevel: chosen.candidate.level ?? null,
      matchedBy: how,
      confidence: chosen.total,
      confidenceParts: chosen.parts,
      equipmentMatch: sanity.equipment,
      muscleMatch: sanity.muscle,
      equipmentNote,
      files: fileMeta,
      dataset: SOURCE,
      importedAt: stats.generatedAt
    };

    if (!DRY) {
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, 'source.json'), `${JSON.stringify(sourceRecord, null, 2)}\n`);
    }

    manifest[ex.id] = {
      ...files,
      source: chosen.candidate.id,
      sourceName: chosen.candidate.name,
      license: SOURCE.license,
      licenseUrl: SOURCE.licenseUrl,
      sourceUrl: SOURCE.url,
      matchedBy: how,
      confidence: chosen.total,
      equipmentMatch: sanity.equipment,
      equipmentNote
    };
    stats[how === 'override' ? 'override' : 'automatic'] += 1;
  }

  if (!DRY) {
    fs.mkdirSync(path.dirname(MANIFEST_FILE), { recursive: true });
    fs.writeFileSync(MANIFEST_FILE, `${JSON.stringify(manifest, null, 2)}\n`);
    fs.mkdirSync(path.dirname(UNMATCHED_FILE), { recursive: true });
    fs.writeFileSync(UNMATCHED_FILE, `${JSON.stringify({ generatedAt: stats.generatedAt, count: unmatched.length, source: SOURCE, items: unmatched }, null, 2)}\n`);
    fs.writeFileSync(STATS_FILE, `${JSON.stringify(stats, null, 2)}\n`);
  }

  const mb = (n) => `${(n / 1024 / 1024).toFixed(2)} MB`;
  console.log(`> automatisch: ${stats.automatic}, per Override: ${stats.override}, offen: ${stats.unmatched}`);
  console.log(`> Bilder: ${stats.images}, ${mb(stats.bytesOriginal)} -> ${mb(stats.bytesOptimized)}`);
  if (DRY) console.log('> Probelauf: nichts geschrieben.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

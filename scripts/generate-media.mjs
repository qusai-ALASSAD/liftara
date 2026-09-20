#!/usr/bin/env node
/**
 * LIFTARA – Medien-Pipeline (Teil 2).
 *
 * Ergänzt zu den importierten Fotos alles, was lokal erzeugt werden kann:
 *   muscles.webp    Zielmuskel-Darstellung aus der eigenen Körperkarte
 *   equipment.webp  Geräte-/Aufbau-Darstellung aus der eigenen Zeichnung
 *   start/finish    für Übungen ohne frei lizenziertes Foto: eigene Posen-Grafik
 *   execution.webm  Lehrschleife aus Start- und Endbild, beschriftet, ohne Ton
 *
 * Aufruf: node scripts/generate-media.mjs [--only <id>] [--skip-video]
 */

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MEDIA_DIR = path.join(ROOT, 'public/media/exercises');
const MANIFEST_FILE = path.join(ROOT, 'src/content/mediaManifest.json');
const STATS_FILE = path.join(ROOT, 'media-reports/generate-stats.json');
const args = process.argv.slice(2);
const only = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;
const skipVideo = args.includes('--skip-video');

const OWN_WORK = {
  name: 'LIFTARA (eigene Grafik)',
  license: 'Projekteigene Grafik, frei weitergebbar',
  url: 'https://github.com/qusai-ALASSAD/liftara'
};

/* ------------------------------------------------------------------ */
/* Module der App laden                                                */
/* ------------------------------------------------------------------ */

async function bundle(entry, name) {
  const out = path.join(ROOT, 'node_modules/.cache', name);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    format: 'esm',
    platform: 'node',
    jsx: 'automatic',
    outfile: out,
    logLevel: 'silent',
    loader: { '.json': 'json' },
    external: ['react', 'react-dom', 'react-dom/server', 'react/jsx-runtime'],
    alias: { '@': path.join(ROOT, 'src') },
    define: { 'import.meta.env.BASE_URL': '"/"' }
  });
  return import(`file://${out}?v=${Date.now()}`);
}

/* ------------------------------------------------------------------ */
/* Rasterung                                                           */
/* ------------------------------------------------------------------ */

const TARGET_BYTES = 180 * 1024;

async function svgToWebp(svg, destFile, width) {
  let quality = 86;
  let buffer = null;
  for (let i = 0; i < 4; i += 1) {
    buffer = await sharp(Buffer.from(svg), { density: 200 })
      .resize({ width, withoutEnlargement: false })
      .flatten({ background: '#ffffff' })
      .webp({ quality, effort: 5 })
      .toBuffer();
    if (buffer.length <= TARGET_BYTES || quality <= 60) break;
    quality -= 10;
  }
  fs.mkdirSync(path.dirname(destFile), { recursive: true });
  fs.writeFileSync(destFile, buffer);
  return { bytes: buffer.length, sha256: createHash('sha256').update(buffer).digest('hex').slice(0, 16) };
}

/* ------------------------------------------------------------------ */
/* Lehrschleife (WebM)                                                 */
/* ------------------------------------------------------------------ */

const W = 640;
const H = 480;

/** Standbild auf einheitliche Größe bringen und mit Phasen-Banner versehen. */
async function framePng(srcFile, label, tmpFile) {
  const base = await sharp(srcFile)
    .resize({ width: W, height: H, fit: 'contain', background: '#ffffff' })
    .flatten({ background: '#ffffff' })
    .toBuffer();
  const banner = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
       <rect x="18" y="${H - 66}" rx="22" width="${label.length * 20 + 44}" height="44" fill="#FF6B00"/>
       <text x="${40}" y="${H - 36}" font-family="DejaVu Sans, sans-serif" font-size="24"
             font-weight="700" fill="#ffffff" letter-spacing="2">${label}</text>
     </svg>`
  );
  await sharp(base).composite([{ input: banner, top: 0, left: 0 }]).png().toFile(tmpFile);
}

function buildLoop(startPng, finishPng, destFile) {
  // start -> finish -> start, ohne Ton, VP9, als kurze Endlosschleife gedacht
  const filter =
    '[0][1]xfade=transition=slideleft:duration=0.35:offset=1.05[x];' +
    '[x][2]xfade=transition=slideright:duration=0.35:offset=2.1,format=yuv420p';
  execFileSync(
    'ffmpeg',
    [
      '-y', '-hide_banner', '-loglevel', 'error',
      '-loop', '1', '-framerate', '25', '-t', '1.4', '-i', startPng,
      '-loop', '1', '-framerate', '25', '-t', '1.4', '-i', finishPng,
      '-loop', '1', '-framerate', '25', '-t', '1.4', '-i', startPng,
      '-filter_complex', filter,
      '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '40', '-row-mt', '1',
      '-pix_fmt', 'yuv420p', '-an', '-sn',
      destFile
    ],
    { stdio: 'inherit' }
  );
}

/* ------------------------------------------------------------------ */
/* Hauptlauf                                                           */
/* ------------------------------------------------------------------ */

async function main() {
  const { EXERCISES } = await bundle(path.join(ROOT, 'src/content/exercises.ts'), 'liftara-exercises.mjs');
  const render = await bundle(path.join(ROOT, 'scripts/render-entry.tsx'), 'liftara-render.mjs');
  const { equipmentVisualFor, targetView } = await bundle(path.join(ROOT, 'src/content/media.ts'), 'liftara-mediamap.mjs');

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8'));
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liftara-media-'));
  const stats = {
    generatedAt: new Date().toISOString(),
    exercises: 0, muscles: 0, equipment: 0, poses: 0, videos: 0,
    bytes: { muscles: 0, equipment: 0, poses: 0, videos: 0 }
  };

  const list = only ? EXERCISES.filter((e) => e.id === only) : EXERCISES;

  for (const ex of list) {
    const dir = path.join(MEDIA_DIR, ex.id);
    fs.mkdirSync(dir, { recursive: true });
    const entry = manifest[ex.id] ?? {};
    const generated = [];

    // 1. Zielmuskeln
    const view = targetView(ex);
    const anatomySvg = render.renderAnatomy(view, ex.primary, ex.secondary, `${ex.name.en} – target muscles`);
    const muscles = await svgToWebp(anatomySvg, path.join(dir, 'muscles.webp'), 480);
    entry.muscleImage = `/media/exercises/${ex.id}/muscles.webp`;
    generated.push({ role: 'muscles', file: 'muscles.webp', view, ...muscles, origin: OWN_WORK.name });
    stats.muscles += 1;
    stats.bytes.muscles += muscles.bytes;

    // 2. Gerät / Aufbau
    const visual = equipmentVisualFor(ex);
    const equipmentSvg = render.renderEquipment(visual, `${ex.name.en} – equipment`);
    const equipment = await svgToWebp(equipmentSvg, path.join(dir, 'equipment.webp'), 800);
    entry.equipmentImage = `/media/exercises/${ex.id}/equipment.webp`;
    generated.push({ role: 'equipment', file: 'equipment.webp', visual, ...equipment, origin: OWN_WORK.name });
    stats.equipment += 1;
    stats.bytes.equipment += equipment.bytes;

    // 3. Start- und Endbild, falls kein Foto vorhanden ist
    for (const phase of ['start', 'finish']) {
      const key = phase === 'start' ? 'startImage' : 'finishImage';
      const target = path.join(dir, `${phase}.webp`);
      if (entry[key] && fs.existsSync(path.join(ROOT, 'public', entry[key].replace(/^\//, '')))) continue;
      const svg = render.renderPose(ex.id, phase, `${ex.name.en} – ${phase}`);
      if (!svg) continue;
      const info = await svgToWebp(svg, target, 800);
      entry[key] = `/media/exercises/${ex.id}/${phase}.webp`;
      generated.push({ role: phase, file: `${phase}.webp`, ...info, origin: OWN_WORK.name });
      stats.poses += 1;
      stats.bytes.poses += info.bytes;
    }

    // 4. Lehrschleife
    if (!skipVideo && entry.startImage && entry.finishImage) {
      const a = path.join(tmp, `${ex.id}-a.png`);
      const b = path.join(tmp, `${ex.id}-b.png`);
      await framePng(path.join(ROOT, 'public', entry.startImage.replace(/^\//, '')), 'START', a);
      await framePng(path.join(ROOT, 'public', entry.finishImage.replace(/^\//, '')), 'FINISH', b);
      const dest = path.join(dir, 'execution.webm');
      buildLoop(a, b, dest);
      const bytes = fs.statSync(dest).size;
      entry.executionVideo = `/media/exercises/${ex.id}/execution.webm`;
      entry.executionKind = 'instructional-loop';
      generated.push({ role: 'execution', file: 'execution.webm', bytes, origin: OWN_WORK.name, kind: 'instructional-loop' });
      stats.videos += 1;
      stats.bytes.videos += bytes;
    }

    manifest[ex.id] = entry;
    stats.exercises += 1;

    // source.json ergänzen, ohne die Import-Angaben zu verlieren
    const sourceFile = path.join(dir, 'source.json');
    const record = fs.existsSync(sourceFile) ? JSON.parse(fs.readFileSync(sourceFile, 'utf8')) : {
      liftaraId: ex.id, liftaraName: ex.name.en, files: []
    };
    record.generated = generated;
    record.generatedBy = OWN_WORK;
    record.generatedAt = stats.generatedAt;
    if (!record.dataset) record.dataset = OWN_WORK;
    fs.writeFileSync(sourceFile, `${JSON.stringify(record, null, 2)}\n`);
    process.stdout.write(`. ${ex.id}\n`);
  }

  fs.writeFileSync(MANIFEST_FILE, `${JSON.stringify(manifest, null, 2)}\n`);
  fs.mkdirSync(path.dirname(STATS_FILE), { recursive: true });
  fs.writeFileSync(STATS_FILE, `${JSON.stringify(stats, null, 2)}\n`);
  fs.rmSync(tmp, { recursive: true, force: true });

  const mb = (n) => `${(n / 1024 / 1024).toFixed(2)} MB`;
  console.log(`\n> ${stats.exercises} Übungen bearbeitet`);
  console.log(`> Muskelbilder ${stats.muscles} (${mb(stats.bytes.muscles)}), Gerätebilder ${stats.equipment} (${mb(stats.bytes.equipment)})`);
  console.log(`> eigene Posen ${stats.poses} (${mb(stats.bytes.poses)}), Lehrschleifen ${stats.videos} (${mb(stats.bytes.videos)})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

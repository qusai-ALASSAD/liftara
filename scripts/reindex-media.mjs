#!/usr/bin/env node
/**
 * Gleicht das Medien-Manifest mit den tatsächlich vorhandenen Dateien ab.
 * Nützlich nach einem unterbrochenen Lauf von generate-media.mjs.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MEDIA = path.join(ROOT, 'public/media/exercises');
const MANIFEST = path.join(ROOT, 'src/content/mediaManifest.json');
const FIELDS = [
  ['start.webp', 'startImage'],
  ['finish.webp', 'finishImage'],
  ['equipment.webp', 'equipmentImage'],
  ['muscles.webp', 'muscleImage'],
  ['execution.webm', 'executionVideo']
];

const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
let touched = 0;

for (const id of fs.readdirSync(MEDIA)) {
  const dir = path.join(MEDIA, id);
  if (!fs.statSync(dir).isDirectory()) continue;
  const entry = manifest[id] ?? {};
  for (const [file, key] of FIELDS) {
    const exists = fs.existsSync(path.join(dir, file));
    if (exists) entry[key] = `/media/exercises/${id}/${file}`;
    else delete entry[key];
  }
  if (entry.executionVideo) entry.executionKind = 'instructional-loop';
  manifest[id] = entry;
  touched += 1;
}

fs.writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`> Manifest abgeglichen: ${touched} Übungen`);

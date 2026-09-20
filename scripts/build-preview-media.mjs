#!/usr/bin/env node
/**
 * Erzeugt eine Vorschau-Variante des Medien-Manifests, in der die Fotos als
 * Data-URI eingebettet sind. Nur für den Einzeldatei-Build (`npm run build:preview`)
 * gedacht – die echte PWA lädt die Bilder ganz normal auf Abruf.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/content/mediaManifest.json'), 'utf8'));
const out = {};
let bytes = 0;

for (const [id, entry] of Object.entries(manifest)) {
  const copy = { ...entry };
  for (const [key, width] of [['startImage', 380], ['finishImage', 380], ['muscleImage', 260], ['equipmentImage', 300]]) {
    if (!entry[key]) continue;
    const file = path.join(ROOT, 'public', entry[key].replace(/^\//, ''));
    const buf = await sharp(file).resize({ width, withoutEnlargement: true }).webp({ quality: 58 }).toBuffer();
    bytes += buf.length;
    copy[key] = `data:image/webp;base64,${buf.toString('base64')}`;
  }
  if (entry.executionVideo) {
    const file = path.join(ROOT, 'public', entry.executionVideo.replace(/^\//, ''));
    const buf = fs.readFileSync(file);
    bytes += buf.length;
    copy.executionVideo = `data:video/webm;base64,${buf.toString('base64')}`;
  }
  out[id] = copy;
}

fs.writeFileSync(path.join(ROOT, 'src/content/mediaManifest.preview.json'), JSON.stringify(out));
console.log(`> Vorschau-Manifest: ${Object.keys(out).length} Übungen, ${(bytes / 1024 / 1024).toFixed(2)} MB Bilddaten`);

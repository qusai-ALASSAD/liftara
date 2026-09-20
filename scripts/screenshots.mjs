#!/usr/bin/env node
/**
 * Erstellt Bildschirmfotos der wichtigsten Ansichten aus dem Einzeldatei-Build.
 * Aufruf: node scripts/screenshots.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILE = `file://${path.join(ROOT, 'dist-preview/index.html')}`;
const OUT = path.join(ROOT, 'screenshots');
const CHROME = process.env.CHROME_PATH ?? '/opt/google/chrome/chrome';

const clickByText = async (page, text) =>
  page.evaluate((t) => {
    const el = [...document.querySelectorAll('button, a')].find((b) => b.textContent?.trim().includes(t));
    if (!el) return false;
    el.click();
    return true;
  }, text);

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function shot(page, name) {
  fs.mkdirSync(OUT, { recursive: true });
  await wait(900);
  await page.screenshot({ path: path.join(OUT, `${name}.png`) });
  console.log(`. ${name}.png`);
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  args: ['--no-sandbox', '--disable-gpu', '--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required']
});
const page = await browser.newPage();
await page.setViewport({ width: 420, height: 900, deviceScaleFactor: 2 });
await page.goto(FILE, { waitUntil: 'networkidle0' });
await wait(1200);

// Demo-Profil übernehmen
await clickByText(page, 'Demo-Profil verwenden');
await clickByText(page, 'Start');
await wait(1500);
await shot(page, '01-today');

await page.evaluate(() => { window.location.hash = '#/library'; });
await shot(page, '02-library');

await page.evaluate(() => { window.location.hash = '#/muscles'; });
await shot(page, '03-muscle-map');

await page.evaluate(() => { window.location.hash = '#/exercise/bench-press-barbell'; });
await wait(600);
await shot(page, '04-exercise-detail');
// Reiter über ihre Position ansteuern, damit die Sprache egal ist
const clickTab = (n) => page.evaluate((i) => {
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  tabs[i]?.click();
}, n);
await clickTab(1);
await shot(page, '05-exercise-target-muscles');
await clickTab(2);
await shot(page, '06-exercise-equipment');

// Training starten
await page.evaluate(() => { window.location.hash = '#/'; });
await wait(900);
// Große Haupt-Aktion auf der Startseite = Training starten
await page.evaluate(() => {
  const btn = [...document.querySelectorAll('button')].find((b) => b.className.includes('bg-brand-500') && b.className.includes('w-full'));
  btn?.click();
});
await wait(2500);
console.log('  hash nach Start:', await page.evaluate(() => location.hash));
await shot(page, '07-active-workout');
await page.evaluate(() => window.scrollBy(0, 420));
await shot(page, '07b-active-workout-sets');

// Arabische Ansicht
await page.evaluate(() => { window.location.hash = '#/profile'; });
await wait(800);
await clickByText(page, 'العربية');
await wait(900);
await shot(page, '08-profile-arabic');
await page.evaluate(() => { window.location.hash = '#/'; });
await shot(page, '09-today-arabic');
await page.evaluate(() => { window.location.hash = '#/library'; });
await shot(page, '10-library-arabic');

// Desktop-Ansicht
await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
await page.evaluate(() => { window.location.hash = '#/profile'; });
await wait(600);
await clickByText(page, 'Deutsch');
await page.evaluate(() => { window.location.hash = '#/'; });
await shot(page, '11-desktop-today');

await browser.close();

import { describe, expect, it } from 'vitest';
import { EXERCISES } from '@/content/exercises';
import { EQUIPMENT_VISUAL, equipmentVisualFor, targetView } from '@/content/media';
import { EQUIPMENT_VISUALS } from '@/components/EquipmentArt';
import { ALL_REGIONS, BACK_REGIONS, FRONT_REGIONS } from '@/content/anatomy';
import { MUSCLE_GROUPS } from '@/types';
import { resources } from '@/i18n';

describe('Bildmaterial je Übung', () => {
  it('ordnet jeder der 85 Übungen ausdrücklich ein Gerätebild zu', () => {
    const missing = EXERCISES.filter((ex) => !EQUIPMENT_VISUAL[ex.id]).map((ex) => ex.id);
    expect(missing).toEqual([]);
    expect(EXERCISES.length).toBe(85);
  });

  it('verweist nur auf existierende Illustrationen', () => {
    for (const ex of EXERCISES) {
      expect(EQUIPMENT_VISUALS).toContain(equipmentVisualFor(ex));
    }
  });

  it('nutzt nicht überall dasselbe Bild', () => {
    const used = new Set(EXERCISES.map((ex) => equipmentVisualFor(ex)));
    expect(used.size).toBeGreaterThanOrEqual(20);
  });

  it('liefert für jede Übung eine Zielmuskel-Ansicht mit mindestens einem Muskel', () => {
    for (const ex of EXERCISES) {
      expect(['front', 'back']).toContain(targetView(ex));
      expect(ex.primary.length).toBeGreaterThan(0);
    }
  });

  it('enthält keine verwaisten Zuordnungen', () => {
    const ids = new Set(EXERCISES.map((e) => e.id));
    const orphans = Object.keys(EQUIPMENT_VISUAL).filter((id) => !ids.has(id));
    expect(orphans).toEqual([]);
  });
});

describe('Anatomische Körperkarte', () => {
  it('deckt Vorder- und Rückansicht mit den geforderten Regionen ab', () => {
    const ids = ALL_REGIONS.map((r) => r.labelKey);
    for (const needed of [
      'chest', 'upperBack', 'lats', 'frontDelts', 'rearDelts', 'biceps', 'triceps',
      'forearms', 'abs', 'obliques', 'glutes', 'quads', 'hamstrings', 'calves'
    ]) {
      expect(ids).toContain(needed);
    }
    expect(FRONT_REGIONS.length).toBeGreaterThanOrEqual(8);
    expect(BACK_REGIONS.length).toBeGreaterThanOrEqual(8);
  });

  it('verweist nur auf bekannte Muskelgruppen', () => {
    for (const r of ALL_REGIONS) expect(MUSCLE_GROUPS).toContain(r.group);
  });

  it('beschriftet jede Region in allen drei Sprachen', () => {
    for (const locale of ['de', 'en', 'ar'] as const) {
      const anatomy = (resources[locale].translation as unknown as { anatomy: Record<string, string> }).anatomy;
      for (const r of ALL_REGIONS) {
        expect(anatomy[r.labelKey]).toBeTruthy();
      }
    }
  });

  it('enthält echte Pfaddaten statt Platzhalter', () => {
    for (const r of ALL_REGIONS) {
      expect(r.paths.length).toBeGreaterThan(0);
      for (const d of r.paths) expect(d.length).toBeGreaterThan(30);
    }
  });
});

/* ------------------------------------------------------------------ */
/* Importierte Fotos aus free-exercise-db                              */
/* ------------------------------------------------------------------ */

import fs from 'node:fs';
import path from 'node:path';
import { MEDIA_MANIFEST, mediaFor } from '@/content/media';
import unmatched from '../../media-reports/unmatched-report.json';

const PUBLIC = path.resolve(__dirname, '../../public');
const MUSCLE_MAP: Record<string, string[]> = {
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

const localPath = (webPath: string) => path.join(PUBLIC, webPath.replace(/^\//, ''));
const sourceRecord = (id: string) =>
  JSON.parse(fs.readFileSync(path.join(PUBLIC, 'media/exercises', id, 'source.json'), 'utf8'));

describe('Medienabdeckung aller 85 Übungen', () => {
  const unmatchedIds = new Set((unmatched as { items: { liftaraId: string }[] }).items.map((i) => i.liftaraId));

  it('hat Start- und Endbild für jede Übung', () => {
    const missing = EXERCISES.filter((ex) => {
      const m = mediaFor(ex);
      return !m.startImage || !m.finishImage;
    }).map((e) => e.id);
    expect(missing).toEqual([]);
  });

  it('hat ein Geräte-/Aufbaubild für jede Übung', () => {
    expect(EXERCISES.filter((ex) => !mediaFor(ex).equipmentImage).map((e) => e.id)).toEqual([]);
  });

  it('hat eine Zielmuskel-Darstellung für jede Übung', () => {
    for (const ex of EXERCISES) {
      const m = mediaFor(ex);
      expect(m.targetMuscleImage, ex.id).toBeTruthy();
      expect(['front', 'back']).toContain(m.targetMuscleView);
    }
  });

  it('hat eine Ausführungs-Schleife für jede Übung', () => {
    for (const ex of EXERCISES) {
      const m = mediaFor(ex);
      expect(m.executionVideo, ex.id).toMatch(/\.webm$/);
      expect(m.executionKind, ex.id).toBe('instructional-loop');
    }
  });

  it('verweist auf keine kaputten Pfade', () => {
    for (const [id, entry] of Object.entries(MEDIA_MANIFEST)) {
      for (const file of [entry.startImage, entry.finishImage, entry.executionVideo, entry.equipmentImage, entry.muscleImage]) {
        if (!file) continue;
        expect(fs.existsSync(localPath(file)), `${id}: ${file}`).toBe(true);
      }
      expect(fs.existsSync(path.join(PUBLIC, 'media/exercises', id, 'source.json')), id).toBe(true);
    }
  });

  it('bindet keine fremden Server ein', () => {
    for (const [id, entry] of Object.entries(MEDIA_MANIFEST)) {
      for (const file of [entry.startImage, entry.finishImage, entry.executionVideo, entry.equipmentImage, entry.muscleImage]) {
        if (!file) continue;
        expect(file.startsWith('/media/exercises/'), `${id}: ${file}`).toBe(true);
        expect(/^https?:/.test(file), `${id}: ${file}`).toBe(false);
      }
    }
  });

  it('liefert echte WebP-Dateien unter der Größengrenze', () => {
    for (const [id, entry] of Object.entries(MEDIA_MANIFEST)) {
      for (const file of [entry.startImage, entry.finishImage, entry.equipmentImage, entry.muscleImage]) {
        if (!file) continue;
        const buf = fs.readFileSync(localPath(file));
        expect(buf.subarray(0, 4).toString('ascii'), `${id} ${file}`).toBe('RIFF');
        expect(buf.subarray(8, 12).toString('ascii'), `${id} ${file}`).toBe('WEBP');
        expect(buf.length, `${id} ${file}`).toBeLessThanOrEqual(180 * 1024);
      }
    }
  });

  it('liefert tonlose WebM-Schleifen unter 2 MB', () => {
    for (const [id, entry] of Object.entries(MEDIA_MANIFEST)) {
      if (!entry.executionVideo) continue;
      const buf = fs.readFileSync(localPath(entry.executionVideo));
      // EBML-Kopf von Matroska/WebM
      expect(buf.subarray(0, 4).toString('hex'), id).toBe('1a45dfa3');
      expect(buf.length, id).toBeLessThanOrEqual(2 * 1024 * 1024);
      // Keine Audiospur: der Container darf das Audio-Codec-Kennzeichen nicht enthalten.
      expect(buf.includes(Buffer.from('A_OPUS')), id).toBe(false);
      expect(buf.includes(Buffer.from('A_VORBIS')), id).toBe(false);
    }
  });

  it('stammt ausschließlich aus freigegebenen Quellen', () => {
    // Zugelassen sind nur der gemeinfreie Datensatz und projekteigene Grafiken.
    for (const id of Object.keys(MEDIA_MANIFEST)) {
      const record = sourceRecord(id);
      const origins = new Set<string>();
      if ((record.files ?? []).length > 0) origins.add(record.dataset?.name ?? 'unbekannt');
      for (const g of record.generated ?? []) origins.add(g.origin);
      for (const origin of origins) {
        expect(['free-exercise-db', 'LIFTARA (eigene Grafik)'], `${id}: ${origin}`).toContain(origin);
      }
    }
  });

  it('dokumentiert Quelle und Lizenz für jedes fremde Asset', () => {
    for (const [id, entry] of Object.entries(MEDIA_MANIFEST)) {
      const record = sourceRecord(id);
      const imported = record.files ?? [];
      if (imported.length === 0) continue; // rein eigene Grafik
      expect(entry.license, id).toMatch(/Unlicense/i);
      expect(entry.licenseUrl, id).toMatch(/^https:\/\//);
      expect(record.dataset.url, id).toMatch(/^https:\/\//);
      expect(record.dataset.license, id).toMatch(/Unlicense/i);
      for (const f of imported) expect(f.sha256, id).toHaveLength(16);
    }
  });

  it('dokumentiert Herkunft und Lizenz für jedes selbst erzeugte Asset', () => {
    for (const id of Object.keys(MEDIA_MANIFEST)) {
      const record = sourceRecord(id);
      expect(record.generatedBy?.license, id).toBeTruthy();
      expect((record.generated ?? []).length, id).toBeGreaterThan(0);
    }
  });

  it('weist keine Quellübung mehr als zweimal zu', () => {
    const used: Record<string, string[]> = {};
    for (const [id, entry] of Object.entries(MEDIA_MANIFEST)) {
      if (!entry.source) continue;
      (used[entry.source] ??= []).push(id);
    }
    expect(Object.entries(used).filter(([, ids]) => ids.length > 2)).toEqual([]);
  });

  it('ordnet nur fachlich passende Zielmuskeln zu', () => {
    for (const ex of EXERCISES) {
      const record = sourceRecord(ex.id);
      if (!record.sourceId) continue; // eigene Grafik, kein Fremdtreffer
      const wanted = new Set(ex.primary.flatMap((m) => MUSCLE_MAP[m] ?? []));
      if (wanted.size === 0) continue;
      const all = [...(record.sourcePrimaryMuscles ?? []), ...(record.sourceSecondaryMuscles ?? [])];
      expect(all.some((m: string) => wanted.has(m)), `${ex.id} -> ${record.sourceId}`).toBe(true);
    }
  });

  it('nutzt für jede Übung die passende Geräte-Zeichnung', () => {
    for (const ex of EXERCISES) {
      const record = sourceRecord(ex.id);
      const equipment = (record.generated ?? []).find((g: { role: string }) => g.role === 'equipment');
      expect(equipment?.visual, ex.id).toBe(equipmentVisualFor(ex));
    }
  });

  it('dokumentiert jede Equipment-Abweichung ausdrücklich', () => {
    for (const [id, entry] of Object.entries(MEDIA_MANIFEST)) {
      if (entry.equipmentMatch !== false) continue;
      expect(entry.matchedBy, id).toBe('override');
      expect(entry.equipmentNote, id).toBeTruthy();
    }
  });

  it('begründet jeden Fall ohne Foto im Unmatched-Report', () => {
    for (const item of (unmatched as { items: { liftaraId: string; reason: string }[] }).items) {
      expect(item.reason).toBeTruthy();
      expect(EXERCISES.some((e) => e.id === item.liftaraId)).toBe(true);
      // Ohne Foto, aber mit eigener Posengrafik versorgt:
      const record = sourceRecord(item.liftaraId);
      expect((record.files ?? []).length).toBe(0);
      expect((record.generated ?? []).some((g: { role: string }) => g.role === 'start')).toBe(true);
    }
    expect(unmatchedIds.size).toBeGreaterThan(0);
  });
});

import type { ExportBundle, ExportPhoto, Settings, Workout } from '@/types';
import {
  achievementRepo, measurementRepo, photoRepo, profileRepo, programStateRepo, recordRepo, workoutRepo, wipeAllData
} from '@/db/repositories';
import { EXERCISE_MAP } from '@/content/exercises';
import { dayKey } from './date';

export async function buildExportBundle(settings: Settings): Promise<ExportBundle> {
  const [profile, workouts, measurements, records, achievements, programStates, storedPhotos] = await Promise.all([
    profileRepo.get(), workoutRepo.all(), measurementRepo.all(),
    recordRepo.all(), achievementRepo.all(), programStateRepo.all(), photoRepo.all()
  ]);
  const photos = await Promise.all(storedPhotos.map(async (photo): Promise<ExportPhoto> => ({
    id: photo.id,
    date: photo.date,
    note: photo.note,
    dataUrl: await blobToDataUrl(photo.blob)
  })));
  return {
    app: 'liftara', version: 1, exportedAt: Date.now(),
    profile: profile ?? null, workouts, measurements, records, achievements, programStates, photos, settings
  };
}

async function blobToDataUrl(blob: Blob): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return `data:${blob.type || 'application/octet-stream'};base64,${btoa(binary)}`;
}

function dataUrlToBlob(dataUrl: string): Blob {
  const match = /^data:([^;,]+)?(;base64)?,(.*)$/s.exec(dataUrl);
  if (!match) throw new Error('invalid-photo');
  const mime = match[1] || 'application/octet-stream';
  const bytes = match[2] ? atob(match[3]!) : decodeURIComponent(match[3]!);
  const array = Uint8Array.from(bytes, (char) => char.charCodeAt(0));
  return new Blob([array], { type: mime });
}

export function workoutsToCsv(workouts: Workout[]): string {
  const head = ['date', 'workout', 'exercise_id', 'exercise', 'set', 'type', 'weight_kg', 'reps', 'rir', 'volume_kg'];
  const rows: string[][] = [head];
  for (const w of workouts.filter((x) => x.status === 'completed').sort((a, b) => a.startedAt - b.startedAt)) {
    for (const ex of w.exercises) {
      ex.sets.forEach((s, idx) => {
        if (!s.done) return;
        rows.push([
          dayKey(w.startedAt), w.title.en, ex.exerciseId, EXERCISE_MAP[ex.exerciseId]?.name.en ?? ex.exerciseId,
          String(idx + 1), s.warmup ? 'warmup' : 'working', String(s.weight), String(s.reps),
          s.rir === undefined ? '' : String(s.rir), String(Math.round(s.weight * s.reps))
        ]);
      });
    }
  }
  return rows.map((r) => r.map((c) => (/[",;\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c)).join(',')).join('\n');
}

export function parseBundle(json: string): ExportBundle {
  const data = JSON.parse(json) as Partial<ExportBundle>;
  if (data.app !== 'liftara' || data.version !== 1) throw new Error('invalid-bundle');
  if (!Array.isArray(data.workouts)) throw new Error('invalid-bundle');
  if (!data.settings || typeof data.settings !== 'object') throw new Error('invalid-bundle');
  return {
    app: 'liftara', version: 1, exportedAt: data.exportedAt ?? Date.now(),
    profile: data.profile ?? null,
    workouts: data.workouts,
    measurements: data.measurements ?? [],
    records: data.records ?? [],
    achievements: data.achievements ?? [],
    programStates: data.programStates ?? [],
    photos: data.photos ?? [],
    settings: data.settings as ExportBundle['settings']
  };
}

export async function importBundle(bundle: ExportBundle, { replace = true } = {}) {
  if (replace) await wipeAllData();
  if (bundle.profile) await profileRepo.put(bundle.profile);
  for (const w of bundle.workouts) await workoutRepo.put(w);
  for (const m of bundle.measurements) await measurementRepo.put(m);
  for (const r of bundle.records) await recordRepo.put(r);
  for (const a of bundle.achievements) await achievementRepo.put(a);
  for (const p of bundle.programStates) await programStateRepo.put(p);
  for (const p of bundle.photos) {
    await photoRepo.put({ id: p.id, date: p.date, note: p.note, blob: dataUrlToBlob(p.dataUrl) });
  }
}

export function downloadFile(content: string, filename: string, mime = 'application/json') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

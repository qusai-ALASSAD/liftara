import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import { Award, Download, Trash2, Upload, Lock } from 'lucide-react';
import type { ProgressPhoto } from '@/types';
import { Badge, Button, Card, Dialog, EmptyState, Input, SectionTitle, Select, Stat } from '@/components/ui';
import { Page } from '@/components/Layout';
import { AdBanner, RewardedAdCard } from '@/components/AdSlot';
import { useAppStore, rewardUnlockUntil } from '@/store/appStore';
import { photoRepo } from '@/db/repositories';
import { EXERCISE_MAP } from '@/content/exercises';
import { MUSCLE_GROUPS } from '@/types';
import {
  currentStreak, estimate1RM, longestStreak, setsPerMuscle, workoutVolume
} from '@/lib/stats';
import { hasFeature } from '@/lib/premium';
import { buildExportBundle, downloadFile, importBundle, parseBundle, workoutsToCsv } from '@/lib/exportImport';
import { DAY_MS, dayKey, formatDate, startOfDay } from '@/lib/date';
import { displayWeight, formatNumber, toKg, weightUnit } from '@/lib/units';
import { localized, muscleLabel } from '@/lib/titles';
import { uid } from '@/lib/id';
import { isRtl } from '@/i18n';
import type { Locale } from '@/types';

export default function ProgressScreen() {
  const { t, i18n } = useTranslation();
  const workouts = useAppStore((s) => s.workouts);
  const measurements = useAppStore((s) => s.measurements);
  const records = useAppStore((s) => s.records);
  const achievements = useAppStore((s) => s.achievements);
  const settings = useAppStore((s) => s.settings);
  const profile = useAppStore((s) => s.profile);
  const addMeasurement = useAppStore((s) => s.addMeasurement);
  const deleteEverything = useAppStore((s) => s.deleteEverything);
  const refresh = useAppStore((s) => s.refresh);

  const [exerciseId, setExerciseId] = useState<string>('');
  const [weightInput, setWeightInput] = useState('');
  const [waistInput, setWaistInput] = useState('');
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  const units = settings.units;
  const unit = weightUnit(units);
  const rtl = isRtl((i18n.language as Locale) ?? 'en');
  const completed = useMemo(() => workouts.filter((w) => w.status === 'completed'), [workouts]);
  const advanced = hasFeature('advancedAnalytics', { premium: settings.premium, rewardUnlockUntil: rewardUnlockUntil(settings) });

  useEffect(() => {
    void photoRepo.all().then(setPhotos);
  }, []);

  const totalVolume = useMemo(() => completed.reduce((s, w) => s + workoutVolume(w), 0), [completed]);
  const monthStart = useMemo(() => {
    const d = new Date();
    d.setDate(1);
    return startOfDay(d);
  }, []);
  const thisMonth = completed.filter((w) => w.startedAt >= monthStart).length;

  const weightSeries = useMemo(
    () =>
      measurements
        .filter((m) => typeof m.weightKg === 'number')
        .map((m) => ({ date: dayKey(m.date), value: displayWeight(m.weightKg!, units) })),
    [measurements, units]
  );

  const volumeSeries = useMemo(
    () =>
      [...completed]
        .sort((a, b) => a.startedAt - b.startedAt)
        .slice(-14)
        .map((w) => ({ date: dayKey(w.startedAt), value: Math.round(displayWeight(workoutVolume(w), units)) })),
    [completed, units]
  );

  const trainedExercises = useMemo(() => {
    const ids = new Set<string>();
    completed.forEach((w) => w.exercises.forEach((e) => { if (e.sets.some((s) => s.done && !s.warmup)) ids.add(e.exerciseId); }));
    return [...ids];
  }, [completed]);

  const exerciseSeries = useMemo(() => {
    const id = exerciseId || trainedExercises[0];
    if (!id) return [];
    return [...completed]
      .sort((a, b) => a.startedAt - b.startedAt)
      .flatMap((w) => {
        const ex = w.exercises.find((e) => e.exerciseId === id);
        if (!ex) return [];
        const best = ex.sets.filter((s) => s.done && !s.warmup).reduce((m, s) => Math.max(m, estimate1RM(s.weight, s.reps)), 0);
        return best > 0 ? [{ date: dayKey(w.startedAt), value: displayWeight(best, units) }] : [];
      });
  }, [completed, exerciseId, trainedExercises, units]);

  const muscleSeries = useMemo(() => {
    const map = setsPerMuscle(completed);
    return MUSCLE_GROUPS.filter((m) => (map[m] ?? 0) > 0).map((m) => ({
      muscle: muscleLabel(m, i18n.language),
      sets: Math.round(map[m] ?? 0)
    }));
  }, [completed, i18n.language]);

  const monthDays = useMemo(() => {
    const d = new Date();
    const days = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const trained = new Set(completed.map((w) => dayKey(w.startedAt)));
    return Array.from({ length: days }, (_, i) => {
      const day = monthStart + i * DAY_MS;
      return { day, label: i + 1, trained: trained.has(dayKey(day)) };
    });
  }, [completed, monthStart]);

  const saveMeasurement = async () => {
    const w = Number(weightInput.replace(',', '.'));
    const waist = Number(waistInput.replace(',', '.'));
    if (!w && !waist) return;
    await addMeasurement({
      id: uid('m'),
      date: Date.now(),
      weightKg: w ? toKg(w, units) : undefined,
      waist: waist || undefined
    });
    setWeightInput('');
    setWaistInput('');
    setMessage(t('common.saved'));
  };

  const addPhoto = async (file: File) => {
    await photoRepo.put({ id: uid('photo'), date: Date.now(), blob: file });
    setPhotos(await photoRepo.all());
  };

  const doImport = async (file: File) => {
    try {
      const bundle = parseBundle(await file.text());
      await importBundle(bundle);
      await refresh();
      setMessage(t('progress.importSuccess'));
    } catch {
      setMessage(t('progress.importError'));
    }
  };

  const chart = (data: { date: string; value: number }[], color: string, label: string) =>
    data.length === 0 ? (
      <p className="py-6 text-center text-sm muted">{t('progress.noWorkouts')}</p>
    ) : (
      <div className="h-48 w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--hairline))" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} reversed={rtl} />
            <YAxis tick={{ fontSize: 11 }} width={44} orientation={rtl ? 'right' : 'left'} />
            <Tooltip formatter={(v) => [`${v}`, label]} />
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2.4} dot={{ r: 2.5 }} name={label} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );

  return (
    <Page title={t('progress.title')}>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label={t('progress.totalWorkouts')} value={completed.length} />
        <Stat label={t('progress.totalVolume')} value={`${formatNumber(displayWeight(totalVolume, units))} ${unit}`} />
        <Stat label={t('today.streak')} value={currentStreak(completed)} sub={`${t('progress.streakBest')}: ${longestStreak(completed)}`} />
        <Stat label={t('progress.consistency')} value={thisMonth} sub={t('progress.workoutsThisMonth', { count: thisMonth })} />
      </div>

      <SectionTitle>{t('progress.calendar')}</SectionTitle>
      <Card>
        <ul className="grid grid-cols-7 gap-1.5">
          {monthDays.map((d) => (
            <li
              key={d.day}
              className={`flex h-9 items-center justify-center rounded-lg text-xs font-medium ${
                d.trained ? 'bg-success-500 text-white' : 'bg-ink-100 muted dark:bg-ink-800'
              }`}
            >
              {d.label}
            </li>
          ))}
        </ul>
      </Card>

      <SectionTitle>{t('progress.bodyWeight')}</SectionTitle>
      <Card>
        {chart(weightSeries, 'rgb(31 65 214)', `${t('progress.bodyWeight')} (${unit})`)}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1 block text-xs muted" htmlFor="m-weight">{t('progress.addWeight')} ({unit})</label>
            <Input id="m-weight" inputMode="decimal" value={weightInput} onChange={(e) => setWeightInput(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs muted" htmlFor="m-waist">{t('progress.measurements')} ({t('common.cm')})</label>
            <Input id="m-waist" inputMode="decimal" value={waistInput} onChange={(e) => setWaistInput(e.target.value)} />
          </div>
        </div>
        <Button className="mt-3" size="sm" onClick={() => void saveMeasurement()}>{t('progress.addMeasurement')}</Button>
        {profile && (
          <p className="mt-2 text-xs muted">
            {t('today.weightCard')}: {displayWeight(profile.weightKg, units)} {unit} → {displayWeight(profile.goalWeightKg, units)} {unit}
          </p>
        )}
      </Card>

      <SectionTitle>{t('progress.volumeChart')}</SectionTitle>
      <Card>{chart(volumeSeries, 'rgb(22 145 96)', `${t('common.volume')} (${unit})`)}</Card>

      <SectionTitle>{t('progress.perExercise')}</SectionTitle>
      <Card>
        {advanced ? (
          <>
            <label className="mb-1 block text-xs muted" htmlFor="ex-select">{t('progress.selectExercise')}</label>
            <Select id="ex-select" value={exerciseId || trainedExercises[0] || ''} onChange={(e) => setExerciseId(e.target.value)}>
              {trainedExercises.length === 0 && <option value="">{t('common.none')}</option>}
              {trainedExercises.map((id) => (
                <option key={id} value={id}>{EXERCISE_MAP[id] ? localized(EXERCISE_MAP[id]!.name, i18n.language) : id}</option>
              ))}
            </Select>
            <div className="mt-3">{chart(exerciseSeries, 'rgb(31 65 214)', `${t('progress.e1rm')} (${unit})`)}</div>
            <p className="mt-2 text-xs muted">{t('progress.e1rmNote')}</p>
          </>
        ) : (
          <LockedAnalytics />
        )}
      </Card>

      <SectionTitle>{t('progress.setsPerMuscle')}</SectionTitle>
      <Card>
        {muscleSeries.length === 0 ? (
          <p className="py-6 text-center text-sm muted">{t('progress.noWorkouts')}</p>
        ) : (
          <div className="h-56 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={muscleSeries} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--hairline))" />
                <XAxis dataKey="muscle" tick={{ fontSize: 10 }} interval={0} angle={-35} textAnchor="end" height={60} reversed={rtl} />
                <YAxis tick={{ fontSize: 11 }} width={32} orientation={rtl ? 'right' : 'left'} />
                <Tooltip />
                <Bar dataKey="sets" fill="rgb(31 65 214)" radius={[6, 6, 0, 0]} name={t('common.sets')} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      <SectionTitle>{t('progress.records')}</SectionTitle>
      {records.length === 0 ? (
        <EmptyState title={t('progress.noRecords')} />
      ) : (
        <Card>
          <ul className="space-y-2 text-sm">
            {[...records].sort((a, b) => b.date - a.date).slice(0, 12).map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-2">
                <span className="truncate">{EXERCISE_MAP[r.exerciseId] ? localized(EXERCISE_MAP[r.exerciseId]!.name, i18n.language) : r.exerciseId}</span>
                <span className="shrink-0 muted">{displayWeight(r.weight, units)} {unit} × {r.reps} · {t('progress.e1rm')} {displayWeight(r.estimated1RM, units)}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <SectionTitle>{t('progress.achievements')}</SectionTitle>
      {achievements.length === 0 ? (
        <EmptyState title={t('common.empty')} />
      ) : (
        <ul className="grid grid-cols-2 gap-2">
          {achievements.map((a) => (
            <Card key={a.id} as="li">
              <Award className="h-5 w-5 text-success-500" aria-hidden />
              <p className="mt-1 font-semibold">{t(`achievements.${a.id}`)}</p>
              <p className="text-xs muted">{formatDate(a.unlockedAt, i18n.language)}</p>
            </Card>
          ))}
        </ul>
      )}

      <SectionTitle>{t('progress.photos')}</SectionTitle>
      <Card>
        <p className="text-sm muted">{t('progress.photosLocal')}</p>
        <input
          ref={photoRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) void addPhoto(f); e.target.value = ''; }}
        />
        <Button size="sm" variant="secondary" className="mt-3" onClick={() => photoRef.current?.click()}>{t('progress.addPhoto')}</Button>
        {photos.length > 0 && (
          <ul className="mt-3 grid grid-cols-3 gap-2">
            {photos.slice(0, 6).map((p) => (
              <li key={p.id}>
                <img src={URL.createObjectURL(p.blob)} alt={formatDate(p.date, i18n.language)} className="h-28 w-full rounded-xl object-cover" />
              </li>
            ))}
          </ul>
        )}
      </Card>

      <SectionTitle>{t('progress.dataTitle')}</SectionTitle>
      <Card>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={() => downloadFile(workoutsToCsv(workouts), 'liftara-workouts.csv', 'text/csv')}>
            <Download className="h-4 w-4" aria-hidden />{t('progress.exportCsv')}
          </Button>
          <Button
            size="sm" variant="secondary"
            onClick={async () => downloadFile(JSON.stringify(await buildExportBundle(settings), null, 2), 'liftara-backup.json')}
          >
            <Download className="h-4 w-4" aria-hidden />{t('progress.exportAll')}
          </Button>
          <input
            ref={fileRef} type="file" accept="application/json" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) void doImport(f); e.target.value = ''; }}
          />
          <Button size="sm" variant="secondary" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4" aria-hidden />{t('progress.import')}
          </Button>
          <Button size="sm" variant="danger" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="h-4 w-4" aria-hidden />{t('progress.deleteAll')}
          </Button>
        </div>
        {message && <p className="mt-3 text-sm text-success-600" role="status">{message}</p>}
      </Card>

      <div className="mt-6">
        <AdBanner placement="bannerHome" />
      </div>

      <Dialog
        open={deleteOpen}
        title={t('progress.deleteAll')}
        onClose={() => setDeleteOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteOpen(false)}>{t('common.cancel')}</Button>
            <Button variant="danger" onClick={async () => { await deleteEverything(); setDeleteOpen(false); }}>{t('common.delete')}</Button>
          </>
        }
      >
        {t('progress.deleteAllConfirm')}
      </Dialog>
    </Page>
  );
}

function LockedAnalytics() {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Lock className="h-4 w-4 text-brand-500" aria-hidden />
        <p className="text-sm font-semibold">{t('profile.premiumDesc')}</p>
        <Badge tone="warn">{t('common.premium')}</Badge>
      </div>
      <RewardedAdCard />
    </div>
  );
}

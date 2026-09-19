import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Check, ChevronLeft, ChevronRight, MoreHorizontal, Plus, Repeat2, SkipForward, Timer, Trash2, X } from 'lucide-react';
import type { SetLog } from '@/types';
import { Badge, Button, Card, Dialog, Input, Progress } from '@/components/ui';
import { ExerciseThumb, InstructionsBlock, TargetMuscleImage, exerciseName } from '@/components/ExerciseInfo';
import { ExercisePhoto, ExerciseVideo } from '@/components/ExerciseMediaView';
import { useAppStore } from '@/store/appStore';
import { useSessionStore } from '@/store/sessionStore';
import { EXERCISE_MAP } from '@/content/exercises';
import { mediaFor } from '@/content/media';
import { replacementOptions } from '@/lib/planGenerator';
import { exerciseHistory, suggestProgression } from '@/lib/progression';
import { displayWeight, toKg, weightUnit } from '@/lib/units';
import { formatDuration } from '@/lib/date';
import { localized, muscleLabel } from '@/lib/titles';

export default function WorkoutScreen() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const workout = useSessionStore((s) => s.workout);
  const index = useSessionStore((s) => s.activeIndex);
  const setIndex = useSessionStore((s) => s.setActiveIndex);
  const rest = useSessionStore((s) => s.rest);
  const session = useSessionStore();
  const profile = useAppStore((s) => s.profile);
  const units = useAppStore((s) => s.settings.units);
  const allWorkouts = useAppStore((s) => s.workouts);

  const [replaceOpen, setReplaceOpen] = useState(false);
  const [finishOpen, setFinishOpen] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [rejected, setRejected] = useState<string[]>([]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!rest) return;
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, [rest]);

  useEffect(() => {
    if (!workout) navigate('/', { replace: true });
  }, [workout, navigate]);

  const current = workout?.exercises[index];
  const meta = current ? EXERCISE_MAP[current.exerciseId] : undefined;

  const history = useMemo(
    () => (current ? exerciseHistory(allWorkouts.filter((w) => w.id !== workout?.id), current.exerciseId) : []),
    [allWorkouts, current, workout?.id]
  );
  const suggestion = useMemo(
    () => (meta && current ? suggestProgression(meta, current.repRange, history) : null),
    [meta, current, history]
  );

  if (!workout || !current || !meta || !profile) return null;

  const unit = weightUnit(units);
  const media = mediaFor(meta);
  const total = workout.exercises.length;
  const workingSets = current.sets.filter((s) => !s.warmup);
  const doneSets = workingSets.filter((s) => s.done).length;
  const restLeft = rest ? Math.max(0, rest.endsAt - now) : 0;
  const showIncrease =
    suggestion?.action === 'increase' &&
    suggestion.suggestedWeight !== current.suggestedWeight &&
    !rejected.includes(current.exerciseId);

  const alternatives = replacementOptions(current.exerciseId, profile, workout.exercises.map((e) => e.exerciseId));

  const finish = async () => {
    const done = await session.finish();
    setFinishOpen(false);
    if (done) navigate(`/summary/${done.id}`, { replace: true });
  };

  return (
    <div className="min-h-screen pb-40">
      {/* Kopfzeile bleibt sichtbar, damit Beenden und Fortschritt immer erreichbar sind. */}
      <header className="sticky top-0 z-30 border-b hairline bg-[rgb(var(--surface-raised))]/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <button
            aria-label={t('today.discard')}
            onClick={() => setDiscardOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-ink-500 hover:text-red-600"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium muted">{localized(workout.title, i18n.language)}</p>
            <p className="text-sm font-semibold">{t('workout.progress', { current: index + 1, total })}</p>
          </div>
          <Button size="sm" onClick={() => setFinishOpen(true)}>{t('workout.finishWorkout')}</Button>
        </div>
        <div className="mx-auto max-w-2xl px-4 pb-2">
          <Progress value={((index + 1) / total) * 100} label={t('workout.progress', { current: index + 1, total })} />
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 pt-4">
        {/* Große Bildfläche: Ausführung, daneben Zielmuskel und Gerät. */}
        <div className="media-frame flex h-52 items-center gap-2 p-3 sm:h-64">
          {/* Ausführung läuft sofort, daneben direkt die Zielmuskeln – ohne Zusatzklick. */}
          <div className="h-full min-w-0 flex-[2]">
            <ExerciseVideo
              src={media.executionVideo}
              poster={media.startImage}
              ex={meta}
              autoStart
              alt={t('exercise.altExecution', { name: exerciseName(meta, i18n.language) })}
            />
          </div>
          <div className="h-full w-20 shrink-0 rounded-xl bg-white/70 p-1 dark:bg-ink-900/40">
            <TargetMuscleImage ex={meta} />
          </div>
          <div className="hidden h-full w-20 shrink-0 rounded-xl bg-white/70 p-1 sm:block dark:bg-ink-900/40">
            <ExercisePhoto src={media.equipmentImage} ex={meta} alt={t('exercise.altEquipment', { name: exerciseName(meta, i18n.language) })} />
          </div>
        </div>

        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-display text-xl font-bold leading-tight">{exerciseName(meta, i18n.language)}</h1>
            <p className="mt-1 text-sm font-medium text-brand-600 dark:text-brand-300">
              {meta.primary.map((m) => muscleLabel(m, i18n.language)).join(' · ')}
            </p>
            <p className="mt-0.5 text-xs muted">
              {current.plannedSets} × {current.repRange[0]}–{current.repRange[1]} · {t('common.rest')} {current.restSec}s
              {history.length > 0
                ? ` · ${t('workout.previous')} ${displayWeight(history[0]!.weight, units)} ${unit}`
                : ` · ${t('workout.noPrevious')}`}
            </p>
          </div>
          {current.skipped && <Badge tone="warn">{t('workout.skipped')}</Badge>}
        </div>

        {showIncrease && suggestion && (
          <div className="mt-4 rounded-2xl bg-success-50 p-4 dark:bg-success-700/20">
            <p className="text-sm font-semibold">{t('workout.increaseTitle')}</p>
            <p className="mt-1 text-sm">
              {t('workout.increaseText', {
                from: displayWeight(suggestion.currentWeight, units),
                to: displayWeight(suggestion.suggestedWeight, units),
                unit
              })}
            </p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" onClick={() => session.applySuggestedWeight(index, suggestion.suggestedWeight)}>{t('workout.increaseAccept')}</Button>
              <Button size="sm" variant="ghost" onClick={() => setRejected((r) => [...r, current.exerciseId])}>{t('workout.increaseReject')}</Button>
            </div>
          </div>
        )}

        {/* Satztabelle: bewusst ohne Rahmenwerk, große Felder, eine orange Aktion. */}
        <Card className="mt-4 p-3">
          <div className="grid grid-cols-[3.2rem_1fr_1fr_3rem_3rem] items-center gap-2 px-1 pb-2 text-[11px] font-semibold uppercase tracking-wide muted">
            <span>{t('common.set')}</span>
            <span>{t('common.weight')} ({unit})</span>
            <span>{t('common.reps')}</span>
            <span className="text-center">{t('workout.rirShort')}</span>
            <span />
          </div>
          <ul className="space-y-1.5">
            {current.sets.map((s, i) => (
              <SetRow
                key={s.id}
                set={s}
                number={current.sets.slice(0, i + 1).filter((x) => !x.warmup).length}
                value={displayWeight(s.weight, units)}
                onWeight={(v) => session.updateSet(index, s.id, { weight: toKg(v, units) })}
                onReps={(v) => session.updateSet(index, s.id, { reps: v })}
                onRir={(v) => session.updateSet(index, s.id, { rir: v })}
                onToggle={() => session.toggleDone(index, s.id)}
                onRemove={() => session.removeSet(index, s.id)}
                labels={{
                  warmup: t('workout.warmupShort'),
                  weight: t('common.weight'),
                  reps: t('common.reps'),
                  rir: t('workout.rir'),
                  done: t('workout.logSet'),
                  remove: t('workout.removeSet')
                }}
              />
            ))}
          </ul>
          <div className="mt-3 flex items-center justify-between gap-2">
            <Button size="sm" variant="secondary" onClick={() => session.addSet(index)}>
              <Plus className="h-4 w-4" aria-hidden />{t('workout.addSet')}
            </Button>
            <span className="text-xs font-medium muted">{doneSets}/{workingSets.length} {t('common.sets')}</span>
            <Button size="sm" variant="ghost" onClick={() => setMoreOpen(true)}>
              <MoreHorizontal className="h-4 w-4" aria-hidden />{t('common.more')}
            </Button>
          </div>
        </Card>

        <Card className="mt-3">
          <label className="mb-1.5 block text-sm font-semibold" htmlFor="ex-notes">{t('workout.exerciseNotes')}</label>
          <Input
            id="ex-notes"
            value={current.notes ?? ''}
            onChange={(e) => session.setExerciseNotes(index, e.target.value)}
            placeholder={t('common.notes')}
          />
          <div className="mt-3 border-t pt-1 hairline">
            <InstructionsBlock ex={meta} collapsible />
          </div>
        </Card>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label={t('workout.title')}>
          {workout.exercises.map((e, i) => {
            const m = EXERCISE_MAP[e.exerciseId];
            if (!m) return null;
            return (
              <button
                key={e.exerciseId + i}
                role="tab"
                aria-selected={i === index}
                onClick={() => setIndex(i)}
                className={`w-24 shrink-0 rounded-2xl p-1 text-[10px] font-semibold transition ${
                  i === index ? 'bg-brand-500 text-white' : e.skipped ? 'bg-ink-100 muted line-through dark:bg-ink-800' : 'bg-ink-100 dark:bg-ink-800'
                }`}
              >
                <ExerciseThumb ex={m} className="h-10 w-full" />
                <span className="mt-1 block truncate px-1">{exerciseName(m, i18n.language)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fußzeile: Navigation und Pausentimer immer erreichbar. */}
      <div className="safe-bottom fixed bottom-0 start-0 end-0 z-40 border-t hairline bg-[rgb(var(--surface-raised))]/97 backdrop-blur">
        {rest && restLeft > 0 && (
          <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 pt-3" role="status">
            <Timer className="h-5 w-5 shrink-0 text-brand-500" aria-hidden />
            <span className="font-display text-lg font-bold tabular-nums">{formatDuration(restLeft)}</span>
            <span className="flex-1"><Progress value={100 - (restLeft / (rest.total * 1000)) * 100} label={t('workout.restTimer')} /></span>
            <Button size="sm" variant="ghost" onClick={() => session.stopRest()}>{t('workout.skipRest')}</Button>
          </div>
        )}
        <div className="mx-auto flex max-w-2xl items-center gap-2 px-4 py-3">
          <Button variant="outline" size="lg" disabled={index === 0} onClick={() => setIndex(index - 1)} aria-label={t('workout.previousExercise')}>
            <ChevronLeft className="h-5 w-5 rtl:rotate-180" aria-hidden />
          </Button>
          <Button
            size="lg"
            className="flex-1"
            onClick={() => {
              const next = current.sets.find((s) => !s.done);
              if (next) session.toggleDone(index, next.id);
              else if (index < total - 1) setIndex(index + 1);
            }}
          >
            <Check className="h-5 w-5" aria-hidden />
            {current.sets.some((s) => !s.done) ? t('workout.completeSet') : t('workout.nextExercise')}
          </Button>
          <Button variant="outline" size="lg" disabled={index >= total - 1} onClick={() => setIndex(index + 1)} aria-label={t('workout.nextExercise')}>
            <ChevronRight className="h-5 w-5 rtl:rotate-180" aria-hidden />
          </Button>
        </div>
      </div>

      <Dialog
        open={moreOpen}
        title={t('common.more')}
        onClose={() => setMoreOpen(false)}
        footer={<Button variant="ghost" onClick={() => setMoreOpen(false)}>{t('common.close')}</Button>}
      >
        <div className="flex flex-col gap-2">
          <Button variant="outline" onClick={() => { session.startRest(current.exerciseId, current.restSec); setMoreOpen(false); }}>
            <Timer className="h-4 w-4" aria-hidden />{t('workout.startRest')}
          </Button>
          <Button variant="outline" onClick={() => { setMoreOpen(false); setReplaceOpen(true); }}>
            <Repeat2 className="h-4 w-4" aria-hidden />{t('workout.replaceExercise')}
          </Button>
          <Button variant="outline" onClick={() => { session.skipExercise(index); setMoreOpen(false); }}>
            <SkipForward className="h-4 w-4" aria-hidden />{t('workout.skipExercise')}
          </Button>
        </div>
      </Dialog>

      <Dialog
        open={replaceOpen}
        title={t('workout.replaceExercise')}
        onClose={() => setReplaceOpen(false)}
        footer={<Button variant="ghost" onClick={() => setReplaceOpen(false)}>{t('common.cancel')}</Button>}
      >
        <p className="mb-3 text-sm muted">{t('workout.replaceHint')}</p>
        {alternatives.length === 0 ? (
          <p className="text-sm muted">{t('common.empty')}</p>
        ) : (
          <ul className="space-y-2">
            {alternatives.map((alt) => (
              <li key={alt.id}>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-2xl border p-2.5 text-start transition hairline hover:border-brand-300"
                  onClick={() => { session.replaceExercise(index, alt.id); setReplaceOpen(false); }}
                >
                  <ExerciseThumb ex={alt} className="h-14 w-20 shrink-0" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{exerciseName(alt, i18n.language)}</span>
                    <span className="mt-0.5 block truncate text-xs muted">{alt.equipment.map((e) => t(`equip.${e}`)).join(', ')}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Dialog>

      <Dialog
        open={finishOpen}
        title={t('workout.finishWorkout')}
        onClose={() => setFinishOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setFinishOpen(false)}>{t('common.cancel')}</Button>
            <Button onClick={() => void finish()}><Check className="h-4 w-4" aria-hidden />{t('common.finish')}</Button>
          </>
        }
      >
        {t('workout.finishConfirm')}
      </Dialog>

      <Dialog
        open={discardOpen}
        title={t('today.discard')}
        onClose={() => setDiscardOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDiscardOpen(false)}>{t('common.cancel')}</Button>
            <Button variant="danger" onClick={() => { void session.discard(); navigate('/', { replace: true }); }}>{t('common.delete')}</Button>
          </>
        }
      >
        {t('workout.discardConfirm')}
      </Dialog>
    </div>
  );
}

function SetRow({
  set, number, value, onWeight, onReps, onRir, onToggle, onRemove, labels
}: {
  set: SetLog;
  number: number;
  value: number;
  onWeight: (v: number) => void;
  onReps: (v: number) => void;
  onRir: (v: number) => void;
  onToggle: () => void;
  onRemove: () => void;
  labels: Record<'warmup' | 'weight' | 'reps' | 'rir' | 'done' | 'remove', string>;
}) {
  return (
    <li
      className={`grid grid-cols-[3.2rem_1fr_1fr_3rem_3rem] items-center gap-2 rounded-2xl px-1 py-1.5 transition ${
        set.done ? 'bg-success-50 dark:bg-success-700/15' : ''
      }`}
    >
      <span className={`text-center text-sm font-bold ${set.warmup ? 'text-[10px] font-semibold uppercase muted' : ''}`}>
        {set.warmup ? labels.warmup : number}
      </span>
      <label className="sr-only" htmlFor={`w-${set.id}`}>{labels.weight}</label>
      <Input
        id={`w-${set.id}`} type="number" inputMode="decimal" min={0} step="0.5"
        className="text-center text-base font-semibold" value={value}
        onChange={(e) => onWeight(Number(e.target.value))} aria-label={labels.weight}
      />
      <label className="sr-only" htmlFor={`r-${set.id}`}>{labels.reps}</label>
      <Input
        id={`r-${set.id}`} type="number" inputMode="numeric" min={0} step="1"
        className="text-center text-base font-semibold" value={set.reps}
        onChange={(e) => onReps(Number(e.target.value))} aria-label={labels.reps}
      />
      {set.warmup ? (
        <span />
      ) : (
        <>
          <label className="sr-only" htmlFor={`rir-${set.id}`}>{labels.rir}</label>
          <select
            id={`rir-${set.id}`} className="field px-1 py-2.5 text-center text-sm" value={set.rir ?? ''}
            onChange={(e) => onRir(Number(e.target.value))} aria-label={labels.rir}
          >
            <option value="">–</option>
            {[0, 1, 2, 3, 4].map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </>
      )}
      <div className="flex items-center justify-end gap-0.5">
        <button
          type="button" aria-label={labels.done} aria-pressed={set.done} onClick={onToggle}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition ${
            set.done ? 'bg-success-500 text-white' : 'bg-ink-100 text-ink-500 hover:bg-brand-50 hover:text-brand-600 dark:bg-ink-800'
          }`}
        >
          <Check className="h-5 w-5" aria-hidden />
        </button>
        <button type="button" aria-label={labels.remove} onClick={onRemove} className="hidden h-9 w-7 items-center justify-center rounded-lg muted hover:text-red-600 sm:flex">
          <Trash2 className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </li>
  );
}

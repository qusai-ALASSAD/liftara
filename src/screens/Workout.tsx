import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Check, ChevronLeft, ChevronRight, Plus, Repeat2, SkipForward, Timer, Trash2, X } from 'lucide-react';
import type { SetLog } from '@/types';
import { Badge, Button, Card, Chip, Dialog, Input, Progress } from '@/components/ui';
import { ExerciseIllustration, ExerciseMeta, InstructionsBlock, exerciseName } from '@/components/ExerciseInfo';
import { useAppStore } from '@/store/appStore';
import { useSessionStore } from '@/store/sessionStore';
import { EXERCISE_MAP } from '@/content/exercises';
import { replacementOptions } from '@/lib/planGenerator';
import { exerciseHistory, suggestProgression } from '@/lib/progression';
import { displayWeight, toKg, weightUnit } from '@/lib/units';
import { formatDuration } from '@/lib/date';
import { localized } from '@/lib/titles';

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
  const total = workout.exercises.length;
  const doneSets = current.sets.filter((s) => s.done && !s.warmup).length;
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
    <div className="mx-auto w-full max-w-2xl px-4 pb-32 pt-5">
      <header className="mb-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs muted">{localized(workout.title, i18n.language)}</p>
          <h1 className="truncate font-display text-xl font-semibold">{t('workout.title')}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setDiscardOpen(true)} aria-label={t('today.discard')}>
            <X className="h-4 w-4" aria-hidden />
          </Button>
          <Button size="sm" onClick={() => setFinishOpen(true)}>{t('workout.finishWorkout')}</Button>
        </div>
      </header>

      <p className="mb-1 text-xs muted">{t('workout.progress', { current: index + 1, total })}</p>
      <Progress value={((index + 1) / total) * 100} label={t('workout.progress', { current: index + 1, total })} />

      <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1" role="tablist" aria-label={t('workout.title')}>
        {workout.exercises.map((e, i) => (
          <button
            key={e.exerciseId + i}
            role="tab"
            aria-selected={i === index}
            onClick={() => setIndex(i)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              i === index ? 'bg-royal-600 text-white' : e.skipped ? 'bg-sand-100 muted line-through dark:bg-navy-800' : 'bg-sand-100 dark:bg-navy-800'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <Card className="mt-3">
        <div className="flex gap-3">
          <div className="w-28 shrink-0">
            <ExerciseIllustration ex={meta} className="h-20 w-full" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-lg font-semibold">{exerciseName(meta, i18n.language)}</h2>
            <p className="mt-0.5 text-sm muted">
              {current.plannedSets} × {current.repRange[0]}–{current.repRange[1]} · {t('common.rest')} {current.restSec}s
            </p>
            {current.skipped && <Badge tone="warn">{t('workout.skipped')}</Badge>}
          </div>
        </div>

        <div className="mt-3"><ExerciseMeta ex={meta} /></div>

        <p className="mt-3 text-sm muted">
          {history.length > 0
            ? `${t('workout.previous')}: ${displayWeight(history[0]!.weight, units)} ${unit} × ${history[0]!.sets[0]?.reps ?? 0}`
            : t('workout.noPrevious')}
        </p>

        {showIncrease && suggestion && (
          <div className="mt-3 rounded-2xl border border-moss-300 bg-moss-50 p-3 dark:border-moss-700 dark:bg-moss-700/20">
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

        <ul className="mt-4 space-y-2">
          {current.sets.map((s, i) => (
            <SetRow
              key={s.id}
              set={s}
              number={i + 1}
              unit={unit}
              value={displayWeight(s.weight, units)}
              onWeight={(v) => session.updateSet(index, s.id, { weight: toKg(v, units) })}
              onReps={(v) => session.updateSet(index, s.id, { reps: v })}
              onRir={(v) => session.updateSet(index, s.id, { rir: v })}
              onToggle={() => session.toggleDone(index, s.id)}
              onRemove={() => session.removeSet(index, s.id)}
              labels={{
                warmup: t('workout.warmup'),
                working: t('workout.working'),
                weight: t('common.weight'),
                reps: t('common.reps'),
                rir: t('workout.rir'),
                done: t('workout.logSet'),
                remove: t('workout.removeSet')
              }}
            />
          ))}
        </ul>

        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={() => session.addSet(index)}>
            <Plus className="h-4 w-4" aria-hidden />{t('workout.addSet')}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => session.startRest(current.exerciseId, current.restSec)}>
            <Timer className="h-4 w-4" aria-hidden />{t('workout.startRest')}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setReplaceOpen(true)}>
            <Repeat2 className="h-4 w-4" aria-hidden />{t('workout.replaceExercise')}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => session.skipExercise(index)}>
            <SkipForward className="h-4 w-4" aria-hidden />{t('workout.skipExercise')}
          </Button>
        </div>

        <label className="mt-4 block text-sm font-medium" htmlFor="ex-notes">{t('workout.exerciseNotes')}</label>
        <Input
          id="ex-notes"
          value={current.notes ?? ''}
          onChange={(e) => session.setExerciseNotes(index, e.target.value)}
          placeholder={t('common.notes')}
        />

        <div className="mt-4">
          <InstructionsBlock ex={meta} collapsible />
        </div>
      </Card>

      <div className="mt-4 flex items-center justify-between">
        <Button variant="ghost" disabled={index === 0} onClick={() => setIndex(index - 1)}>
          <ChevronLeft className="h-4 w-4" aria-hidden />{t('common.back')}
        </Button>
        <span className="text-xs muted">{doneSets}/{current.plannedSets} {t('common.sets')}</span>
        <Button variant="ghost" disabled={index >= total - 1} onClick={() => setIndex(index + 1)}>
          {t('common.next')}<ChevronRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>

      {rest && restLeft > 0 && (
        <div className="safe-bottom fixed bottom-0 start-0 end-0 z-40 border-t hairline bg-[rgb(var(--surface-raised))]/95 backdrop-blur" role="status">
          <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
            <Timer className="h-5 w-5 text-royal-500" aria-hidden />
            <div className="flex-1">
              <p className="text-xs muted">{t('workout.restTimer')}</p>
              <p className="font-display text-lg font-semibold tabular-nums">{formatDuration(restLeft)}</p>
            </div>
            <div className="w-24"><Progress value={100 - (restLeft / (rest.total * 1000)) * 100} label={t('workout.restTimer')} /></div>
            <Button size="sm" variant="secondary" onClick={() => session.stopRest()}>{t('workout.skipRest')}</Button>
          </div>
        </div>
      )}

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
                  className="hairline w-full rounded-xl border p-3 text-start transition hover:border-royal-400"
                  onClick={() => { session.replaceExercise(index, alt.id); setReplaceOpen(false); }}
                >
                  <span className="block font-medium">{exerciseName(alt, i18n.language)}</span>
                  <span className="mt-1 flex flex-wrap gap-1">
                    {alt.equipment.map((e) => <Chip key={e}>{t(`equip.${e}`)}</Chip>)}
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
  set, number, unit, value, onWeight, onReps, onRir, onToggle, onRemove, labels
}: {
  set: SetLog;
  number: number;
  unit: string;
  value: number;
  onWeight: (v: number) => void;
  onReps: (v: number) => void;
  onRir: (v: number) => void;
  onToggle: () => void;
  onRemove: () => void;
  labels: Record<'warmup' | 'working' | 'weight' | 'reps' | 'rir' | 'done' | 'remove', string>;
}) {
  return (
    <li className={`hairline flex items-center gap-2 rounded-xl border p-2 ${set.done ? 'bg-moss-50 dark:bg-moss-700/20' : ''}`}>
      <span className="w-14 shrink-0 text-[11px] font-semibold uppercase muted">
        {set.warmup ? labels.warmup : `${labels.working.slice(0, 4)} ${number}`}
      </span>
      <label className="sr-only" htmlFor={`w-${set.id}`}>{labels.weight}</label>
      <Input
        id={`w-${set.id}`} type="number" inputMode="decimal" min={0} step="0.5"
        className="w-20 text-center" value={value}
        onChange={(e) => onWeight(Number(e.target.value))} aria-label={`${labels.weight} (${unit})`}
      />
      <span className="text-xs muted">{unit}</span>
      <label className="sr-only" htmlFor={`r-${set.id}`}>{labels.reps}</label>
      <Input
        id={`r-${set.id}`} type="number" inputMode="numeric" min={0} step="1"
        className="w-16 text-center" value={set.reps}
        onChange={(e) => onReps(Number(e.target.value))} aria-label={labels.reps}
      />
      {!set.warmup && (
        <>
          <label className="sr-only" htmlFor={`rir-${set.id}`}>{labels.rir}</label>
          <select
            id={`rir-${set.id}`} className="field w-16 px-1 text-center" value={set.rir ?? ''}
            onChange={(e) => onRir(Number(e.target.value))} aria-label={labels.rir}
          >
            <option value="">–</option>
            {[0, 1, 2, 3, 4].map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </>
      )}
      <button
        type="button" aria-label={labels.done} aria-pressed={set.done} onClick={onToggle}
        className={`ms-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
          set.done ? 'bg-moss-500 text-white' : 'bg-sand-100 dark:bg-navy-800'
        }`}
      >
        <Check className="h-4 w-4" aria-hidden />
      </button>
      <button type="button" aria-label={labels.remove} onClick={onRemove} className="rounded-lg p-1 muted hover:text-red-600">
        <Trash2 className="h-4 w-4" aria-hidden />
      </button>
    </li>
  );
}

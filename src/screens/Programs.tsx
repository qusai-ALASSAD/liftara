import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CalendarDays, Copy, Crown, Pause, Play, RotateCcw } from 'lucide-react';
import type { Program, ProgramState } from '@/types';
import { Badge, Button, Card, Chip, Dialog } from '@/components/ui';
import { Page } from '@/components/Layout';
import { AdBanner } from '@/components/AdSlot';
import { PROGRAMS, getProgram } from '@/content/programs';
import { EXERCISE_MAP } from '@/content/exercises';
import { ExerciseThumb, exerciseName } from '@/components/ExerciseInfo';
import { useAppStore } from '@/store/appStore';
import { useSessionStore } from '@/store/sessionStore';
import { planFromExercises } from '@/lib/planGenerator';
import { canCreateCustomProgram } from '@/lib/premium';
import { formatDate } from '@/lib/date';
import { localized, muscleLabel } from '@/lib/titles';

const baseId = (stateId: string) => stateId.split(':')[0]!;
const resolveProgram = (stateId: string): Program | undefined => getProgram(baseId(stateId));

export default function ProgramsScreen() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const profile = useAppStore((s) => s.profile);
  const workouts = useAppStore((s) => s.workouts);
  const states = useAppStore((s) => s.programStates);
  const premium = useAppStore((s) => s.settings.premium);
  const putProgramState = useAppStore((s) => s.putProgramState);
  const removeProgramState = useAppStore((s) => s.removeProgramState);
  const startFromPlan = useSessionStore((s) => s.startFromPlan);
  const activeWorkout = useSessionStore((s) => s.workout);

  const [openId, setOpenId] = useState<string | null>(null);
  const [restartId, setRestartId] = useState<string | null>(null);

  const customStates = useMemo(() => states.filter((s) => s.custom), [states]);
  const stateFor = (id: string) => states.find((s) => s.programId === id);

  if (!profile) return null;

  const open = openId ? resolveProgram(openId) : undefined;
  const openState = openId ? stateFor(openId) : undefined;

  const startProgram = async (id: string) => {
    const program = resolveProgram(id);
    if (!program) return;
    await putProgramState({
      programId: id,
      startedAt: Date.now(),
      status: 'active',
      completedDays: 0,
      weekdays: profile.weekdays.slice(0, program.daysPerWeek),
      custom: id.includes(':')
    });
  };

  const startDay = async (program: Program, dayIndex: number, state?: ProgramState) => {
    const day = program.days[dayIndex % program.days.length]!;
    const plan = planFromExercises(day.exerciseIds, profile, workouts, day.focus, `${program.id}-${dayIndex}`);
    await startFromPlan(plan, day.workoutTitle, state?.programId ?? program.id);
    if (state) await putProgramState({ ...state, completedDays: state.completedDays + 1, lastCompletedAt: Date.now() });
    navigate('/workout');
  };

  const duplicate = async (program: Program) => {
    if (!canCreateCustomProgram(customStates.length, premium)) return;
    await putProgramState({
      programId: `${program.id}:custom`,
      startedAt: Date.now(),
      status: 'paused',
      completedDays: 0,
      weekdays: profile.weekdays.slice(0, program.daysPerWeek),
      custom: true
    });
    setOpenId(`${program.id}:custom`);
  };

  const cards: { id: string; program: Program; state?: ProgramState }[] = [
    ...PROGRAMS.map((p) => ({ id: p.id, program: p, state: stateFor(p.id) })),
    ...customStates
      .map((s) => ({ id: s.programId, program: resolveProgram(s.programId), state: s }))
      .filter((c): c is { id: string; program: Program; state: ProgramState } => Boolean(c.program))
  ];

  return (
    <Page title={t('programs.title')} subtitle={t('programs.subtitle')}>
      <ul className="space-y-3">
        {cards.map(({ id, program, state }) => {
          const locked = program.premium && !premium;
          return (
            <Card key={id} as="li">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-display text-lg font-semibold">{localized(program.name, i18n.language)}</h2>
                  <p className="mt-1 text-sm muted">{localized(program.description, i18n.language)}</p>
                </div>
                <Badge tone={program.premium ? 'warn' : 'accent'}>
                  {program.premium ? <><Crown className="h-3 w-3" aria-hidden />{t('common.premium')}</> : t('common.free')}
                </Badge>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge tone="brand">{t('programs.daysPerWeek', { count: program.daysPerWeek })}</Badge>
                <Badge>{t('programs.weeks', { count: program.weeks })}</Badge>
                {program.level.map((l) => <Badge key={l}>{t(`level.${l}`)}</Badge>)}
                {state?.custom && <Badge tone="accent">{t('programs.customized')}</Badge>}
                {state && <Badge tone={state.status === 'active' ? 'accent' : 'neutral'}>{t(`programs.${state.status === 'active' ? 'active' : 'paused'}`)}</Badge>}
              </div>

              {state && (
                <p className="mt-2 text-xs muted">
                  {t('programs.startedOn', { date: formatDate(state.startedAt, i18n.language) })} · {t('programs.completedDays', { count: state.completedDays })}
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" variant="secondary" onClick={() => setOpenId(id)}>{t('programs.preview')}</Button>
                {!state && (
                  <Button size="sm" disabled={locked} onClick={() => void startProgram(id)}>
                    <Play className="h-4 w-4" aria-hidden />{t('programs.startProgram')}
                  </Button>
                )}
                {state && state.status === 'active' && (
                  <Button size="sm" variant="ghost" onClick={() => void putProgramState({ ...state, status: 'paused' })}>
                    <Pause className="h-4 w-4" aria-hidden />{t('programs.pause')}
                  </Button>
                )}
                {state && state.status === 'paused' && (
                  <Button size="sm" onClick={() => void putProgramState({ ...state, status: 'active' })}>
                    <Play className="h-4 w-4" aria-hidden />{t('programs.resume')}
                  </Button>
                )}
                {state && (
                  <Button size="sm" variant="ghost" onClick={() => setRestartId(id)}>
                    <RotateCcw className="h-4 w-4" aria-hidden />{t('programs.restart')}
                  </Button>
                )}
              </div>
              {locked && <p className="mt-2 text-xs muted">{t('programs.premiumHint')}</p>}
            </Card>
          );
        })}
      </ul>

      <div className="mt-6">
        <AdBanner placement="bannerHome" />
      </div>

      <Dialog
        open={Boolean(open)}
        title={open ? localized(open.name, i18n.language) : ''}
        onClose={() => setOpenId(null)}
        footer={<Button variant="ghost" onClick={() => setOpenId(null)}>{t('common.close')}</Button>}
      >
        {open && (
          <div className="space-y-4">
            <p className="muted">{localized(open.description, i18n.language)}</p>

            <div>
              <h4 className="mb-1 font-semibold">{t('programs.levelLabel')}</h4>
              <div className="flex flex-wrap gap-1.5">{open.level.map((l) => <Chip key={l}>{t(`level.${l}`)}</Chip>)}</div>
            </div>

            {openState && (
              <div>
                <h4 className="mb-1 flex items-center gap-2 font-semibold"><CalendarDays className="h-4 w-4" aria-hidden />{t('programs.changeDays')}</h4>
                <div className="flex flex-wrap gap-1.5">
                  {Array.from({ length: 7 }, (_, i) => (
                    <Chip
                      key={i}
                      active={openState.weekdays.includes(i)}
                      onClick={() =>
                        void putProgramState({
                          ...openState,
                          weekdays: openState.weekdays.includes(i)
                            ? openState.weekdays.filter((d) => d !== i)
                            : [...openState.weekdays, i].sort((a, b) => a - b)
                        })
                      }
                    >
                      {t(`wd.${i}`)}
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="mb-2 font-semibold">{t('programs.weeklyPlan')}</h4>
              <ul className="space-y-3">
                {open.days.map((day, idx) => (
                  <li key={day.dayIndex} className="hairline rounded-xl border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{localized(day.workoutTitle, i18n.language)}</span>
                      <Button
                        size="sm"
                        disabled={Boolean(activeWorkout) || (open.premium && !premium)}
                        onClick={() => void startDay(open, idx, openState)}
                      >
                        {t('common.start')}
                      </Button>
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {day.focus.map((m) => <Badge key={m} tone="brand">{muscleLabel(m, i18n.language)}</Badge>)}
                    </div>
                    <ul className="mt-2.5 space-y-1.5">
                      {day.exerciseIds.map((exId) => {
                        const meta = EXERCISE_MAP[exId];
                        if (!meta) return <li key={exId} className="text-xs muted">{exId}</li>;
                        return (
                          <li key={exId} className="flex items-center gap-2.5">
                            <ExerciseThumb ex={meta} className="h-9 w-14 shrink-0" />
                            <span className="min-w-0 flex-1 truncate text-xs font-medium">{exerciseName(meta, i18n.language)}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hairline rounded-xl border border-dashed p-3">
              <p className="font-semibold">{t('programs.missedWeek')}</p>
              <p className="mt-1 muted">{t('programs.missedWeekText')}</p>
            </div>

            <Button
              variant="secondary"
              disabled={!canCreateCustomProgram(customStates.length, premium)}
              onClick={() => void duplicate(open)}
            >
              <Copy className="h-4 w-4" aria-hidden />{t('programs.duplicate')}
            </Button>
            {!canCreateCustomProgram(customStates.length, premium) && <p className="text-xs muted">{t('programs.premiumHint')}</p>}
          </div>
        )}
      </Dialog>

      <Dialog
        open={Boolean(restartId)}
        title={t('programs.restart')}
        onClose={() => setRestartId(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setRestartId(null)}>{t('common.cancel')}</Button>
            <Button
              variant="danger"
              onClick={async () => {
                if (!restartId) return;
                const state = stateFor(restartId);
                if (state?.custom) await removeProgramState(restartId);
                else if (state) await putProgramState({ ...state, startedAt: Date.now(), completedDays: 0, status: 'active' });
                setRestartId(null);
              }}
            >
              {t('common.confirm')}
            </Button>
          </>
        }
      >
        {t('programs.restartConfirm')}
      </Dialog>
    </Page>
  );
}

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Activity, Award, Check, Flame, Info, Play, Target, TrendingUp } from 'lucide-react';
import { Badge, Button, Card, Dialog, Progress, SectionTitle, Stat } from '@/components/ui';
import { AdBanner } from '@/components/AdSlot';
import { InstallPrompt, OfflineBadge, Page } from '@/components/Layout';
import { AnatomyMap } from '@/components/AnatomyMap';
import { ExerciseThumb, exerciseName } from '@/components/ExerciseInfo';
import { useAppStore } from '@/store/appStore';
import { useSessionStore } from '@/store/sessionStore';
import { generatePlan } from '@/lib/planGenerator';
import { recoveryByMuscle } from '@/lib/recovery';
import { currentStreak, goalWeightProgress, weeklyWorkoutCount } from '@/lib/stats';
import { DAY_MS, dayKey, formatDate, startOfWeek, weekdayIndex } from '@/lib/date';
import { displayWeight, weightUnit } from '@/lib/units';
import { focusTitle, localized, muscleLabel } from '@/lib/titles';
import { EXERCISE_MAP } from '@/content/exercises';

export default function TodayScreen() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const profile = useAppStore((s) => s.profile);
  const workouts = useAppStore((s) => s.workouts);
  const achievements = useAppStore((s) => s.achievements);
  const measurements = useAppStore((s) => s.measurements);
  const units = useAppStore((s) => s.settings.units);
  const active = useSessionStore((s) => s.workout);
  const startFromPlan = useSessionStore((s) => s.startFromPlan);
  const discard = useSessionStore((s) => s.discard);
  const [force, setForce] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);

  const completed = useMemo(() => workouts.filter((w) => w.status === 'completed'), [workouts]);
  const plan = useMemo(() => (profile ? generatePlan({ profile, workouts, force }) : null), [profile, workouts, force]);
  const recovery = useMemo(() => recoveryByMuscle(completed), [completed]);

  if (!profile || !plan) return null;

  const unit = weightUnit(units);
  const startKg = measurements.find((m) => typeof m.weightKg === 'number')?.weightKg ?? profile.weightKg;
  const goal = goalWeightProgress(startKg, profile.weightKg, profile.goalWeightKg);
  const weekStart = startOfWeek(Date.now());
  const doneThisWeek = weeklyWorkoutCount(completed, weekStart);
  const streak = currentStreak(completed);
  const lastAchievement = [...achievements].sort((a, b) => b.unlockedAt - a.unlockedAt)[0];
  const restDay = plan.restDay;
  const title = focusTitle(plan.workout.focus);
  const fatigued = recovery.filter((r) => r.percent < 90).map((r) => r.muscle);

  const start = async () => {
    await startFromPlan(plan.workout, title);
    navigate('/workout');
  };

  return (
    <Page title={t('today.hello', { name: profile.name })} subtitle={t('today.subtitle')}>
      <OfflineBadge />
      <InstallPrompt />

      {active && (
        <Card className="mb-4 border-brand-200 bg-brand-50 dark:bg-brand-900/20">
          <p className="font-semibold">{t('today.resumeTitle')}</p>
          <p className="mt-1 text-sm muted">{t('today.resumeText', { date: formatDate(active.startedAt, i18n.language) })}</p>
          <div className="mt-3 flex gap-2">
            <Button onClick={() => navigate('/workout')}>{t('today.resume')}</Button>
            <Button variant="ghost" onClick={() => void discard()}>{t('today.discard')}</Button>
          </div>
        </Card>
      )}

      {/* Tagesempfehlung als Hauptkarte mit einer klaren orangen Aktion. */}
      {restDay ? (
        <Card className="overflow-hidden p-0">
          <div className="tint px-5 py-6">
            <Badge tone="brand">{t('today.restDay')}</Badge>
            <p className="mt-3 text-sm">{t('today.restDayText')}</p>
            <Button variant="outline" className="mt-4" onClick={() => setForce(true)}>{t('today.trainAnyway')}</Button>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="tint flex items-center gap-4 px-5 py-5">
            <div className="min-w-0 flex-1">
              <Badge tone="brand"><Target className="h-3 w-3" aria-hidden />{t('today.recommended')}</Badge>
              <h2 className="mt-2 font-display text-xl font-bold leading-tight">{localized(title, i18n.language)}</h2>
              <p className="mt-1 text-sm muted">
                {t('today.estimatedDuration', { count: plan.workout.estimatedMinutes })} · {t('common.exercises', { count: plan.workout.exercises.length })}
              </p>
            </div>
            <div className="h-24 w-16 shrink-0">
              <AnatomyMap view="front" primary={plan.workout.focus} title={t('today.targetMuscles')} />
            </div>
          </div>

          <div className="p-4">
            <div className="flex flex-wrap gap-1.5">
              {plan.workout.focus.map((m) => (
                <Badge key={m} tone="accent">{muscleLabel(m, i18n.language)}</Badge>
              ))}
            </div>

            <ul className="mt-4 space-y-2">
              {plan.workout.exercises.map((e) => {
                const meta = EXERCISE_MAP[e.exerciseId];
                if (!meta) return null;
                return (
                  <li key={e.exerciseId} className="flex items-center gap-3">
                    <ExerciseThumb ex={meta} className="h-11 w-16 shrink-0" />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">{exerciseName(meta, i18n.language)}</span>
                    <span className="shrink-0 text-xs font-semibold muted">{e.sets} × {e.repRange[0]}–{e.repRange[1]}</span>
                  </li>
                );
              })}
            </ul>

            <Button size="lg" className="mt-5 w-full" onClick={() => void start()} disabled={Boolean(active)}>
              <Play className="h-5 w-5" aria-hidden />
              {t('today.startWorkout')}
            </Button>
            <button
              type="button"
              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-300"
              onClick={() => setWhyOpen(true)}
            >
              <Info className="h-4 w-4" aria-hidden />
              {t('today.whyThisPlan')}
            </button>
          </div>
        </Card>
      )}

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Stat
          icon={<TrendingUp className="h-4 w-4" aria-hidden />}
          label={t('today.weightCard')}
          value={`${displayWeight(profile.weightKg, units)}`}
          sub={goal.reached ? t('today.goalReached') : t('today.toGoal', { value: displayWeight(goal.remaining, units), unit })}
        />
        <Stat label={t('today.weeklyGoal')} value={`${doneThisWeek}/${profile.daysPerWeek}`} sub={t('today.weeklyDone', { done: doneThisWeek, target: profile.daysPerWeek })} />
        <Stat
          icon={<Flame className="h-4 w-4" aria-hidden />}
          label={t('today.streak')}
          value={streak}
          sub={t('today.streakDays', { count: streak })}
        />
      </div>

      <Card className="mt-3">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold">{t('today.goalProgress')}</span>
          <span className="muted">{displayWeight(profile.weightKg, units)} → {displayWeight(profile.goalWeightKg, units)} {unit}</span>
        </div>
        <Progress value={goal.percent} tone="accent" label={t('today.goalProgress')} />
      </Card>

      <SectionTitle>{t('today.weekCalendar')}</SectionTitle>
      <Card>
        <ul className="flex justify-between gap-1">
          {Array.from({ length: 7 }, (_, i) => {
            const day = weekStart + i * DAY_MS;
            const trained = completed.some((w) => dayKey(w.startedAt) === dayKey(day));
            const planned = profile.weekdays.includes(i);
            const isToday = weekdayIndex(Date.now()) === i;
            return (
              <li key={i} className="flex flex-1 flex-col items-center gap-1.5">
                <span className={`text-[11px] font-medium ${isToday ? 'text-brand-600 dark:text-brand-300' : 'muted'}`}>{t(`wd.${i}`)}</span>
                <span
                  aria-label={`${t(`wd.${i}`)}${trained ? ' ✓' : ''}`}
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl text-xs font-bold ${
                    trained
                      ? 'bg-success-500 text-white'
                      : planned
                        ? 'border-2 border-brand-300 text-brand-600 dark:text-brand-300'
                        : 'bg-ink-100 muted dark:bg-ink-800'
                  }`}
                >
                  {trained ? <Check className="h-4 w-4" aria-hidden /> : new Date(day).getDate()}
                </span>
              </li>
            );
          })}
        </ul>
      </Card>

      <SectionTitle>{t('today.recovery')}</SectionTitle>
      <Card>
        <div className="flex gap-4">
          <div className="h-44 w-24 shrink-0">
            <AnatomyMap view="front" secondary={fatigued} title={t('today.recovery')} />
          </div>
          <ul className="flex-1 space-y-2.5">
            {recovery
              .filter((r) => r.muscle !== 'fullBody')
              .sort((a, b) => a.percent - b.percent)
              .slice(0, 5)
              .map((r) => (
                <li key={r.muscle}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium">{muscleLabel(r.muscle, i18n.language)}</span>
                    <span className="muted">{r.percent >= 90 ? t('today.fresh') : `${r.percent}%`}</span>
                  </div>
                  <Progress value={r.percent} tone={r.percent >= 90 ? 'accent' : 'warn'} label={muscleLabel(r.muscle, i18n.language)} />
                </li>
              ))}
          </ul>
        </div>
      </Card>

      {lastAchievement && (
        <>
          <SectionTitle>{t('today.achievement')}</SectionTitle>
          <Card className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl tint text-brand-500">
              <Award className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="font-semibold">{t(`achievements.${lastAchievement.id}`)}</p>
              <p className="text-sm muted">{t(`achievements.${lastAchievement.id}Desc`)}</p>
            </div>
          </Card>
        </>
      )}

      <div className="mt-6">
        <AdBanner placement="bannerHome" />
      </div>

      <Dialog open={whyOpen} title={t('today.whyThisPlan')} onClose={() => setWhyOpen(false)} footer={<Button onClick={() => setWhyOpen(false)}>{t('common.close')}</Button>}>
        <ul className="space-y-2.5">
          {plan.workout.rationale.map((r) => (
            <li key={r.key} className="flex gap-2.5">
              <Activity className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden />
              <span>{t(r.key, r.values)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs muted">{t('common.estimateNote')}</p>
      </Dialog>
    </Page>
  );
}

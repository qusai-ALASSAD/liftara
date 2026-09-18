import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Activity, Award, Check, Flame, Play, Target, Info } from 'lucide-react';
import { Button, Card, Badge, Progress, SectionTitle, Stat, Dialog } from '@/components/ui';
import { AdBanner } from '@/components/AdSlot';
import { InstallPrompt, OfflineBadge, Page } from '@/components/Layout';
import { useAppStore } from '@/store/appStore';
import { useSessionStore } from '@/store/sessionStore';
import { generatePlan } from '@/lib/planGenerator';
import { recoveryByMuscle } from '@/lib/recovery';
import { currentStreak, goalWeightProgress, weeklyWorkoutCount } from '@/lib/stats';
import { DAY_MS, formatDate, startOfWeek, weekdayIndex, dayKey } from '@/lib/date';
import { displayWeight, weightUnit } from '@/lib/units';
import { focusTitle, muscleLabel } from '@/lib/titles';
import { EXERCISE_MAP } from '@/content/exercises';
import { MUSCLES } from '@/content/muscles';

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
  const plan = useMemo(
    () => (profile ? generatePlan({ profile, workouts, force }) : null),
    [profile, workouts, force]
  );
  const recovery = useMemo(() => recoveryByMuscle(completed), [completed]);

  if (!profile || !plan) return null;

  const unit = weightUnit(units);
  // Startgewicht = ältester protokollierter Wert, sonst das Gewicht aus dem Onboarding.
  const startKg = measurements.find((m) => typeof m.weightKg === 'number')?.weightKg ?? profile.weightKg;
  const goal = goalWeightProgress(startKg, profile.weightKg, profile.goalWeightKg);
  const weekStart = startOfWeek(Date.now());
  const doneThisWeek = weeklyWorkoutCount(completed, weekStart);
  const streak = currentStreak(completed);
  const lastAchievement = [...achievements].sort((a, b) => b.unlockedAt - a.unlockedAt)[0];
  const restDay = plan.restDay;
  const title = focusTitle(plan.workout.focus);

  const start = async () => {
    await startFromPlan(plan.workout, title);
    navigate('/workout');
  };

  return (
    <Page title={t('today.hello', { name: profile.name })} subtitle={t('today.subtitle')}>
      <OfflineBadge />
      <InstallPrompt />

      {active && (
        <Card className="mb-4 border-royal-300 bg-royal-50/60 dark:bg-royal-900/20">
          <p className="font-semibold">{t('today.resumeTitle')}</p>
          <p className="mt-1 text-sm muted">{t('today.resumeText', { date: formatDate(active.startedAt, i18n.language) })}</p>
          <div className="mt-3 flex gap-2">
            <Button onClick={() => navigate('/workout')}>{t('today.resume')}</Button>
            <Button variant="ghost" onClick={() => void discard()}>{t('today.discard')}</Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-2">
        <Stat
          label={t('today.weightCard')}
          value={`${displayWeight(profile.weightKg, units)} ${unit}`}
          sub={goal.reached ? t('today.goalReached') : t('today.toGoal', { value: displayWeight(goal.remaining, units), unit })}
        />
        <Stat label={t('today.weeklyGoal')} value={`${doneThisWeek}/${profile.daysPerWeek}`} sub={t('today.weeklyDone', { done: doneThisWeek, target: profile.daysPerWeek })} />
        <Stat label={t('today.streak')} value={<span className="inline-flex items-center gap-1"><Flame className="h-4 w-4 text-amber-500" aria-hidden />{streak}</span>} sub={t('today.streakDays', { count: streak })} />
      </div>

      <Card className="mt-3">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium">{t('today.weightCard')}</span>
          <span className="muted">{displayWeight(profile.goalWeightKg, units)} {unit}</span>
        </div>
        <Progress value={goal.percent} tone="accent" label={t('today.weightCard')} />
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
                <span className={`text-[11px] ${isToday ? 'font-semibold text-royal-600 dark:text-royal-300' : 'muted'}`}>{t(`wd.${i}`)}</span>
                <span
                  aria-label={`${t(`wd.${i}`)}${trained ? ' ✓' : ''}`}
                  className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-semibold ${
                    trained
                      ? 'bg-moss-500 text-white'
                      : planned
                        ? 'border border-royal-400 text-royal-600 dark:text-royal-300'
                        : 'bg-sand-100 muted dark:bg-navy-800'
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
        <ul className="space-y-2.5">
          {recovery
            .filter((r) => r.muscle !== 'fullBody')
            .sort((a, b) => a.percent - b.percent)
            .slice(0, 6)
            .map((r) => (
              <li key={r.muscle} className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-sm">{muscleLabel(r.muscle, i18n.language)}</span>
                <span className="flex-1"><Progress value={r.percent} tone={r.percent >= 90 ? 'accent' : 'warn'} label={MUSCLES[r.muscle].name.en} /></span>
                <span className="w-20 text-end text-xs muted">{r.percent >= 90 ? t('today.fresh') : t('today.recovering')}</span>
              </li>
            ))}
        </ul>
      </Card>

      <SectionTitle
        action={
          <button type="button" className="inline-flex items-center gap-1 text-sm text-royal-600 dark:text-royal-300" onClick={() => setWhyOpen(true)}>
            <Info className="h-4 w-4" aria-hidden />
            {t('today.whyThisPlan')}
          </button>
        }
      >
        {restDay ? t('today.restDay') : t('today.recommended')}
      </SectionTitle>

      {restDay ? (
        <Card>
          <p className="text-sm">{t('today.restDayText')}</p>
          <Button variant="secondary" className="mt-3" onClick={() => setForce(true)}>{t('today.trainAnyway')}</Button>
        </Card>
      ) : (
        <Card>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-semibold">{title[i18n.language as 'de'] ?? title.en}</h3>
              <p className="mt-1 text-sm muted">
                {t('today.estimatedDuration', { count: plan.workout.estimatedMinutes })} · {t('common.exercises', { count: plan.workout.exercises.length })}
              </p>
            </div>
            <Target className="h-6 w-6 text-royal-500" aria-hidden />
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {plan.workout.focus.map((m) => (
              <Badge key={m} tone="brand">{muscleLabel(m, i18n.language)}</Badge>
            ))}
          </div>

          <ul className="mt-4 space-y-1.5 text-sm">
            {plan.workout.exercises.map((e) => {
              const meta = EXERCISE_MAP[e.exerciseId];
              return (
                <li key={e.exerciseId} className="flex items-center justify-between gap-3">
                  <span className="truncate">{meta ? meta.name[i18n.language as 'de'] ?? meta.name.en : e.exerciseId}</span>
                  <span className="shrink-0 text-xs muted">{e.sets} × {e.repRange[0]}–{e.repRange[1]}</span>
                </li>
              );
            })}
          </ul>

          <Button size="lg" className="mt-4 w-full" onClick={() => void start()} disabled={Boolean(active)}>
            <Play className="h-5 w-5" aria-hidden />
            {t('today.startWorkout')}
          </Button>
        </Card>
      )}

      {lastAchievement && (
        <>
          <SectionTitle>{t('today.achievement')}</SectionTitle>
          <Card className="flex items-center gap-3">
            <Award className="h-6 w-6 text-moss-500" aria-hidden />
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
        <ul className="space-y-2">
          {plan.workout.rationale.map((r) => (
            <li key={r.key} className="flex gap-2">
              <Activity className="mt-0.5 h-4 w-4 shrink-0 text-royal-500" aria-hidden />
              <span>{t(r.key, r.values)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs muted">{t('common.estimateNote')}</p>
      </Dialog>
    </Page>
  );
}

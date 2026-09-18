import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Copy, Flame, Home, Trophy } from 'lucide-react';
import type { Workout } from '@/types';
import { Badge, Button, Card, Chip, Input, SectionTitle, Stat } from '@/components/ui';
import { Page } from '@/components/Layout';
import { InterstitialAd } from '@/components/AdSlot';
import { useAppStore } from '@/store/appStore';
import { workoutRepo } from '@/db/repositories';
import { completedSetCount, estimateCalories, musclesTrained, workoutDurationMs, workoutVolume } from '@/lib/stats';
import { displayWeight, formatNumber, weightUnit } from '@/lib/units';
import { formatDuration } from '@/lib/date';
import { localized, muscleLabel } from '@/lib/titles';
import { EXERCISE_MAP } from '@/content/exercises';

export default function SummaryScreen() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const profile = useAppStore((s) => s.profile);
  const records = useAppStore((s) => s.records);
  const units = useAppStore((s) => s.settings.units);
  const refresh = useAppStore((s) => s.refresh);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [copied, setCopied] = useState(false);
  const [adOpen, setAdOpen] = useState(true);

  useEffect(() => {
    if (!id) return;
    void workoutRepo.get(id).then((w) => setWorkout(w ?? null));
  }, [id]);

  if (!workout) {
    return (
      <Page title={t('workout.summaryTitle')}>
        <div className="skeleton h-40 w-full rounded-2xl" />
      </Page>
    );
  }

  const unit = weightUnit(units);
  const volume = workoutVolume(workout);
  const muscles = musclesTrained(workout);
  const prs = records.filter((r) => Math.abs(r.date - (workout.finishedAt ?? workout.startedAt)) < 2000);
  const calories = estimateCalories(workout, profile?.weightKg ?? 70);

  const update = async (patch: Partial<Workout>) => {
    const next = { ...workout, ...patch };
    setWorkout(next);
    await workoutRepo.put(next);
    await refresh();
  };

  const shareText = [
    `${t('common.appName')} – ${localized(workout.title, i18n.language)}`,
    `${t('workout.duration')}: ${formatDuration(workoutDurationMs(workout))}`,
    `${t('workout.completedSets')}: ${completedSetCount(workout)}`,
    `${t('workout.totalVolume')}: ${formatNumber(displayWeight(volume, units))} ${unit}`,
    muscles.length > 0 ? `${t('workout.musclesTrained')}: ${muscles.map((m) => muscleLabel(m, i18n.language)).join(', ')}` : '',
    `${t('common.tagline')}`
  ].filter(Boolean).join('\n');

  const share = async () => {
    try {
      const nav = navigator as Navigator & { share?: (d: { text: string }) => Promise<void> };
      if (nav.share) await nav.share({ text: shareText });
      else await navigator.clipboard.writeText(shareText);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Page title={t('workout.summaryTitle')} subtitle={localized(workout.title, i18n.language)}>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label={t('workout.duration')} value={formatDuration(workoutDurationMs(workout))} />
        <Stat label={t('workout.completedSets')} value={completedSetCount(workout)} />
        <Stat label={t('workout.totalVolume')} value={`${formatNumber(displayWeight(volume, units))} ${unit}`} />
        <Stat
          label={t('workout.calories')}
          value={<span className="inline-flex items-center gap-1"><Flame className="h-4 w-4 text-amber-500" aria-hidden />{calories}</span>}
          sub={t('common.estimate')}
        />
      </div>
      <p className="mt-2 text-xs muted">{t('workout.caloriesNote')}</p>

      <SectionTitle>{t('workout.musclesTrained')}</SectionTitle>
      {muscles.length === 0 ? (
        <Card><p className="text-sm muted">{t('workout.emptyState')}</p></Card>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {muscles.map((m) => <Badge key={m} tone="brand">{muscleLabel(m, i18n.language)}</Badge>)}
        </div>
      )}

      {prs.length > 0 && (
        <>
          <SectionTitle>{t('workout.newRecords')}</SectionTitle>
          <Card>
            <ul className="space-y-2 text-sm">
              {prs.map((r) => (
                <li key={r.id} className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500" aria-hidden />
                  <span className="flex-1">{EXERCISE_MAP[r.exerciseId] ? localized(EXERCISE_MAP[r.exerciseId]!.name, i18n.language) : r.exerciseId}</span>
                  <span className="muted">{displayWeight(r.weight, units)} {unit} × {r.reps}</span>
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}

      <SectionTitle>{t('workout.feedback')}</SectionTitle>
      <div className="flex gap-2">
        {(['easy', 'right', 'hard'] as const).map((f) => (
          <Chip key={f} active={workout.difficultyFeedback === f} onClick={() => void update({ difficultyFeedback: f })}>
            {t(`workout.fb${f[0]!.toUpperCase()}${f.slice(1)}`)}
          </Chip>
        ))}
      </div>

      <SectionTitle>{t('workout.sessionNotes')}</SectionTitle>
      <Input
        value={workout.notes ?? ''}
        onChange={(e) => void update({ notes: e.target.value })}
        placeholder={t('common.notes')}
        aria-label={t('workout.sessionNotes')}
      />

      <div className="mt-6 flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => void share()}>
          <Copy className="h-4 w-4" aria-hidden />{copied ? t('workout.copied') : t('workout.share')}
        </Button>
        <Button onClick={() => navigate('/')}>
          <Home className="h-4 w-4" aria-hidden />{t('workout.backHome')}
        </Button>
      </div>

      {adOpen && <InterstitialAd onClose={() => setAdOpen(false)} />}
    </Page>
  );
}

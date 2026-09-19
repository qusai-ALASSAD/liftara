import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, ChevronDown, Dumbbell, PersonStanding, ShieldCheck, Target, Wind } from 'lucide-react';
import type { Exercise, Locale } from '@/types';
import { buildInstructions } from '@/content/instructions';
import { equipmentVisualFor, mediaFor } from '@/content/media';
import { Badge } from './ui';
import { ExerciseArt } from './ExerciseArt';
import { EquipmentArt } from './EquipmentArt';
import { AnatomyMap } from './AnatomyMap';
import { ExercisePhoto, ExerciseVideo } from './ExerciseMediaView';
import { localized, muscleLabel } from '@/lib/titles';

export const exerciseName = (ex: Exercise, locale: string) => localized(ex.name, locale);

/** Alt-Texte werden übersetzt – auch für die rein grafischen Ebenen. */
function useMediaLabels(ex: Exercise) {
  const { t, i18n } = useTranslation();
  const name = exerciseName(ex, i18n.language);
  const muscles = ex.primary.map((m) => muscleLabel(m, i18n.language)).join(', ');
  return {
    execution: t('exercise.altExecution', { name }),
    start: t('exercise.altStart', { name }),
    finish: t('exercise.altFinish', { name }),
    target: t('exercise.altTarget', { name, muscles }),
    equipment: t('exercise.altEquipment', { name })
  };
}

/** Zielmuskel-Darstellung: gerendertes Bild, sonst die interaktive Körperkarte. */
export function TargetMuscleImage({ ex, className = '' }: { ex: Exercise; className?: string }) {
  const labels = useMediaLabels(ex);
  const media = mediaFor(ex);
  if (media.targetMuscleImage) {
    return <ExercisePhoto src={media.targetMuscleImage} ex={ex} alt={labels.target} className={className} />;
  }
  return (
    <AnatomyMap
      view={media.targetMuscleView} primary={ex.primary} secondary={ex.secondary}
      palette="chart" title={labels.target} className={className}
    />
  );
}

export function ExerciseMeta({ ex, compact = false }: { ex: Exercise; compact?: boolean }) {
  const { t, i18n } = useTranslation();
  return (
    <div className="flex flex-wrap gap-1.5">
      {ex.primary.map((m) => (
        <Badge key={`p-${m}`} tone="brand">{muscleLabel(m, i18n.language)}</Badge>
      ))}
      {!compact && ex.secondary.map((m) => (
        <Badge key={`s-${m}`}>{muscleLabel(m, i18n.language)}</Badge>
      ))}
      {ex.equipment.map((e) => (
        <Badge key={`e-${e}`} tone="accent">{t(`equip.${e}`)}</Badge>
      ))}
      <Badge tone="warn">{t(`diff.${ex.difficulty}`)}</Badge>
    </div>
  );
}

/** Kleines Kartenbild: Gerät links, Zielmuskel als Vorschau rechts. */
export function ExerciseThumb({ ex, className = '' }: { ex: Exercise; className?: string }) {
  const labels = useMediaLabels(ex);
  const media = mediaFor(ex);
  return (
    <div className={`media-frame flex items-center gap-1 p-1 ${className}`}>
      <div className="h-full min-w-0 flex-1">
        {media.startImage ? (
          <ExercisePhoto src={media.startImage} ex={ex} alt={labels.start} />
        ) : (
          <EquipmentArt visual={equipmentVisualFor(ex)} title={labels.equipment} />
        )}
      </div>
      <div className="h-full w-8 shrink-0">
        <TargetMuscleImage ex={ex} />
      </div>
    </div>
  );
}

type Tab = 'execution' | 'target' | 'equipment';

/** Große Medienfläche mit Reitern: Ausführung, Zielmuskeln, Gerät. */
export function ExerciseMedia({ ex, initial = 'execution', className = 'h-56' }: { ex: Exercise; initial?: Tab; className?: string }) {
  const { t, i18n } = useTranslation();
  const [tab, setTab] = useState<Tab>(initial);
  const labels = useMediaLabels(ex);
  const media = mediaFor(ex);
  const tabs: { id: Tab; label: string; Icon: typeof Target }[] = [
    { id: 'execution', label: t('exercise.tabExecution'), Icon: PersonStanding },
    { id: 'target', label: t('exercise.tabTarget'), Icon: Target },
    { id: 'equipment', label: t('exercise.tabEquipment'), Icon: Dumbbell }
  ];
  return (
    <div>
      <div className={`media-frame ${className} flex items-center justify-center p-3`}>
        {tab === 'execution' && (
          media.executionVideo ? (
            <ExerciseVideo src={media.executionVideo} poster={media.startImage} ex={ex} alt={labels.execution} />
          ) : media.startImage ? (
            <div className="flex h-full w-full items-stretch gap-3">
              <figure className="flex min-w-0 flex-1 flex-col">
                <ExercisePhoto src={media.startImage} ex={ex} alt={labels.start} eager />
                <figcaption className="mt-1 text-center text-[11px] font-semibold muted">{t('exercise.phaseStart')}</figcaption>
              </figure>
              {media.finishImage && (
                <figure className="flex min-w-0 flex-1 flex-col">
                  <ExercisePhoto src={media.finishImage} ex={ex} alt={labels.finish} />
                  <figcaption className="mt-1 text-center text-[11px] font-semibold muted">{t('exercise.phaseFinish')}</figcaption>
                </figure>
              )}
            </div>
          ) : (
            <ExerciseArt pattern={ex.pattern} title={labels.execution} className="h-full" />
          )
        )}
        {tab === 'equipment' && (
          media.equipmentImage
            ? <ExercisePhoto src={media.equipmentImage} ex={ex} alt={labels.equipment} />
            : <EquipmentArt visual={equipmentVisualFor(ex)} title={labels.equipment} className="h-full" />
        )}
        {tab === 'target' && (
          <div className="flex h-full items-center gap-4">
            <TargetMuscleImage ex={ex} className="max-h-full" />
            <AnatomyMap
              view={media.targetMuscleView === 'front' ? 'back' : 'front'}
              primary={ex.primary} secondary={ex.secondary} palette="chart"
              title={labels.target} className="max-h-full"
            />
            <ul className="space-y-1 text-xs">
              <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-brand-500" />{t('exercise.primary')}</li>
              <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-brand-200" />{t('exercise.secondary')}</li>
              <li className="muted">{ex.primary.map((m) => muscleLabel(m, i18n.language)).join(' · ')}</li>
            </ul>
          </div>
        )}
      </div>
      <div className="mt-2 flex gap-1.5" role="tablist" aria-label={t('exercise.mediaAlt')}>
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-[12px] font-semibold transition ${
              tab === id ? 'bg-brand-500 text-white shadow-cta' : 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300'
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {label}
          </button>
        ))}
      </div>
      {media.sourceName && (
        <p className="mt-2 text-[11px] muted">
          {t('exercise.mediaSource')}:{' '}
          <a href={media.source} target="_blank" rel="noreferrer" className="underline">
            {media.sourceName} – {media.license}
          </a>
        </p>
      )}
    </div>
  );
}

export function ExerciseIllustration({ ex, className = 'h-32 w-full' }: { ex: Exercise; className?: string }) {
  const labels = useMediaLabels(ex);
  return <ExerciseArt pattern={ex.pattern} className={className} title={labels.execution} />;
}

export function InstructionsBlock({ ex, collapsible = false }: { ex: Exercise; collapsible?: boolean }) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(!collapsible);
  const info = buildInstructions(ex, (i18n.language as Locale) ?? 'en');

  const body = (
    <div className="space-y-4 text-sm">
      <Section title={t('exercise.setup')} items={info.setup} />
      <Section title={t('exercise.execution')} items={info.execution} ordered />
      <p className="flex items-start gap-2">
        <Wind className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden />
        <span><strong className="font-semibold">{t('exercise.breathing')}: </strong>{info.breathing}</span>
      </p>
      <Section title={t('exercise.mistakes')} items={info.mistakes} icon={<AlertTriangle className="h-4 w-4 text-warn-500" aria-hidden />} />
      <Section title={t('exercise.safety')} items={info.safety} icon={<ShieldCheck className="h-4 w-4 text-success-500" aria-hidden />} />
      {ex.contraindications.length > 0 && (
        <p className="text-xs muted">
          {t('exercise.contra')}: {ex.contraindications.map((c) => t(`restriction.${c}`)).join(', ')}
        </p>
      )}
    </div>
  );

  if (!collapsible) return body;
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-[46px] w-full items-center justify-between rounded-xl text-sm font-semibold"
      >
        {t('exercise.howTo')}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>
      {open && <div className="pt-2">{body}</div>}
    </div>
  );
}

function Section({ title, items, ordered, icon }: { title: string; items: string[]; ordered?: boolean; icon?: React.ReactNode }) {
  if (items.length === 0) return null;
  const List = ordered ? 'ol' : 'ul';
  return (
    <div>
      <h4 className="mb-1.5 flex items-center gap-2 font-semibold">{icon}{title}</h4>
      <List className={`space-y-1.5 ps-5 ${ordered ? 'list-decimal' : 'list-disc'}`}>
        {items.map((i, idx) => (
          <li key={idx}>{i}</li>
        ))}
      </List>
    </div>
  );
}

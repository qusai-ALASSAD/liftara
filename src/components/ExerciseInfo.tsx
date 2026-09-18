import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, ChevronDown, ShieldCheck, Wind } from 'lucide-react';
import type { Exercise, Locale } from '@/types';
import { buildInstructions } from '@/content/instructions';
import { Badge } from './ui';
import { ExerciseArt } from './ExerciseArt';
import { localized, muscleLabel } from '@/lib/titles';

export const exerciseName = (ex: Exercise, locale: string) => localized(ex.name, locale);

export function ExerciseMeta({ ex }: { ex: Exercise }) {
  const { t, i18n } = useTranslation();
  return (
    <div className="flex flex-wrap gap-1.5">
      {ex.primary.map((m) => (
        <Badge key={`p-${m}`} tone="brand">{muscleLabel(m, i18n.language)}</Badge>
      ))}
      {ex.secondary.map((m) => (
        <Badge key={`s-${m}`}>{muscleLabel(m, i18n.language)}</Badge>
      ))}
      {ex.equipment.map((e) => (
        <Badge key={`e-${e}`} tone="accent">{t(`equip.${e}`)}</Badge>
      ))}
      <Badge tone="warn">{t(`diff.${ex.difficulty}`)}</Badge>
    </div>
  );
}

export function ExerciseIllustration({ ex, className = 'h-32 w-full' }: { ex: Exercise; className?: string }) {
  const { t } = useTranslation();
  return <ExerciseArt pattern={ex.pattern} className={`${className} text-royal-700 dark:text-royal-200`} title={t('exercise.mediaAlt')} />;
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
        <Wind className="mt-0.5 h-4 w-4 shrink-0 text-royal-500" aria-hidden />
        <span><strong className="font-semibold">{t('exercise.breathing')}: </strong>{info.breathing}</span>
      </p>
      <Section title={t('exercise.mistakes')} items={info.mistakes} icon={<AlertTriangle className="h-4 w-4 text-amber-500" aria-hidden />} />
      <Section title={t('exercise.safety')} items={info.safety} icon={<ShieldCheck className="h-4 w-4 text-moss-500" aria-hidden />} />
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
        className="flex w-full items-center justify-between rounded-xl py-2 text-sm font-semibold"
      >
        {t('exercise.execution')}
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
      <h4 className="mb-1 flex items-center gap-2 font-semibold">{icon}{title}</h4>
      <List className={`space-y-1 ps-5 ${ordered ? 'list-decimal' : 'list-disc'}`}>
        {items.map((i, idx) => (
          <li key={idx}>{i}</li>
        ))}
      </List>
    </div>
  );
}

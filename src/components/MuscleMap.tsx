import { useTranslation } from 'react-i18next';
import type { MuscleGroup } from '@/types';
import { MUSCLES } from '@/content/muscles';
import type { Locale } from '@/types';

interface Region { muscle: MuscleGroup; d: string }

/** Eigene, stark stilisierte Körperkarte (keine Nachbildung fremder Illustrationen). */
const FRONT: Region[] = [
  { muscle: 'shoulders', d: 'M32 44 q-9 2 -10 13 q0 6 4 7 q4 -12 10 -14 z M88 44 q9 2 10 13 q0 6 -4 7 q-4 -12 -10 -14 z' },
  { muscle: 'chest', d: 'M42 44 h36 q3 12 -2 20 q-16 5 -32 0 q-5 -8 -2 -20 z' },
  { muscle: 'biceps', d: 'M28 62 q-4 10 -3 20 q5 2 8 -1 q1 -11 3 -18 z M92 62 q4 10 3 20 q-5 2 -8 -1 q-1 -11 -3 -18 z' },
  { muscle: 'forearms', d: 'M25 84 q-3 12 -2 20 q5 2 8 -1 q1 -11 2 -19 z M95 84 q3 12 2 20 q-5 2 -8 -1 q-1 -11 -2 -19 z' },
  { muscle: 'core', d: 'M46 66 h28 q2 16 -1 28 q-13 4 -26 0 q-3 -12 -1 -28 z' },
  { muscle: 'quads', d: 'M44 98 q-4 22 -2 38 q8 3 13 0 q2 -20 2 -38 z M76 98 q4 22 2 38 q-8 3 -13 0 q-2 -20 -2 -38 z' },
  { muscle: 'calves', d: 'M46 142 q-3 16 -1 26 q7 2 11 0 q1 -14 0 -26 z M74 142 q3 16 1 26 q-7 2 -11 0 q-1 -14 0 -26 z' }
];

const BACK: Region[] = [
  { muscle: 'shoulders', d: 'M32 44 q-9 2 -10 13 q0 6 4 7 q4 -12 10 -14 z M88 44 q9 2 10 13 q0 6 -4 7 q-4 -12 -10 -14 z' },
  { muscle: 'back', d: 'M42 44 h36 q4 18 0 34 q-18 6 -36 0 q-4 -16 0 -34 z' },
  { muscle: 'triceps', d: 'M28 62 q-4 10 -3 20 q5 2 8 -1 q1 -11 3 -18 z M92 62 q4 10 3 20 q-5 2 -8 -1 q-1 -11 -3 -18 z' },
  { muscle: 'forearms', d: 'M25 84 q-3 12 -2 20 q5 2 8 -1 q1 -11 2 -19 z M95 84 q3 12 2 20 q-5 2 -8 -1 q-1 -11 -2 -19 z' },
  { muscle: 'glutes', d: 'M44 82 q16 -5 32 0 q3 10 -1 18 q-15 5 -30 0 q-4 -8 -1 -18 z' },
  { muscle: 'hamstrings', d: 'M44 104 q-3 20 -1 34 q8 3 13 0 q1 -18 1 -34 z M76 104 q3 20 1 34 q-8 3 -13 0 q-1 -18 -1 -34 z' },
  { muscle: 'calves', d: 'M46 144 q-3 16 -1 26 q7 2 11 0 q1 -14 0 -26 z M74 144 q3 16 1 26 q-7 2 -11 0 q-1 -14 0 -26 z' }
];

const SILHOUETTE =
  'M60 12 a10 10 0 0 1 0 20 a10 10 0 0 1 0 -20 z M60 34 q18 0 24 10 q10 6 13 22 q3 12 1 24 l-8 26 q-2 6 -6 4 l-3 -18 l-4 40 q-1 22 -3 40 l-3 20 q-6 2 -10 -1 l-2 -34 l-2 -18 l-2 18 l-2 34 q-4 3 -10 1 l-3 -20 q-2 -18 -3 -40 l-4 -40 l-3 18 q-4 2 -6 -4 l-8 -26 q-2 -12 1 -24 q3 -16 13 -22 q6 -10 24 -10 z';

export function MuscleMap({
  side, selected, onSelect, highlight = []
}: { side: 'front' | 'back'; selected?: MuscleGroup | null; onSelect: (m: MuscleGroup) => void; highlight?: MuscleGroup[] }) {
  const { i18n, t } = useTranslation();
  const locale = i18n.language as Locale;
  const regions = side === 'front' ? FRONT : BACK;
  return (
    <svg viewBox="0 0 120 180" className="h-full w-full" role="group" aria-label={t(`muscles.${side}`)}>
      <path d={SILHOUETTE} className="fill-ink-200 dark:fill-ink-700" />
      {regions.map((r) => {
        const isSelected = selected === r.muscle;
        const isHot = highlight.includes(r.muscle);
        return (
          <path
            key={`${side}-${r.muscle}`}
            d={r.d}
            role="button"
            tabIndex={0}
            aria-label={MUSCLES[r.muscle].name[locale] ?? r.muscle}
            aria-pressed={isSelected}
            onClick={() => onSelect(r.muscle)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(r.muscle); } }}
            className={`cursor-pointer transition-colors ${
              isSelected ? 'fill-brand-500' : isHot ? 'fill-success-500/70' : 'fill-brand-300/60 hover:fill-brand-400'
            }`}
          />
        );
      })}
    </svg>
  );
}

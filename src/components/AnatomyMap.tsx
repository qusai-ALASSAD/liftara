import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { MuscleGroup } from '@/types';
import {
  BACK_REGIONS, BODY_VIEWBOX, FRONT_REGIONS, MIRROR, SILHOUETTE_BACK, SILHOUETTE_FRONT,
  type AnatomyRegion
} from '@/content/anatomy';

type View = 'front' | 'back';

interface Props {
  view: View;
  /** aktiv ausgewählte Region (Muskelkarte) */
  selectedRegion?: string | null;
  /** hervorgehobene Muskelgruppen, z. B. Zielmuskeln einer Übung */
  primary?: MuscleGroup[];
  secondary?: MuscleGroup[];
  interactive?: boolean;
  onSelect?: (region: AnatomyRegion) => void;
  className?: string;
  /** Titel für Screenreader, z. B. "Zielmuskeln: Brust" */
  title?: string;
  /**
   * 'anatomical' = natürliche Muskelfarben (interaktive Karte)
   * 'chart'      = neutrale graue Muskeln, nur die Zielmuskeln farbig (Zielmuskel-Bild)
   */
  palette?: 'anatomical' | 'chart';
}

export function AnatomyMap({
  view, selectedRegion, primary = [], secondary = [], interactive = false, onSelect, className = '', title,
  palette = 'anatomical'
}: Props) {
  const chart = palette === 'chart';
  const { t } = useTranslation();
  const uid = useId().replace(/:/g, '');
  const [hover, setHover] = useState<string | null>(null);
  const regions = view === 'front' ? FRONT_REGIONS : BACK_REGIONS;
  const silhouette = view === 'front' ? SILHOUETTE_FRONT : SILHOUETTE_BACK;

  const tone = (r: AnatomyRegion) => {
    if (selectedRegion === r.id) return 'selected';
    if (primary.includes(r.group)) return 'primary';
    if (secondary.includes(r.group)) return 'secondary';
    if (interactive && hover === r.id) return 'hover';
    return 'rest';
  };

  const fill: Record<string, string> = {
    selected: `url(#${uid}-hot)`,
    primary: `url(#${uid}-hot)`,
    secondary: `url(#${uid}-warm)`,
    hover: `url(#${uid}-muscleHover)`,
    rest: `url(#${uid}-muscle)`
  };

  return (
    <svg
      viewBox={BODY_VIEWBOX}
      className={`h-full w-full ${className}`}
      role={interactive ? 'group' : 'img'}
      aria-label={title ?? t(`muscles.${view}`)}
    >
      <defs>
        <linearGradient id={`${uid}-skin`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={chart ? '#F1F3F6' : '#F6DCC9'} />
          <stop offset="100%" stopColor={chart ? '#DFE3E9' : '#E4C0A6'} />
        </linearGradient>
        <linearGradient id={`${uid}-muscle`} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor={chart ? '#CBD1DA' : '#DE9683'} />
          <stop offset="100%" stopColor={chart ? '#AEB6C2' : '#C4745F'} />
        </linearGradient>
        {/* clipPath verträgt nur Formen, keine Gruppen – deshalb flach ausgegeben. */}
        <clipPath id={`${uid}-body`}>
          {silhouette.flatMap((part, i) =>
            part.mirror
              ? [
                  <path key={`clip-${i}`} d={part.d} />,
                  <path key={`clipm-${i}`} d={part.d} transform={MIRROR} />
                ]
              : [<path key={`clip-${i}`} d={part.d} />]
          )}
        </clipPath>
        <linearGradient id={`${uid}-muscleHover`} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#E9A995" />
          <stop offset="100%" stopColor="#CE8168" />
        </linearGradient>
        <linearGradient id={`${uid}-hot`} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#FF8838" />
          <stop offset="100%" stopColor="#E23D00" />
        </linearGradient>
        <linearGradient id={`${uid}-warm`} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#FFD3B3" />
          <stop offset="100%" stopColor="#FFA766" />
        </linearGradient>
      </defs>

      {/* Körper */}
      <g>
        {silhouette.map((part, i) => (
          <g key={`sil-${i}`}>
            <path d={part.d} fill={`url(#${uid}-skin)`} stroke={chart ? '#A9B2BF' : '#B98B72'} strokeWidth="1.1" strokeLinejoin="round" />
            {part.mirror && (
              <path
                d={part.d} fill={`url(#${uid}-skin)`} stroke={chart ? '#A9B2BF' : '#B98B72'}
                strokeWidth="1.1" transform={MIRROR} strokeLinejoin="round"
              />
            )}
          </g>
        ))}
      </g>

      {/* Muskelgruppen – innerhalb der Körperkontur */}
      <g clipPath={`url(#${uid}-body)`}>
      {regions.map((r) => {
        const state = tone(r);
        const active = state !== 'rest';
        const label = t(`anatomy.${r.labelKey}`);
        const common = {
          fill: fill[state],
          stroke: state === 'selected' || state === 'primary' ? '#B33400' : chart ? '#8D97A6' : '#A9674F',
          strokeWidth: 1,
          strokeLinejoin: 'round' as const
        };
        return (
          <g
            key={r.id}
            role={interactive ? 'button' : undefined}
            tabIndex={interactive ? 0 : undefined}
            aria-label={interactive ? label : undefined}
            aria-pressed={interactive ? selectedRegion === r.id : undefined}
            onClick={interactive ? () => onSelect?.(r) : undefined}
            onMouseEnter={interactive ? () => setHover(r.id) : undefined}
            onMouseLeave={interactive ? () => setHover(null) : undefined}
            onKeyDown={
              interactive
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelect?.(r);
                    }
                  }
                : undefined
            }
            className={`transition-opacity ${interactive ? 'cursor-pointer focus:outline-none' : ''}`}
            style={{ opacity: active ? 1 : 0.9 }}
          >
            {r.paths.map((d, i) => (
              <path key={`p-${i}`} d={d} {...common} />
            ))}
            {!r.symmetric &&
              r.paths.map((d, i) => <path key={`m-${i}`} d={d} transform={MIRROR} {...common} />)}
            {r.fibers?.map((d, i) => (
              <g key={`f-${i}`} opacity={0.45}>
                <path d={d} fill="none" stroke={chart ? '#F4F6F9' : '#FBE6DA'} strokeWidth="0.9" strokeLinecap="round" />
                <path d={d} fill="none" stroke={chart ? '#F4F6F9' : '#FBE6DA'} strokeWidth="0.9" strokeLinecap="round" transform={MIRROR} />
              </g>
            ))}
            {(state === 'selected' || state === 'primary') &&
              r.paths.map((d, i) => (
                <g key={`g-${i}`}>
                  <path d={d} fill="none" stroke="#FF6B00" strokeWidth="2.6" opacity="0.5" />
                  <path d={d} fill="none" stroke="#FF6B00" strokeWidth="2.6" opacity="0.5" transform={MIRROR} />
                </g>
              ))}
          </g>
        );
      })}
      </g>
    </svg>
  );
}

/** Kompakte Zielmuskel-Grafik für Übungskarten und Übungsdetails. */
export function TargetMuscleFigure({
  view, primary, secondary = [], className = '', title
}: {
  view: View;
  primary: MuscleGroup[];
  secondary?: MuscleGroup[];
  className?: string;
  title?: string;
}) {
  return (
    <AnatomyMap view={view} primary={primary} secondary={secondary} className={className} title={title} palette="chart" />
  );
}

import type { MovementPattern } from '@/types';

type Pose = 'press' | 'pull' | 'squat' | 'hinge' | 'curl' | 'core' | 'calf';

const POSE: Record<MovementPattern, Pose> = {
  horizontalPress: 'press', inclinePress: 'press', verticalPress: 'press',
  horizontalPull: 'pull', verticalPull: 'pull',
  squat: 'squat', lunge: 'squat', hinge: 'hinge',
  curl: 'curl', triceps: 'curl', forearm: 'curl',
  lateralRaise: 'pull', rearDelt: 'pull', hipAbduction: 'squat',
  coreBrace: 'core', coreFlexion: 'core', calf: 'calf', carryFullBody: 'hinge'
};

/**
 * Eigene, neutrale Schemazeichnungen als Platzhalter.
 * Später kann `media.ref` auf eigene Videos zeigen, die Komponente bleibt gleich.
 */
export function ExerciseArt({ pattern, className = '', title }: { pattern: MovementPattern; className?: string; title?: string }) {
  const pose = POSE[pattern] ?? 'press';
  const body = 'currentColor';
  return (
    <svg viewBox="0 0 120 90" role="img" aria-label={title} className={className}>
      <defs>
        <linearGradient id="liftara-art" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="rgb(var(--brand))" stopOpacity="0.14" />
          <stop offset="100%" stopColor="rgb(var(--accent))" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="120" height="90" rx="14" fill="url(#liftara-art)" />
      <g stroke={body} strokeWidth="3.2" strokeLinecap="round" fill="none" opacity="0.85">
        {pose === 'press' && (
          <>
            <line x1="26" y1="62" x2="94" y2="62" />
            <circle cx="60" cy="52" r="5" fill={body} stroke="none" />
            <path d="M48 62 L60 57 L72 62" />
            <path d="M44 40 L76 40" strokeWidth="4.5" />
            <path d="M48 57 L46 42 M72 57 L74 42" />
            <circle cx="44" cy="40" r="4" fill={body} stroke="none" />
            <circle cx="76" cy="40" r="4" fill={body} stroke="none" />
          </>
        )}
        {pose === 'pull' && (
          <>
            <path d="M60 20 L60 44" />
            <circle cx="60" cy="50" r="5" fill={body} stroke="none" />
            <path d="M40 24 L80 24" strokeWidth="4.5" />
            <path d="M48 47 L44 26 M72 47 L76 26" />
            <path d="M55 56 L52 74 M65 56 L68 74" />
          </>
        )}
        {pose === 'squat' && (
          <>
            <circle cx="60" cy="24" r="5.5" fill={body} stroke="none" />
            <path d="M60 30 L60 50" />
            <path d="M40 34 L80 34" strokeWidth="4.5" />
            <path d="M60 50 L46 62 L46 74 M60 50 L74 62 L74 74" />
            <path d="M36 74 L84 74" strokeWidth="2" opacity="0.5" />
          </>
        )}
        {pose === 'hinge' && (
          <>
            <circle cx="36" cy="32" r="5.5" fill={body} stroke="none" />
            <path d="M42 36 L70 44" />
            <path d="M70 44 L72 64 L66 76" />
            <path d="M52 40 L50 62" />
            <path d="M40 60 L64 60" strokeWidth="4.5" />
            <circle cx="40" cy="60" r="4" fill={body} stroke="none" />
            <circle cx="64" cy="60" r="4" fill={body} stroke="none" />
          </>
        )}
        {pose === 'curl' && (
          <>
            <circle cx="60" cy="22" r="5.5" fill={body} stroke="none" />
            <path d="M60 28 L60 56" />
            <path d="M60 36 L44 48 L52 58" />
            <path d="M60 36 L76 48 L68 58" />
            <path d="M46 58 L58 58 M62 58 L74 58" strokeWidth="4.5" />
            <path d="M54 56 L50 76 M66 56 L70 76" />
          </>
        )}
        {pose === 'core' && (
          <>
            <path d="M28 66 L92 66" strokeWidth="2" opacity="0.45" />
            <circle cx="34" cy="48" r="5.5" fill={body} stroke="none" />
            <path d="M40 50 L86 60" />
            <path d="M46 52 L44 66 M84 60 L88 66" />
          </>
        )}
        {pose === 'calf' && (
          <>
            <circle cx="60" cy="22" r="5.5" fill={body} stroke="none" />
            <path d="M60 28 L60 52" />
            <path d="M60 52 L52 68 L52 74 M60 52 L68 68 L68 74" />
            <path d="M44 76 L76 76" strokeWidth="4" />
            <path d="M46 40 L74 40" strokeWidth="2" opacity="0.4" />
          </>
        )}
      </g>
    </svg>
  );
}

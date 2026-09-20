import type { MovementPattern } from '@/types';

/**
 * Eigene Ausführungs-Illustrationen: eine schematische, aber anatomisch
 * proportionierte Figur je Bewegungsmuster – kein wiederholtes Symbol.
 * Später kann `Exercise.media` auf eigene Videos zeigen; diese Komponente bleibt.
 */
type Pose =
  | 'benchPress' | 'overheadPress' | 'row' | 'pulldown' | 'squat' | 'hinge'
  | 'lunge' | 'curl' | 'pushdown' | 'lateralRaise' | 'core' | 'calf' | 'carry';

const POSE: Record<MovementPattern, Pose> = {
  horizontalPress: 'benchPress',
  inclinePress: 'benchPress',
  verticalPress: 'overheadPress',
  horizontalPull: 'row',
  verticalPull: 'pulldown',
  squat: 'squat',
  hinge: 'hinge',
  lunge: 'lunge',
  curl: 'curl',
  triceps: 'pushdown',
  lateralRaise: 'lateralRaise',
  rearDelt: 'lateralRaise',
  calf: 'calf',
  coreBrace: 'core',
  coreFlexion: 'core',
  hipAbduction: 'squat',
  forearm: 'curl',
  carryFullBody: 'carry'
};

const BODY = '#2B3542';
const BODY_SOFT = '#475467';
const GEAR = '#FF6B00';
const GEAR_DARK = '#C24700';

const Limb = ({ d, w = 7, color = BODY }: { d: string; w?: number; color?: string }) => (
  <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
);

const Head = ({ x, y, r = 9 }: { x: number; y: number; r?: number }) => <circle cx={x} cy={y} r={r} fill={BODY} />;

const BarWeight = ({ x, y, w = 60 }: { x: number; y: number; w?: number }) => (
  <>
    <rect x={x} y={y - 2} width={w} height="4" rx="2" fill={GEAR_DARK} />
    <rect x={x - 5} y={y - 12} width="8" height="24" rx="3" fill={GEAR} />
    <rect x={x + w - 3} y={y - 12} width="8" height="24" rx="3" fill={GEAR} />
  </>
);

const Bell = ({ x, y }: { x: number; y: number }) => (
  <>
    <rect x={x - 11} y={y - 2} width="22" height="4" rx="2" fill={GEAR_DARK} />
    <rect x={x - 16} y={y - 8} width="7" height="16" rx="2.5" fill={GEAR} />
    <rect x={x + 9} y={y - 8} width="7" height="16" rx="2.5" fill={GEAR} />
  </>
);

const Ground = ({ y = 122 }: { y?: number }) => (
  <rect x="14" y={y} width="172" height="3.5" rx="1.75" fill="#D0D5DD" />
);

const POSES: Record<Pose, () => JSX.Element> = {
  benchPress: () => (
    <>
      <Ground />
      <rect x="44" y="92" width="112" height="10" rx="5" fill="#D0D5DD" />
      <Limb d="M58 88 H132" w={11} color={BODY_SOFT} />
      <Head x={50} y={88} />
      <Limb d="M132 88 l16 16" />
      <Limb d="M110 86 l6 -22 M86 86 l-4 -22" />
      <BarWeight x={62} y={60} w={54} />
      <Limb d="M148 104 l10 14" />
    </>
  ),
  overheadPress: () => (
    <>
      <Ground />
      <Head x={100} y={34} />
      <Limb d="M100 44 V86" w={10} color={BODY_SOFT} />
      <Limb d="M100 56 l-18 -4 M100 56 l18 -4" />
      <BarWeight x={68} y={48} w={64} />
      <Limb d="M100 86 l-12 34 M100 86 l12 34" />
    </>
  ),
  row: () => (
    <>
      <Ground />
      <Head x={54} y={54} />
      <Limb d="M62 58 C 92 62 120 70 142 76" w={10} color={BODY_SOFT} />
      <Limb d="M96 66 l-4 26" />
      <BarWeight x={64} y={98} w={54} />
      <Limb d="M142 76 l6 44 M142 76 l-8 44" />
    </>
  ),
  pulldown: () => (
    <>
      <Ground />
      <rect x="40" y="18" width="120" height="5" rx="2.5" fill="#D0D5DD" />
      <Limb d="M100 23 V38" w={3} color="#98A2B3" />
      <BarWeight x={70} y={42} w={60} />
      <Head x={100} y={62} />
      <Limb d="M100 72 V96" w={10} color={BODY_SOFT} />
      <Limb d="M100 76 l-22 -30 M100 76 l22 -30" />
      <rect x="76" y="96" width="48" height="9" rx="4" fill="#D0D5DD" />
      <Limb d="M100 100 l22 8 M122 108 l2 14" />
    </>
  ),
  squat: () => (
    <>
      <Ground />
      <Head x={100} y={34} />
      <Limb d="M100 44 L 96 78" w={10} color={BODY_SOFT} />
      <BarWeight x={68} y={50} w={64} />
      <Limb d="M96 78 L 122 92 L 118 120" />
      <Limb d="M96 78 L 74 92 L 80 120" />
      <Limb d="M100 52 l-16 0 M100 52 l16 0" w={6} />
    </>
  ),
  hinge: () => (
    <>
      <Ground />
      <Head x={62} y={44} />
      <Limb d="M70 50 C 96 58 118 66 132 72" w={10} color={BODY_SOFT} />
      <Limb d="M132 72 l2 22 l-6 26" />
      <Limb d="M100 62 l-4 34" />
      <BarWeight x={70} y={100} w={56} />
    </>
  ),
  lunge: () => (
    <>
      <Ground />
      <Head x={92} y={34} />
      <Limb d="M92 44 V76" w={10} color={BODY_SOFT} />
      <Limb d="M92 76 L 126 96 L 126 120" />
      <Limb d="M92 76 L 66 102 L 80 120" />
      <Bell x={74} y={72} />
      <Bell x={112} y={72} />
    </>
  ),
  curl: () => (
    <>
      <Ground />
      <Head x={100} y={32} />
      <Limb d="M100 42 V88" w={10} color={BODY_SOFT} />
      <Limb d="M100 54 l-16 16 l10 -14" />
      <Limb d="M100 54 l16 16 l-10 -14" />
      <Bell x={82} y={62} />
      <Bell x={118} y={62} />
      <Limb d="M100 88 l-10 32 M100 88 l10 32" />
    </>
  ),
  pushdown: () => (
    <>
      <Ground />
      <rect x="150" y="14" width="6" height="30" rx="3" fill="#D0D5DD" />
      <Limb d="M153 40 C 140 52 126 62 116 68" w={3} color="#98A2B3" />
      <Head x={92} y={36} />
      <Limb d="M92 46 V90" w={10} color={BODY_SOFT} />
      <Limb d="M92 58 l20 10 l-6 14" />
      <rect x="100" y="80" width="22" height="6" rx="3" fill={GEAR} />
      <Limb d="M92 90 l-10 30 M92 90 l10 30" />
    </>
  ),
  lateralRaise: () => (
    <>
      <Ground />
      <Head x={100} y={34} />
      <Limb d="M100 44 V88" w={10} color={BODY_SOFT} />
      <Limb d="M100 56 L 64 50" />
      <Limb d="M100 56 L 136 50" />
      <Bell x={58} y={50} />
      <Bell x={142} y={50} />
      <Limb d="M100 88 l-10 32 M100 88 l10 32" />
    </>
  ),
  core: () => (
    <>
      <Ground />
      <rect x="30" y="112" width="140" height="9" rx="4.5" fill={GEAR} opacity="0.35" />
      <Head x={48} y={70} />
      <Limb d="M56 74 C 92 82 128 92 152 100" w={10} color={BODY_SOFT} />
      <Limb d="M64 78 L 58 110" />
      <Limb d="M152 100 l4 12" />
    </>
  ),
  calf: () => (
    <>
      <Ground />
      <rect x="66" y="108" width="68" height="14" rx="4" fill="#D0D5DD" />
      <Head x={100} y={30} />
      <Limb d="M100 40 V80" w={10} color={BODY_SOFT} />
      <Limb d="M100 80 l-8 24 l-4 6 M100 80 l8 24 l4 6" />
      <Bell x={78} y={64} />
      <Bell x={122} y={64} />
    </>
  ),
  carry: () => (
    <>
      <Ground />
      <Head x={100} y={30} />
      <Limb d="M100 40 V86" w={10} color={BODY_SOFT} />
      <Limb d="M100 50 l-18 34 M100 50 l18 34" />
      <Bell x={78} y={92} />
      <Bell x={122} y={92} />
      <Limb d="M100 86 l-10 34 M100 86 l10 34" />
    </>
  )
};

export function ExerciseArt({
  pattern, className = '', title
}: {
  pattern: MovementPattern;
  className?: string;
  title?: string;
}) {
  const Art = POSES[POSE[pattern] ?? 'benchPress'];
  return (
    <svg viewBox="0 0 200 140" role="img" aria-label={title} className={`h-full w-full ${className}`}>
      <Art />
    </svg>
  );
}

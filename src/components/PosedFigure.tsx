/**
 * Eigene, anatomisch proportionierte Figur in Trainingsposen.
 * Wird für die Übungen genutzt, für die es keine frei lizenzierten Fotos gibt –
 * gezeichnet als Körper mit Rumpf, Gliedmaßen und Muskelzeichnung, nicht als Strichmännchen.
 */

export type Phase = 'start' | 'finish';
type P = [number, number];

interface Pose {
  head: P;
  neck: P;
  hip: P;
  shoulder: P;
  elbow: P;
  wrist: P;
  knee: P;
  ankle: P;
  toe: P;
  farElbow?: P;
  farWrist?: P;
  farKnee?: P;
  farAnkle?: P;
  farToe?: P;
  /** Ansatzpunkte der Gliedmaßen, falls sie nicht in der Körpermitte liegen */
  shoulderNear?: P;
  shoulderFar?: P;
  hipNear?: P;
  hipFar?: P;
  /** zusätzliche Geräte-/Umgebungselemente */
  props?: 'band-floor' | 'band-hands' | 'band-knees' | 'dumbbells' | 'wall' | 'floor-hands' | 'toes' | 'none';
}

const SKIN = '#F0D2BC';
const SKIN_DARK = '#D9B197';
const SKIN_FAR = '#D8B9A4';
const OUTLINE = '#A9755C';
const MUSCLE = '#D98C7A';
const GEAR = '#FF6B00';
const GEAR_DARK = '#C24700';
const FLOOR = '#D0D5DD';

/** Konisches Segment zwischen zwei Gelenken. */
function limb(a: P, b: P, w1: number, w2: number): string {
  const [x1, y1] = a;
  const [x2, y2] = b;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const p = (x: number, y: number, n: number, w: number) => `${(x + nx * w * n).toFixed(1)} ${(y + ny * w * n).toFixed(1)}`;
  return [
    `M${p(x1, y1, 1, w1 / 2)}`,
    `L${p(x2, y2, 1, w2 / 2)}`,
    `L${p(x2, y2, -1, w2 / 2)}`,
    `L${p(x1, y1, -1, w1 / 2)}`,
    'Z'
  ].join(' ');
}

const mid = (a: P, b: P): P => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

/* ------------------------------------------------------------------ */
/* Posen                                                               */
/* ------------------------------------------------------------------ */

const POSES: Record<string, Pose> = {
  // --- Rudern am Band (Seitenansicht, Zugrichtung nach hinten) ---
  'band-row:start': {
    head: [84, 48], neck: [86, 66], shoulder: [90, 76], hip: [102, 136],
    shoulderNear: [88, 80], shoulderFar: [94, 72],
    elbow: [124, 92], wrist: [152, 100],
    farElbow: [122, 84], farWrist: [150, 92],
    hipNear: [98, 138], hipFar: [108, 134],
    knee: [96, 180], ankle: [94, 218], toe: [110, 224],
    farKnee: [110, 180], farAnkle: [112, 218], farToe: [128, 224],
    props: 'band-hands'
  },
  'band-row:finish': {
    head: [84, 46], neck: [86, 64], shoulder: [90, 74], hip: [102, 136],
    shoulderNear: [88, 78], shoulderFar: [94, 70],
    elbow: [76, 104], wrist: [106, 104],
    farElbow: [74, 96], farWrist: [104, 96],
    hipNear: [98, 138], hipFar: [108, 134],
    knee: [96, 180], ankle: [94, 218], toe: [110, 224],
    farKnee: [110, 180], farAnkle: [112, 218], farToe: [128, 224],
    props: 'band-hands'
  },

  // --- Bizepscurl am Band (Vorderansicht) ---
  'band-curl:start': {
    head: [100, 36], neck: [100, 56], shoulder: [100, 68], hip: [100, 128],
    shoulderNear: [82, 72], shoulderFar: [118, 72],
    elbow: [76, 104], wrist: [74, 142],
    farElbow: [124, 104], farWrist: [126, 142],
    hipNear: [90, 132], hipFar: [110, 132],
    knee: [88, 176], ankle: [86, 214], toe: [98, 222],
    farKnee: [112, 176], farAnkle: [114, 214], farToe: [126, 222],
    props: 'band-floor'
  },
  'band-curl:finish': {
    head: [100, 36], neck: [100, 56], shoulder: [100, 68], hip: [100, 128],
    shoulderNear: [82, 72], shoulderFar: [118, 72],
    elbow: [76, 106], wrist: [86, 78],
    farElbow: [124, 106], farWrist: [114, 78],
    hipNear: [90, 132], hipFar: [110, 132],
    knee: [88, 176], ankle: [86, 214], toe: [98, 222],
    farKnee: [112, 176], farAnkle: [114, 214], farToe: [126, 222],
    props: 'band-floor'
  },

  // --- Hüftabduktion mit Band (Vorderansicht) ---
  'band-hip-abduction:start': {
    head: [100, 36], neck: [100, 56], shoulder: [100, 68], hip: [100, 128],
    shoulderNear: [82, 72], shoulderFar: [118, 72],
    elbow: [74, 102], wrist: [72, 138],
    farElbow: [126, 102], farWrist: [128, 138],
    hipNear: [90, 132], hipFar: [110, 132],
    knee: [88, 176], ankle: [86, 214], toe: [98, 222],
    farKnee: [112, 176], farAnkle: [114, 214], farToe: [126, 222],
    props: 'band-knees'
  },
  'band-hip-abduction:finish': {
    head: [100, 36], neck: [100, 56], shoulder: [100, 68], hip: [100, 128],
    shoulderNear: [82, 72], shoulderFar: [118, 72],
    elbow: [74, 102], wrist: [72, 138],
    farElbow: [126, 102], farWrist: [128, 138],
    hipNear: [90, 132], hipFar: [110, 132],
    knee: [66, 172], ankle: [50, 208], toe: [38, 216],
    farKnee: [112, 176], farAnkle: [114, 214], farToe: [126, 222],
    props: 'band-knees'
  },

  // --- Wandsitz (Seitenansicht, Wand links) ---
  'wall-sit:start': {
    head: [78, 40], neck: [78, 60], shoulder: [80, 72], hip: [82, 132],
    shoulderNear: [86, 76], shoulderFar: [74, 74],
    elbow: [96, 102], wrist: [100, 138],
    farElbow: [68, 102], farWrist: [64, 138],
    hipNear: [86, 134], hipFar: [78, 132],
    knee: [86, 178], ankle: [84, 216], toe: [100, 222],
    farKnee: [78, 178], farAnkle: [76, 216], farToe: [92, 222],
    props: 'wall'
  },
  'wall-sit:finish': {
    head: [78, 96], neck: [78, 114], shoulder: [80, 124], hip: [84, 174],
    shoulderNear: [86, 128], shoulderFar: [74, 126],
    elbow: [104, 148], wrist: [124, 166],
    farElbow: [96, 156], farWrist: [116, 174],
    hipNear: [88, 176], hipFar: [80, 172],
    knee: [136, 176], ankle: [136, 216], toe: [152, 222],
    farKnee: [128, 180], farAnkle: [128, 216], farToe: [144, 222],
    props: 'wall'
  },

  // --- Wadenheben ohne Gerät (Vorderansicht) ---
  'calf-raise-bodyweight:start': {
    head: [100, 40], neck: [100, 60], shoulder: [100, 72], hip: [100, 132],
    shoulderNear: [82, 76], shoulderFar: [118, 76],
    elbow: [76, 106], wrist: [74, 142],
    farElbow: [124, 106], farWrist: [126, 142],
    hipNear: [90, 136], hipFar: [110, 136],
    knee: [88, 178], ankle: [86, 214], toe: [98, 222],
    farKnee: [112, 178], farAnkle: [114, 214], farToe: [126, 222],
    props: 'none'
  },
  'calf-raise-bodyweight:finish': {
    head: [100, 24], neck: [100, 44], shoulder: [100, 56], hip: [100, 116],
    shoulderNear: [82, 60], shoulderFar: [118, 60],
    elbow: [76, 90], wrist: [74, 126],
    farElbow: [124, 90], farWrist: [126, 126],
    hipNear: [90, 120], hipFar: [110, 120],
    knee: [88, 164], ankle: [86, 200], toe: [96, 220],
    farKnee: [112, 164], farAnkle: [114, 200], farToe: [124, 220],
    props: 'toes'
  },

  // --- Thruster mit Kurzhanteln (Vorderansicht) ---
  'dumbbell-thruster:start': {
    head: [100, 76], neck: [100, 96], shoulder: [100, 106], hip: [100, 150],
    shoulderNear: [82, 108], shoulderFar: [118, 108],
    elbow: [74, 130], wrist: [84, 104],
    farElbow: [126, 130], farWrist: [116, 104],
    hipNear: [88, 152], hipFar: [112, 152],
    knee: [72, 176], ankle: [80, 214], toe: [92, 222],
    farKnee: [128, 176], farAnkle: [120, 214], farToe: [132, 222],
    props: 'dumbbells'
  },
  'dumbbell-thruster:finish': {
    head: [100, 44], neck: [100, 64], shoulder: [100, 76], hip: [100, 134],
    shoulderNear: [82, 78], shoulderFar: [118, 78],
    elbow: [80, 48], wrist: [86, 20],
    farElbow: [120, 48], farWrist: [114, 20],
    hipNear: [90, 138], hipFar: [110, 138],
    knee: [88, 180], ankle: [86, 216], toe: [98, 222],
    farKnee: [112, 180], farAnkle: [114, 216], farToe: [126, 222],
    props: 'dumbbells'
  },

  // --- Bear Crawl (Seitenansicht) ---
  'bear-crawl:start': {
    head: [56, 118], neck: [70, 122], shoulder: [80, 126], hip: [142, 134],
    shoulderNear: [80, 130], shoulderFar: [76, 122],
    elbow: [82, 158], wrist: [84, 196],
    farElbow: [96, 156], farWrist: [98, 196],
    hipNear: [140, 138], hipFar: [146, 130],
    knee: [148, 170], ankle: [132, 196], toe: [124, 202],
    farKnee: [142, 172], farAnkle: [158, 196], farToe: [166, 202],
    props: 'floor-hands'
  },
  'bear-crawl:finish': {
    head: [52, 114], neck: [66, 120], shoulder: [78, 124], hip: [142, 134],
    shoulderNear: [78, 128], shoulderFar: [74, 120],
    elbow: [64, 152], wrist: [56, 194],
    farElbow: [100, 154], farWrist: [106, 196],
    hipNear: [140, 138], hipFar: [146, 130],
    knee: [156, 164], ankle: [150, 196], toe: [142, 202],
    farKnee: [136, 176], farAnkle: [152, 194], farToe: [160, 200],
    props: 'floor-hands'
  },

  // --- Burpee mit Schritt (Stand -> Stütz) ---
  'burpee-step:start': {
    head: [100, 40], neck: [100, 60], shoulder: [100, 72], hip: [100, 132],
    shoulderNear: [82, 76], shoulderFar: [118, 76],
    elbow: [78, 106], wrist: [76, 142],
    farElbow: [122, 106], farWrist: [124, 142],
    hipNear: [90, 136], hipFar: [110, 136],
    knee: [88, 178], ankle: [86, 214], toe: [98, 222],
    farKnee: [112, 178], farAnkle: [114, 214], farToe: [126, 222],
    props: 'none'
  },
  'burpee-step:finish': {
    head: [48, 140], neck: [62, 146], shoulder: [74, 150], hip: [140, 164],
    shoulderNear: [74, 154], shoulderFar: [70, 146],
    elbow: [74, 174], wrist: [72, 200],
    farElbow: [84, 172], farWrist: [82, 200],
    hipNear: [138, 168], hipFar: [144, 160],
    knee: [172, 182], ankle: [186, 200], toe: [194, 206],
    farKnee: [166, 186], farAnkle: [180, 202], farToe: [188, 208],
    props: 'floor-hands'
  }
};


export const POSED_EXERCISES = [...new Set(Object.keys(POSES).map((k) => k.split(':')[0]!))];
export const hasPose = (exerciseId: string, phase: Phase) => Boolean(POSES[`${exerciseId}:${phase}`]);

/* ------------------------------------------------------------------ */
/* Darstellung                                                         */
/* ------------------------------------------------------------------ */

function Props({ pose }: { pose: Pose }) {
  switch (pose.props) {
    case 'band-floor':
      return (
        <>
          <path
            d={`M${pose.ankle[0] - 6} ${pose.ankle[1] + 4} C ${pose.wrist[0] - 14} ${pose.wrist[1] + 20}, ${pose.wrist[0] - 10} ${pose.wrist[1] + 6}, ${pose.wrist[0]} ${pose.wrist[1]}`}
            fill="none" stroke={GEAR} strokeWidth="3.5" strokeLinecap="round"
          />
          <path
            d={`M${pose.ankle[0] + 6} ${pose.ankle[1] + 4} C ${pose.wrist[0] + 18} ${pose.wrist[1] + 20}, ${pose.wrist[0] + 14} ${pose.wrist[1] + 6}, ${(pose.farWrist ?? pose.wrist)[0]} ${(pose.farWrist ?? pose.wrist)[1]}`}
            fill="none" stroke={GEAR} strokeWidth="3.5" strokeLinecap="round"
          />
        </>
      );
    case 'band-hands':
      return (
        <>
          <rect x="176" y="70" width="8" height="150" rx="4" fill="#98A2B3" />
          <path
            d={`M178 96 C ${pose.wrist[0] + 30} ${pose.wrist[1] - 4}, ${pose.wrist[0] + 16} ${pose.wrist[1]}, ${pose.wrist[0]} ${pose.wrist[1]}`}
            fill="none" stroke={GEAR} strokeWidth="3.5" strokeLinecap="round"
          />
          <path
            d={`M178 104 C ${pose.wrist[0] + 30} ${pose.wrist[1] + 8}, ${pose.wrist[0] + 16} ${pose.wrist[1] + 8}, ${(pose.farWrist ?? pose.wrist)[0]} ${(pose.farWrist ?? pose.wrist)[1]}`}
            fill="none" stroke={GEAR_DARK} strokeWidth="3.5" strokeLinecap="round"
          />
        </>
      );
    case 'band-knees':
      return (
        <path
          d={`M${pose.knee[0]} ${pose.knee[1] - 6} C ${(pose.knee[0] + (pose.farKnee ?? pose.knee)[0]) / 2} ${pose.knee[1] - 18}, ${(pose.knee[0] + (pose.farKnee ?? pose.knee)[0]) / 2} ${pose.knee[1] + 8}, ${(pose.farKnee ?? pose.knee)[0]} ${(pose.farKnee ?? pose.knee)[1] - 6}`}
          fill="none" stroke={GEAR} strokeWidth="6" strokeLinecap="round"
        />
      );
    case 'dumbbells':
      return (
        <>
          {[pose.wrist, pose.farWrist ?? pose.wrist].map((w, i) => (
            <g key={i} transform={`translate(${w[0]} ${w[1]})`}>
              <rect x="-11" y="-2.5" width="22" height="5" rx="2.5" fill="#18202A" />
              <rect x="-17" y="-8" width="7" height="16" rx="2.5" fill={GEAR} />
              <rect x="10" y="-8" width="7" height="16" rx="2.5" fill={GEAR} />
            </g>
          ))}
        </>
      );
    case 'wall':
      return <rect x="44" y="14" width="12" height="206" rx="3" fill="#C3C9D3" />;
    case 'toes':
      return <rect x="70" y="212" width="80" height="8" rx="4" fill={GEAR} opacity="0.35" />;
    default:
      return null;
  }
}

export function PosedFigure({
  exerciseId, phase, className = '', title
}: {
  exerciseId: string;
  phase: Phase;
  className?: string;
  title?: string;
}) {
  const pose = POSES[`${exerciseId}:${phase}`];
  if (!pose) return null;

  const far = (j: P | undefined, fallback: P) => j ?? fallback;
  const farElbow = far(pose.farElbow, pose.elbow);
  const farWrist = far(pose.farWrist, pose.wrist);
  const farKnee = far(pose.farKnee, pose.knee);
  const farAnkle = far(pose.farAnkle, pose.ankle);
  const farToe = far(pose.farToe, pose.toe);

  const shoulderNear = pose.shoulderNear ?? pose.shoulder;
  const shoulderFar = pose.shoulderFar ?? pose.shoulder;
  const hipNear = pose.hipNear ?? pose.hip;
  const hipFar = pose.hipFar ?? pose.hip;

  const torso = [
    `M${pose.shoulder[0] - 19} ${pose.shoulder[1] - 5}`,
    `L${pose.shoulder[0] + 19} ${pose.shoulder[1] + 5}`,
    `L${pose.hip[0] + 15} ${pose.hip[1] + 5}`,
    `L${pose.hip[0] - 15} ${pose.hip[1] - 5}`,
    'Z'
  ].join(' ');
  const chest = mid(pose.shoulder, pose.hip);

  return (
    <svg viewBox="0 0 200 240" role="img" aria-label={title} className={`h-full w-full ${className}`}>
      <rect x="0" y="222" width="200" height="4" rx="2" fill={FLOOR} />
      <Props pose={pose} />

      {/* hintere Gliedmaßen */}
      <g fill={SKIN_FAR} stroke={OUTLINE} strokeWidth="1" strokeLinejoin="round">
        <path d={limb(shoulderFar, farElbow, 19, 14)} />
        <path d={limb(farElbow, farWrist, 14, 10)} />
        <path d={limb(hipFar, farKnee, 26, 18)} />
        <path d={limb(farKnee, farAnkle, 18, 12)} />
        <path d={limb(farAnkle, farToe, 12, 8)} />
      </g>

      {/* Rumpf */}
      <g stroke={OUTLINE} strokeWidth="1.1" strokeLinejoin="round">
        <path d={torso} fill={SKIN} />
        <path d={limb(pose.neck, pose.shoulder, 16, 30)} fill={SKIN} />
        <ellipse cx={chest[0]} cy={chest[1] - 6} rx="13" ry="9" fill={MUSCLE} opacity="0.55" stroke="none" />
        <ellipse cx={chest[0]} cy={chest[1] + 10} rx="10" ry="8" fill={MUSCLE} opacity="0.35" stroke="none" />
      </g>

      {/* vordere Gliedmaßen */}
      <g fill={SKIN} stroke={OUTLINE} strokeWidth="1.1" strokeLinejoin="round">
        <path d={limb(hipNear, pose.knee, 28, 20)} />
        <path d={limb(pose.knee, pose.ankle, 20, 13)} />
        <path d={limb(pose.ankle, pose.toe, 13, 9)} />
        <path d={limb(shoulderNear, pose.elbow, 21, 15)} />
        <path d={limb(pose.elbow, pose.wrist, 15, 11)} />
      </g>

      {/* Muskelzeichnung auf den vorderen Gliedmaßen */}
      <g fill={MUSCLE} opacity="0.5" stroke="none">
        <path d={limb(shoulderNear, mid(shoulderNear, pose.elbow), 14, 11)} />
        <path d={limb(hipNear, mid(hipNear, pose.knee), 19, 15)} />
        <path d={limb(pose.knee, mid(pose.knee, pose.ankle), 12, 9)} />
      </g>

      {/* Kopf */}
      <g stroke={OUTLINE} strokeWidth="1.1">
        <ellipse cx={pose.head[0]} cy={pose.head[1]} rx="14" ry="16" fill={SKIN} />
        <path d={`M${pose.head[0] - 14} ${pose.head[1] - 4} a14 16 0 0 1 28 0 z`} fill={SKIN_DARK} stroke="none" />
      </g>

      {/* Hände und Füße */}
      <g fill={SKIN_DARK} stroke={OUTLINE} strokeWidth="1">
        <circle cx={pose.wrist[0]} cy={pose.wrist[1]} r="7" />
        <circle cx={farWrist[0]} cy={farWrist[1]} r="6" fill={SKIN_FAR} />
      </g>
    </svg>
  );
}

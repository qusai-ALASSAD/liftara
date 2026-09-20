import type { ReactElement } from 'react';

/**
 * Eigene, für LIFTARA gezeichnete Geräte-Illustrationen.
 * Bewusst als SVG statt als Foto: verlustfrei skalierbar, wenige Kilobyte,
 * offline verfügbar und ohne fremde Bildrechte weitergebbar.
 * Wer später Fotos einsetzen möchte, ersetzt nur `EquipmentArt`.
 */

const FRAME = '#39434F';
const FRAME_DARK = '#232B36';
const STEEL = '#A3ACBA';
const PAD = '#FF6B00';
const PAD_DARK = '#C24700';
const PLATE = '#5A6472';
const GRIP = '#18202A';

const Floor = () => (
  <>
    <rect x="0" y="118" width="200" height="22" fill="#EDEFF3" />
    <rect x="0" y="118" width="200" height="2" fill="#DCE0E7" />
  </>
);

const Bar = ({ x = 30, y = 40, w = 140 }: { x?: number; y?: number; w?: number }) => (
  <>
    <rect x={x} y={y} width={w} height="4" rx="2" fill={STEEL} />
    <rect x={x - 4} y={y - 12} width="8" height="28" rx="3" fill={PLATE} />
    <rect x={x + 4} y={y - 8} width="6" height="20" rx="3" fill={PLATE} />
    <rect x={x + w - 4} y={y - 12} width="8" height="28" rx="3" fill={PLATE} />
    <rect x={x + w - 10} y={y - 8} width="6" height="20" rx="3" fill={PLATE} />
  </>
);

const WeightStack = ({ x = 20, y = 46 }: { x?: number; y?: number }) => (
  <>
    <rect x={x} y={y} width="26" height="62" rx="4" fill={FRAME_DARK} />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <rect key={i} x={x + 3} y={y + 5 + i * 9} width="20" height="7" rx="2" fill={i < 3 ? PAD : PLATE} />
    ))}
    <rect x={x + 11} y={y - 8} width="4" height="14" rx="2" fill={STEEL} />
  </>
);

const Seat = ({ x = 70, y = 86, w = 46 }: { x?: number; y?: number; w?: number }) => (
  <>
    <rect x={x} y={y} width={w} height="10" rx="5" fill={PAD} />
    <rect x={x + w / 2 - 3} y={y + 10} width="6" height="22" rx="3" fill={FRAME} />
    <rect x={x + w / 2 - 16} y={y + 30} width="32" height="6" rx="3" fill={FRAME_DARK} />
  </>
);

const Dumbbell = ({ x, y, s = 1, vertical = false }: { x: number; y: number; s?: number; vertical?: boolean }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) ${vertical ? 'rotate(90)' : ''}`}>
    <rect x="-16" y="-3" width="32" height="6" rx="3" fill={GRIP} />
    <rect x="-26" y="-11" width="10" height="22" rx="3" fill={PLATE} />
    <rect x="16" y="-11" width="10" height="22" rx="3" fill={PLATE} />
    <rect x="-30" y="-8" width="6" height="16" rx="3" fill={FRAME} />
    <rect x="24" y="-8" width="6" height="16" rx="3" fill={FRAME} />
  </g>
);

const Cable = ({ d }: { d: string }) => <path d={d} fill="none" stroke={GRIP} strokeWidth="1.6" strokeLinecap="round" />;

const Pulley = ({ cx, cy }: { cx: number; cy: number }) => (
  <>
    <circle cx={cx} cy={cy} r="6" fill={STEEL} />
    <circle cx={cx} cy={cy} r="2.4" fill={FRAME_DARK} />
  </>
);

const Handle = ({ x, y }: { x: number; y: number }) => (
  <rect x={x} y={y} width="6" height="18" rx="3" fill={GRIP} />
);

/* ------------------------------------------------------------------ */

export type EquipmentVisual =
  | 'flatBenchBarbell' | 'inclineBenchBarbell' | 'flatBenchDumbbell' | 'inclineBenchDumbbell'
  | 'chestPressMachine' | 'pecDeck' | 'cableCrossover' | 'cableLow' | 'cableRope'
  | 'latPulldown' | 'seatedRowCable' | 'chestSupportedRow' | 'legPress' | 'legExtension'
  | 'legCurlSeated' | 'legCurlLying' | 'squatRack' | 'smithMachine' | 'calfMachine'
  | 'calfStep' | 'shoulderPressMachine' | 'pullupBar' | 'assistedPullup' | 'dipStation'
  | 'dumbbellPair' | 'barbellFloor' | 'kettlebell' | 'band' | 'mat' | 'preacherBench'
  | 'hyperextension' | 'hipThrustBench' | 'abductionMachine' | 'captainsChair' | 'farmerCarry'
  | 'flatBench' | 'cableHighBar' | 'tricepsMachine' | 'seatedCalfMachine';

const ART: Record<EquipmentVisual, () => ReactElement> = {
  flatBenchBarbell: () => (
    <>
      <Floor />
      <rect x="34" y="28" width="7" height="90" rx="3" fill={FRAME} />
      <rect x="159" y="28" width="7" height="90" rx="3" fill={FRAME} />
      <rect x="28" y="36" width="19" height="6" rx="3" fill={FRAME_DARK} />
      <rect x="153" y="36" width="19" height="6" rx="3" fill={FRAME_DARK} />
      <Bar x={32} y={44} w={136} />
      <rect x="62" y="82" width="76" height="12" rx="6" fill={PAD} />
      <rect x="62" y="94" width="76" height="4" rx="2" fill={PAD_DARK} />
      <rect x="70" y="98" width="6" height="20" rx="3" fill={FRAME} />
      <rect x="124" y="98" width="6" height="20" rx="3" fill={FRAME} />
    </>
  ),
  inclineBenchBarbell: () => (
    <>
      <Floor />
      <rect x="38" y="32" width="7" height="86" rx="3" fill={FRAME} />
      <rect x="155" y="32" width="7" height="86" rx="3" fill={FRAME} />
      <Bar x={36} y={42} w={130} />
      <path d="M64 112 L118 66 l12 10 -54 46z" fill={PAD} />
      <rect x="60" y="104" width="30" height="10" rx="5" fill={PAD_DARK} />
      <rect x="68" y="112" width="6" height="8" rx="3" fill={FRAME} />
      <rect x="112" y="76" width="6" height="42" rx="3" fill={FRAME} />
    </>
  ),
  flatBenchDumbbell: () => (
    <>
      <Floor />
      <rect x="56" y="80" width="88" height="13" rx="6" fill={PAD} />
      <rect x="56" y="93" width="88" height="4" rx="2" fill={PAD_DARK} />
      <rect x="64" y="97" width="7" height="21" rx="3" fill={FRAME} />
      <rect x="130" y="97" width="7" height="21" rx="3" fill={FRAME} />
      <Dumbbell x={60} y={52} s={0.85} />
      <Dumbbell x={142} y={52} s={0.85} />
    </>
  ),
  inclineBenchDumbbell: () => (
    <>
      <Floor />
      <path d="M58 114 L116 62 l13 11 -58 52z" fill={PAD} />
      <rect x="54" y="106" width="32" height="10" rx="5" fill={PAD_DARK} />
      <rect x="110" y="72" width="7" height="46" rx="3" fill={FRAME} />
      <Dumbbell x={150} y={52} s={0.8} />
      <Dumbbell x={150} y={82} s={0.8} />
    </>
  ),
  chestPressMachine: () => (
    <>
      <Floor />
      <WeightStack x={26} y={40} />
      <rect x="60" y="30" width="8" height="88" rx="4" fill={FRAME} />
      <rect x="66" y="44" width="16" height="48" rx="6" fill={PAD} />
      <Seat x={78} y={88} w={48} />
      <rect x="126" y="52" width="8" height="40" rx="4" fill={FRAME} />
      <Handle x={132} y={54} />
      <Handle x={132} y={78} />
      <Cable d="M52 46 C 70 34 110 40 130 56" />
    </>
  ),
  pecDeck: () => (
    <>
      <Floor />
      <WeightStack x={22} y={44} />
      <rect x="62" y="26" width="8" height="92" rx="4" fill={FRAME} />
      <rect x="68" y="40" width="14" height="50" rx="6" fill={PAD} />
      <Seat x={76} y={88} w={44} />
      <rect x="96" y="30" width="6" height="30" rx="3" fill={FRAME} transform="rotate(-24 99 45)" />
      <rect x="126" y="34" width="6" height="34" rx="3" fill={FRAME} transform="rotate(18 129 51)" />
      <rect x="142" y="40" width="10" height="34" rx="5" fill={PAD} />
      <rect x="86" y="30" width="10" height="30" rx="5" fill={PAD} />
      <Cable d="M48 50 C 80 24 120 26 146 44" />
    </>
  ),
  cableCrossover: () => (
    <>
      <Floor />
      <rect x="26" y="20" width="9" height="98" rx="4" fill={FRAME} />
      <rect x="165" y="20" width="9" height="98" rx="4" fill={FRAME} />
      <rect x="26" y="20" width="148" height="8" rx="4" fill={FRAME_DARK} />
      <Pulley cx={31} cy={34} />
      <Pulley cx={169} cy={34} />
      <Cable d="M31 40 C 46 62 66 74 88 80" />
      <Cable d="M169 40 C 154 62 134 74 112 80" />
      <Handle x={85} y={78} />
      <Handle x={109} y={78} />
      <rect x="36" y="58" width="16" height="56" rx="3" fill={FRAME_DARK} />
      <rect x="148" y="58" width="16" height="56" rx="3" fill={FRAME_DARK} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x="39" y={62 + i * 12} width="10" height="8" rx="2" fill={i < 2 ? PAD : PLATE} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <rect key={`r${i}`} x="151" y={62 + i * 12} width="10" height="8" rx="2" fill={i < 2 ? PAD : PLATE} />
      ))}
    </>
  ),
  cableLow: () => (
    <>
      <Floor />
      <rect x="30" y="18" width="9" height="100" rx="4" fill={FRAME} />
      <WeightStack x={44} y={42} />
      <Pulley cx={35} cy={106} />
      <Cable d="M41 106 C 70 104 92 96 112 84" />
      <Handle x={110} y={80} />
      <rect x="120" y="96" width="46" height="8" rx="4" fill={STEEL} />
    </>
  ),
  cableRope: () => (
    <>
      <Floor />
      <rect x="32" y="16" width="9" height="102" rx="4" fill={FRAME} />
      <WeightStack x={46} y={44} />
      <Pulley cx={37} cy={28} />
      <Cable d="M37 34 L 37 56" />
      <path d="M31 56 l-6 30 M43 56 l6 30" stroke={GRIP} strokeWidth="3.4" strokeLinecap="round" fill="none" />
      <circle cx="25" cy="88" r="3.4" fill={GRIP} />
      <circle cx="49" cy="88" r="3.4" fill={GRIP} />
      <rect x="104" y="60" width="62" height="10" rx="5" fill={PAD} />
      <rect x="130" y="70" width="8" height="48" rx="4" fill={FRAME} />
    </>
  ),
  latPulldown: () => (
    <>
      <Floor />
      <rect x="150" y="18" width="9" height="100" rx="4" fill={FRAME} />
      <rect x="52" y="18" width="107" height="8" rx="4" fill={FRAME_DARK} />
      <Pulley cx={60} cy={32} />
      <Cable d="M60 38 L 60 48" />
      <rect x="26" y="48" width="70" height="5" rx="2.5" fill={STEEL} />
      <rect x="26" y="48" width="8" height="16" rx="4" fill={GRIP} transform="rotate(-24 30 56)" />
      <rect x="88" y="48" width="8" height="16" rx="4" fill={GRIP} transform="rotate(24 92 56)" />
      <WeightStack x={160} y={44} />
      <Seat x={72} y={86} w={48} />
      <rect x="70" y="72" width="52" height="10" rx="5" fill={PAD} />
    </>
  ),
  seatedRowCable: () => (
    <>
      <Floor />
      <rect x="22" y="56" width="9" height="62" rx="4" fill={FRAME} />
      <WeightStack x={34} y={48} />
      <Pulley cx={27} cy={86} />
      <Cable d="M33 86 L 108 86" />
      <path d="M108 80 l14 6 -14 6z" fill={GRIP} />
      <rect x="126" y="82" width="52" height="9" rx="4" fill={PAD} />
      <rect x="146" y="91" width="8" height="27" rx="4" fill={FRAME} />
      <rect x="60" y="100" width="20" height="18" rx="4" fill={FRAME_DARK} />
    </>
  ),
  chestSupportedRow: () => (
    <>
      <Floor />
      <path d="M72 112 L132 58 l14 12 -60 54z" fill={PAD} />
      <rect x="126" y="70" width="8" height="48" rx="4" fill={FRAME} />
      <rect x="66" y="104" width="34" height="10" rx="5" fill={FRAME_DARK} />
      <rect x="150" y="60" width="7" height="40" rx="3" fill={FRAME} />
      <Handle x={156} y={62} />
      <rect x="40" y="96" width="8" height="22" rx="4" fill={PLATE} />
      <rect x="52" y="96" width="8" height="22" rx="4" fill={PLATE} />
    </>
  ),
  legPress: () => (
    <>
      <Floor />
      <path d="M40 116 L124 40 l16 18 -84 76z" fill={FRAME} />
      <rect x="112" y="28" width="52" height="12" rx="4" fill={FRAME_DARK} transform="rotate(-42 138 34)" />
      <rect x="120" y="22" width="10" height="34" rx="4" fill={PLATE} transform="rotate(-42 125 39)" />
      <rect x="140" y="40" width="10" height="34" rx="4" fill={PLATE} transform="rotate(-42 145 57)" />
      <rect x="36" y="96" width="52" height="12" rx="6" fill={PAD} />
      <rect x="30" y="76" width="14" height="34" rx="6" fill={PAD_DARK} />
    </>
  ),
  legExtension: () => (
    <>
      <Floor />
      <rect x="58" y="44" width="9" height="74" rx="4" fill={FRAME} />
      <rect x="62" y="52" width="16" height="40" rx="6" fill={PAD} />
      <Seat x={74} y={88} w={44} />
      <rect x="118" y="90" width="42" height="7" rx="3" fill={FRAME} />
      <rect x="146" y="76" width="12" height="28" rx="6" fill={PAD} />
      <WeightStack x={24} y={48} />
    </>
  ),
  legCurlSeated: () => (
    <>
      <Floor />
      <rect x="58" y="44" width="9" height="74" rx="4" fill={FRAME} />
      <rect x="62" y="52" width="16" height="40" rx="6" fill={PAD} />
      <Seat x={74} y={88} w={44} />
      <rect x="118" y="86" width="40" height="7" rx="3" fill={FRAME} />
      <rect x="140" y="96" width="12" height="26" rx="6" fill={PAD} />
      <rect x="124" y="70" width="12" height="24" rx="6" fill={PAD_DARK} />
      <WeightStack x={24} y={48} />
    </>
  ),
  legCurlLying: () => (
    <>
      <Floor />
      <rect x="46" y="74" width="92" height="12" rx="6" fill={PAD} />
      <rect x="54" y="86" width="7" height="32" rx="3" fill={FRAME} />
      <rect x="122" y="86" width="7" height="32" rx="3" fill={FRAME} />
      <rect x="138" y="62" width="10" height="26" rx="5" fill={PAD_DARK} />
      <rect x="136" y="88" width="30" height="6" rx="3" fill={FRAME} />
      <WeightStack x={160} y={52} />
    </>
  ),
  squatRack: () => (
    <>
      <Floor />
      <rect x="40" y="16" width="10" height="102" rx="4" fill={FRAME} />
      <rect x="150" y="16" width="10" height="102" rx="4" fill={FRAME} />
      <rect x="32" y="102" width="26" height="8" rx="4" fill={FRAME_DARK} />
      <rect x="142" y="102" width="26" height="8" rx="4" fill={FRAME_DARK} />
      <rect x="34" y="42" width="20" height="7" rx="3" fill={PAD} />
      <rect x="146" y="42" width="20" height="7" rx="3" fill={PAD} />
      <Bar x={30} y={38} w={140} />
    </>
  ),
  smithMachine: () => (
    <>
      <Floor />
      <rect x="44" y="14" width="7" height="104" rx="3" fill={STEEL} />
      <rect x="149" y="14" width="7" height="104" rx="3" fill={STEEL} />
      <rect x="38" y="14" width="124" height="8" rx="4" fill={FRAME_DARK} />
      <Bar x={40} y={56} w={120} />
      <rect x="36" y="110" width="128" height="8" rx="4" fill={FRAME} />
    </>
  ),
  calfMachine: () => (
    <>
      <Floor />
      <rect x="62" y="24" width="9" height="94" rx="4" fill={FRAME} />
      <rect x="128" y="24" width="9" height="94" rx="4" fill={FRAME} />
      <rect x="56" y="40" width="88" height="10" rx="5" fill={PAD} />
      <rect x="72" y="104" width="56" height="14" rx="4" fill={FRAME_DARK} />
      <rect x="76" y="100" width="48" height="6" rx="3" fill={STEEL} />
      <WeightStack x={150} y={48} />
    </>
  ),
  calfStep: () => (
    <>
      <Floor />
      <rect x="62" y="100" width="76" height="18" rx="4" fill={FRAME_DARK} />
      <rect x="62" y="96" width="76" height="6" rx="3" fill={STEEL} />
      <Dumbbell x={150} y={78} s={0.75} vertical />
      <rect x="86" y="58" width="28" height="38" rx="8" fill={PAD} opacity="0.35" />
    </>
  ),
  shoulderPressMachine: () => (
    <>
      <Floor />
      <WeightStack x={24} y={40} />
      <rect x="60" y="22" width="9" height="96" rx="4" fill={FRAME} />
      <rect x="66" y="48" width="16" height="46" rx="6" fill={PAD} />
      <Seat x={78} y={90} w={46} />
      <rect x="84" y="24" width="7" height="30" rx="3" fill={FRAME} />
      <rect x="116" y="24" width="7" height="30" rx="3" fill={FRAME} />
      <Handle x={82} y={22} />
      <Handle x={118} y={22} />
      <Cable d="M50 44 C 66 24 78 22 88 26" />
    </>
  ),
  pullupBar: () => (
    <>
      <Floor />
      <rect x="44" y="18" width="10" height="100" rx="4" fill={FRAME} />
      <rect x="146" y="18" width="10" height="100" rx="4" fill={FRAME} />
      <rect x="40" y="18" width="120" height="9" rx="4" fill={FRAME_DARK} />
      <rect x="58" y="30" width="84" height="6" rx="3" fill={STEEL} />
      <rect x="66" y="28" width="10" height="10" rx="5" fill={GRIP} />
      <rect x="124" y="28" width="10" height="10" rx="5" fill={GRIP} />
    </>
  ),
  assistedPullup: () => (
    <>
      <Floor />
      <rect x="48" y="16" width="10" height="102" rx="4" fill={FRAME} />
      <rect x="142" y="16" width="10" height="102" rx="4" fill={FRAME} />
      <rect x="44" y="16" width="112" height="9" rx="4" fill={FRAME_DARK} />
      <rect x="66" y="28" width="68" height="6" rx="3" fill={STEEL} />
      <rect x="78" y="74" width="44" height="12" rx="6" fill={PAD} />
      <rect x="96" y="86" width="8" height="32" rx="4" fill={FRAME} />
      <WeightStack x={152} y={50} />
    </>
  ),
  dipStation: () => (
    <>
      <Floor />
      <rect x="52" y="52" width="9" height="66" rx="4" fill={FRAME} />
      <rect x="139" y="52" width="9" height="66" rx="4" fill={FRAME} />
      <rect x="44" y="46" width="42" height="7" rx="3.5" fill={STEEL} />
      <rect x="114" y="46" width="42" height="7" rx="3.5" fill={STEEL} />
      <rect x="44" y="44" width="12" height="11" rx="5" fill={GRIP} />
      <rect x="144" y="44" width="12" height="11" rx="5" fill={GRIP} />
      <rect x="46" y="110" width="108" height="8" rx="4" fill={FRAME_DARK} />
    </>
  ),
  dumbbellPair: () => (
    <>
      <Floor />
      <rect x="40" y="104" width="120" height="14" rx="4" fill={FRAME_DARK} />
      <Dumbbell x={74} y={88} s={0.85} />
      <Dumbbell x={128} y={88} s={0.85} />
      <Dumbbell x={100} y={52} s={1.1} />
    </>
  ),
  barbellFloor: () => (
    <>
      <Floor />
      <Bar x={26} y={88} w={148} />
      <rect x="18" y="72" width="10" height="40" rx="4" fill={PLATE} />
      <rect x="172" y="72" width="10" height="40" rx="4" fill={PLATE} />
    </>
  ),
  kettlebell: () => (
    <>
      <Floor />
      <path d="M100 42c-14 0-22 10-22 20h10c0-7 5-12 12-12s12 5 12 12h10c0-10-8-20-22-20z" fill={GRIP} />
      <path d="M78 62h44c10 8 16 22 16 34 0 12-12 20-38 20s-38-8-38-20c0-12 6-26 16-34z" fill={FRAME_DARK} />
      <ellipse cx="100" cy="94" rx="14" ry="10" fill={PAD} />
    </>
  ),
  band: () => (
    <>
      <Floor />
      <path d="M40 92 C 72 44 128 44 160 92" fill="none" stroke={PAD} strokeWidth="7" strokeLinecap="round" />
      <path d="M40 92 C 72 56 128 56 160 92" fill="none" stroke={PAD_DARK} strokeWidth="4" strokeLinecap="round" opacity="0.6" />
      <rect x="28" y="84" width="14" height="18" rx="6" fill={GRIP} />
      <rect x="158" y="84" width="14" height="18" rx="6" fill={GRIP} />
    </>
  ),
  mat: () => (
    <>
      <Floor />
      <rect x="34" y="82" width="132" height="26" rx="10" fill={PAD} />
      <rect x="34" y="82" width="132" height="8" rx="4" fill={PAD_DARK} opacity="0.55" />
      <path d="M50 96h100" stroke="#FFD3B3" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  preacherBench: () => (
    <>
      <Floor />
      <path d="M74 62 L130 62 l8 24 -72 0z" fill={PAD} />
      <rect x="92" y="86" width="9" height="32" rx="4" fill={FRAME} />
      <Seat x={46} y={86} w={40} />
      <rect x="86" y="46" width="60" height="4" rx="2" fill={STEEL} />
      <rect x="82" y="38" width="8" height="20" rx="3" fill={PLATE} />
      <rect x="142" y="38" width="8" height="20" rx="3" fill={PLATE} />
    </>
  ),
  hyperextension: () => (
    <>
      <Floor />
      <path d="M58 112 L118 56 l14 12 -60 56z" fill={FRAME} />
      <rect x="104" y="46" width="30" height="12" rx="6" fill={PAD} />
      <rect x="54" y="88" width="14" height="26" rx="6" fill={PAD} />
      <rect x="66" y="96" width="14" height="22" rx="6" fill={PAD_DARK} />
      <rect x="112" y="68" width="8" height="50" rx="4" fill={FRAME_DARK} />
    </>
  ),
  hipThrustBench: () => (
    <>
      <Floor />
      <rect x="34" y="72" width="80" height="12" rx="6" fill={PAD} />
      <rect x="44" y="84" width="7" height="34" rx="3" fill={FRAME} />
      <rect x="98" y="84" width="7" height="34" rx="3" fill={FRAME} />
      <Bar x={76} y={60} w={104} />
      <rect x="120" y="96" width="46" height="8" rx="4" fill={FRAME_DARK} />
    </>
  ),
  abductionMachine: () => (
    <>
      <Floor />
      <WeightStack x={26} y={44} />
      <rect x="66" y="34" width="9" height="84" rx="4" fill={FRAME} />
      <rect x="72" y="46" width="14" height="42" rx="6" fill={PAD} />
      <Seat x={84} y={88} w={44} />
      <rect x="82" y="96" width="12" height="26" rx="6" fill={PAD_DARK} />
      <rect x="122" y="96" width="12" height="26" rx="6" fill={PAD_DARK} />
      <Cable d="M52 50 C 72 38 96 44 104 60" />
    </>
  ),
  captainsChair: () => (
    <>
      <Floor />
      <rect x="66" y="20" width="9" height="98" rx="4" fill={FRAME} />
      <rect x="128" y="20" width="9" height="98" rx="4" fill={FRAME} />
      <rect x="62" y="20" width="79" height="8" rx="4" fill={FRAME_DARK} />
      <rect x="72" y="46" width="14" height="34" rx="7" fill={PAD} />
      <rect x="118" y="46" width="14" height="34" rx="7" fill={PAD} />
      <rect x="82" y="36" width="40" height="12" rx="6" fill={PAD_DARK} />
      <rect x="60" y="110" width="84" height="8" rx="4" fill={FRAME_DARK} />
    </>
  ),
  flatBench: () => (
    <>
      <Floor />
      <rect x="48" y="78" width="104" height="13" rx="6" fill={PAD} />
      <rect x="48" y="91" width="104" height="4" rx="2" fill={PAD_DARK} />
      <rect x="58" y="95" width="7" height="23" rx="3" fill={FRAME} />
      <rect x="135" y="95" width="7" height="23" rx="3" fill={FRAME} />
      <rect x="52" y="112" width="24" height="6" rx="3" fill={FRAME_DARK} />
      <rect x="124" y="112" width="24" height="6" rx="3" fill={FRAME_DARK} />
    </>
  ),
  cableHighBar: () => (
    <>
      <Floor />
      <rect x="32" y="16" width="9" height="102" rx="4" fill={FRAME} />
      <WeightStack x={46} y={44} />
      <Pulley cx={37} cy={28} />
      <Cable d="M37 34 L 37 54" />
      <rect x="14" y="54" width="46" height="5" rx="2.5" fill={STEEL} />
      <rect x="14" y="52" width="9" height="9" rx="4" fill={GRIP} />
      <rect x="51" y="52" width="9" height="9" rx="4" fill={GRIP} />
      <rect x="104" y="62" width="62" height="10" rx="5" fill={PAD} opacity="0.35" />
    </>
  ),
  tricepsMachine: () => (
    <>
      <Floor />
      <WeightStack x={150} y={42} />
      <rect x="128" y="26" width="9" height="92" rx="4" fill={FRAME} />
      <rect x="114" y="42" width="15" height="46" rx="6" fill={PAD} />
      <Seat x={70} y={88} w={46} />
      <rect x="86" y="46" width="7" height="26" rx="3" fill={FRAME} />
      <Handle x={82} y={44} />
      <Handle x={100} y={44} />
      <Cable d="M146 48 C 122 34 100 38 90 50" />
    </>
  ),
  seatedCalfMachine: () => (
    <>
      <Floor />
      <Seat x={54} y={82} w={48} />
      <rect x="96" y="60" width="52" height="12" rx="6" fill={PAD} />
      <rect x="138" y="70" width="9" height="30" rx="4" fill={FRAME} />
      <rect x="120" y="100" width="46" height="14" rx="4" fill={FRAME_DARK} />
      <rect x="124" y="96" width="38" height="6" rx="3" fill={STEEL} />
      <rect x="150" y="36" width="10" height="26" rx="4" fill={PLATE} />
    </>
  ),
  farmerCarry: () => (
    <>
      <Floor />
      <Dumbbell x={58} y={82} s={0.9} vertical />
      <Dumbbell x={142} y={82} s={0.9} vertical />
      <path d="M100 34 v54" stroke={PAD} strokeWidth="6" strokeLinecap="round" opacity="0.35" />
      <circle cx="100" cy="28" r="10" fill={PAD} opacity="0.35" />
    </>
  )
};

export function EquipmentArt({
  visual, className = '', title
}: {
  visual: EquipmentVisual;
  className?: string;
  title?: string;
}) {
  const Art = ART[visual] ?? ART.dumbbellPair;
  return (
    <svg viewBox="0 0 200 140" className={`h-full w-full ${className}`} role="img" aria-label={title}>
      <rect x="0" y="0" width="200" height="140" fill="none" />
      <Art />
    </svg>
  );
}

export const EQUIPMENT_VISUALS = Object.keys(ART) as EquipmentVisual[];

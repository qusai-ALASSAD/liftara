import type { Program } from '@/types';

const P = (p: Program): Program => p;

export const PROGRAMS: Program[] = [
  P({
    id: 'return-to-gym-30',
    name: { de: 'Zurück ins Gym – 30 Tage', en: 'Return to Gym – 30 Days', ar: 'العودة إلى الجيم – 30 يوماً' },
    description: {
      de: 'Sanfter Wiedereinstieg nach längerer Pause: wenig Volumen, viele Maschinen, klare Technik, steigende Belastung Woche für Woche.',
      en: 'A gentle restart after a long break: low volume, mostly machines, clean technique and a small weekly increase.',
      ar: 'عودة تدريجية بعد انقطاع طويل: حجم قليل، أجهزة موجّهة، تقنية نظيفة وزيادة أسبوعية بسيطة.'
    },
    level: ['returning', 'beginner'], daysPerWeek: 3, weeks: 4, place: 'gym',
    equipment: ['machine', 'cable', 'dumbbell'], premium: false, goal: 'returning',
    days: [
      { dayIndex: 0, workoutTitle: { de: 'Ganzkörper A', en: 'Full Body A', ar: 'الجسم كامل أ' }, focus: ['chest', 'back', 'quads'], exerciseIds: ['leg-press', 'chest-press-machine', 'lat-pulldown', 'shoulder-press-machine', 'plank'] },
      { dayIndex: 1, workoutTitle: { de: 'Ganzkörper B', en: 'Full Body B', ar: 'الجسم كامل ب' }, focus: ['back', 'hamstrings', 'shoulders'], exerciseIds: ['leg-curl-seated', 'row-machine-chest-supported', 'incline-press-dumbbell', 'lateral-raise-dumbbell', 'dead-bug'] },
      { dayIndex: 2, workoutTitle: { de: 'Ganzkörper C', en: 'Full Body C', ar: 'الجسم كامل ج' }, focus: ['glutes', 'chest', 'biceps'], exerciseIds: ['goblet-squat', 'seated-row-cable', 'pec-deck', 'biceps-curl-dumbbell', 'standing-calf-raise'] }
    ]
  }),
  P({
    id: 'beginner-muscle-3',
    name: { de: 'Muskelaufbau für Einsteiger – 3 Tage', en: 'Beginner Muscle Gain – 3 Days', ar: 'بناء العضلات للمبتدئين – 3 أيام' },
    description: {
      de: 'Der Klassiker für den Aufbau: drei Ganzkörpereinheiten pro Woche mit Grundübungen und wenigen Isolationsübungen.',
      en: 'The classic build plan: three full body sessions per week built on compound lifts plus a few isolation moves.',
      ar: 'الخطة الكلاسيكية للبناء: ثلاث حصص للجسم كامل أسبوعياً بتمارين مركّبة وقليل من العزل.'
    },
    level: ['beginner', 'returning'], daysPerWeek: 3, weeks: 8, place: 'gym',
    equipment: ['machine', 'cable', 'dumbbell', 'barbell'], premium: false, goal: 'muscle',
    days: [
      { dayIndex: 0, workoutTitle: { de: 'Tag A – Druck', en: 'Day A – Push focus', ar: 'اليوم أ – الدفع' }, focus: ['chest', 'quads', 'triceps'], exerciseIds: ['goblet-squat', 'bench-press-dumbbell', 'lat-pulldown', 'shoulder-press-machine', 'triceps-pushdown', 'plank'] },
      { dayIndex: 1, workoutTitle: { de: 'Tag B – Zug', en: 'Day B – Pull focus', ar: 'اليوم ب – السحب' }, focus: ['back', 'hamstrings', 'biceps'], exerciseIds: ['romanian-deadlift', 'seated-row-cable', 'incline-press-dumbbell', 'face-pull', 'biceps-curl-dumbbell', 'leg-raise'] },
      { dayIndex: 2, workoutTitle: { de: 'Tag C – Beine & Schultern', en: 'Day C – Legs & Shoulders', ar: 'اليوم ج – أرجل وأكتاف' }, focus: ['quads', 'glutes', 'shoulders'], exerciseIds: ['leg-press', 'hip-thrust', 'chest-press-machine', 'lateral-raise-dumbbell', 'leg-curl-seated', 'standing-calf-raise'] }
    ]
  }),
  P({
    id: 'full-body-2',
    name: { de: 'Ganzkörper Basis – 2 Tage', en: 'Full Body Beginner – 2 Days', ar: 'الجسم كامل للمبتدئ – يومان' },
    description: {
      de: 'Minimaler Zeitaufwand, maximaler Effekt: zwei Einheiten pro Woche für den Einstieg oder stressige Phasen.',
      en: 'Minimum time, solid effect: two sessions per week for beginners or busy phases.',
      ar: 'وقت قليل ونتيجة جيدة: حصتان أسبوعياً للمبتدئ أو للفترات المزدحمة.'
    },
    level: ['beginner', 'returning'], daysPerWeek: 2, weeks: 8, place: 'gym',
    equipment: ['machine', 'cable', 'dumbbell'], premium: false, goal: 'health',
    days: [
      { dayIndex: 0, workoutTitle: { de: 'Ganzkörper 1', en: 'Full Body 1', ar: 'الجسم كامل 1' }, focus: ['quads', 'chest', 'back'], exerciseIds: ['leg-press', 'chest-press-machine', 'seated-row-cable', 'lateral-raise-dumbbell', 'plank'] },
      { dayIndex: 1, workoutTitle: { de: 'Ganzkörper 2', en: 'Full Body 2', ar: 'الجسم كامل 2' }, focus: ['hamstrings', 'back', 'shoulders'], exerciseIds: ['romanian-deadlift', 'lat-pulldown', 'incline-press-dumbbell', 'leg-curl-seated', 'triceps-pushdown'] }
    ]
  }),
  P({
    id: 'upper-lower-4',
    name: { de: 'Oberkörper / Unterkörper – 4 Tage', en: 'Upper / Lower – 4 Days', ar: 'علوي / سفلي – 4 أيام' },
    description: {
      de: 'Vier Einheiten, klar getrennt nach Ober- und Unterkörper. Ideal, wenn drei Tage nicht mehr genug Reiz bringen.',
      en: 'Four sessions split cleanly into upper and lower body. Ideal once three days stop being enough.',
      ar: 'أربع حصص مقسّمة بين الجزء العلوي والسفلي. مناسب عندما لا تكفي ثلاثة أيام.'
    },
    level: ['intermediate', 'beginner'], daysPerWeek: 4, weeks: 8, place: 'gym',
    equipment: ['machine', 'cable', 'dumbbell', 'barbell'], premium: false, goal: 'muscle',
    days: [
      { dayIndex: 0, workoutTitle: { de: 'Oberkörper 1', en: 'Upper 1', ar: 'علوي 1' }, focus: ['chest', 'back', 'triceps'], exerciseIds: ['bench-press-barbell', 'seated-row-cable', 'shoulder-press-dumbbell', 'lat-pulldown', 'triceps-pushdown', 'biceps-curl-dumbbell'] },
      { dayIndex: 1, workoutTitle: { de: 'Unterkörper 1', en: 'Lower 1', ar: 'سفلي 1' }, focus: ['quads', 'glutes', 'calves'], exerciseIds: ['back-squat', 'romanian-deadlift', 'leg-extension', 'hip-thrust', 'standing-calf-raise', 'plank'] },
      { dayIndex: 2, workoutTitle: { de: 'Oberkörper 2', en: 'Upper 2', ar: 'علوي 2' }, focus: ['back', 'shoulders', 'biceps'], exerciseIds: ['pull-up-assisted', 'incline-press-dumbbell', 'dumbbell-row', 'lateral-raise-cable', 'hammer-curl', 'rope-pushdown'] },
      { dayIndex: 3, workoutTitle: { de: 'Unterkörper 2', en: 'Lower 2', ar: 'سفلي 2' }, focus: ['hamstrings', 'glutes', 'quads'], exerciseIds: ['leg-press', 'leg-curl-lying', 'split-squat', 'hip-abduction-machine', 'seated-calf-raise', 'cable-crunch'] }
    ]
  }),
  P({
    id: 'ppl-6',
    name: { de: 'Push / Pull / Legs – 5–6 Tage', en: 'Push / Pull / Legs – 5 or 6 Days', ar: 'دفع / سحب / أرجل – 5 أو 6 أيام' },
    description: {
      de: 'Hohes Volumen für Fortgeschrittene: Druck, Zug und Beine getrennt, ein bis zwei Durchgänge pro Woche.',
      en: 'High volume for advanced lifters: push, pull and legs separated, one or two rounds per week.',
      ar: 'حجم تدريبي عالٍ للمتقدمين: دفع وسحب وأرجل بشكل منفصل، دورة أو دورتان أسبوعياً.'
    },
    level: ['advanced', 'intermediate'], daysPerWeek: 6, weeks: 8, place: 'gym',
    equipment: ['machine', 'cable', 'dumbbell', 'barbell'], premium: true, goal: 'muscle',
    days: [
      { dayIndex: 0, workoutTitle: { de: 'Push', en: 'Push', ar: 'دفع' }, focus: ['chest', 'shoulders', 'triceps'], exerciseIds: ['bench-press-barbell', 'shoulder-press-dumbbell', 'incline-press-dumbbell', 'lateral-raise-cable', 'rope-pushdown', 'overhead-triceps-dumbbell'] },
      { dayIndex: 1, workoutTitle: { de: 'Pull', en: 'Pull', ar: 'سحب' }, focus: ['back', 'biceps'], exerciseIds: ['pull-up-assisted', 'barbell-row', 'seated-row-cable', 'face-pull', 'biceps-curl-barbell', 'hammer-curl'] },
      { dayIndex: 2, workoutTitle: { de: 'Legs', en: 'Legs', ar: 'أرجل' }, focus: ['quads', 'hamstrings', 'glutes'], exerciseIds: ['back-squat', 'romanian-deadlift', 'leg-press', 'leg-curl-seated', 'standing-calf-raise', 'hanging-knee-raise'] },
      { dayIndex: 3, workoutTitle: { de: 'Push 2', en: 'Push 2', ar: 'دفع 2' }, focus: ['chest', 'shoulders', 'triceps'], exerciseIds: ['incline-press-barbell', 'chest-press-machine', 'shoulder-press-machine', 'lateral-raise-dumbbell', 'triceps-pushdown', 'diamond-push-up'] },
      { dayIndex: 4, workoutTitle: { de: 'Pull 2', en: 'Pull 2', ar: 'سحب 2' }, focus: ['back', 'biceps'], exerciseIds: ['lat-pulldown', 'dumbbell-row', 'straight-arm-pulldown', 'rear-delt-fly-machine', 'cable-curl', 'reverse-curl'] },
      { dayIndex: 5, workoutTitle: { de: 'Legs 2', en: 'Legs 2', ar: 'أرجل 2' }, focus: ['glutes', 'quads', 'calves'], exerciseIds: ['hip-thrust', 'split-squat', 'leg-extension', 'leg-curl-lying', 'seated-calf-raise', 'pallof-press'] }
    ]
  }),
  P({
    id: 'home-beginner',
    name: { de: 'Zuhause ohne Geräte', en: 'Home Beginner – No Equipment', ar: 'في المنزل بدون معدات' },
    description: {
      de: 'Kein Studio, keine Geräte: Ganzkörpertraining mit Körpergewicht, jederzeit und überall machbar.',
      en: 'No gym, no equipment: full body bodyweight training you can do anywhere.',
      ar: 'بدون نادٍ أو معدات: تدريب كامل الجسم بوزن الجسم في أي مكان.'
    },
    level: ['beginner', 'returning'], daysPerWeek: 3, weeks: 6, place: 'home',
    equipment: ['bodyweight', 'band'], premium: false, goal: 'health',
    days: [
      { dayIndex: 0, workoutTitle: { de: 'Heim A', en: 'Home A', ar: 'منزل أ' }, focus: ['chest', 'quads', 'core'], exerciseIds: ['bodyweight-squat', 'push-up-incline', 'band-row', 'glute-bridge', 'plank'] },
      { dayIndex: 1, workoutTitle: { de: 'Heim B', en: 'Home B', ar: 'منزل ب' }, focus: ['glutes', 'back', 'shoulders'], exerciseIds: ['walking-lunge', 'inverted-row', 'push-up', 'band-hip-abduction', 'dead-bug'] },
      { dayIndex: 2, workoutTitle: { de: 'Heim C', en: 'Home C', ar: 'منزل ج' }, focus: ['fullBody', 'core', 'calves'], exerciseIds: ['bear-crawl', 'band-curl', 'lateral-raise-band', 'calf-raise-bodyweight', 'side-plank'] }
    ]
  }),
  P({
    id: 'strength-foundations',
    name: { de: 'Kraft-Fundament', en: 'Strength Foundations', ar: 'أساسيات القوة' },
    description: {
      de: 'Fokus auf wenige Grundübungen mit sauberer Technik und langsamer, sicherer Laststeigerung.',
      en: 'Focus on a few main lifts with clean technique and slow, safe load progression.',
      ar: 'التركيز على تمارين أساسية قليلة بتقنية نظيفة وزيادة أحمال بطيئة وآمنة.'
    },
    level: ['intermediate', 'beginner'], daysPerWeek: 3, weeks: 10, place: 'gym',
    equipment: ['barbell', 'machine', 'dumbbell'], premium: false, goal: 'strength',
    days: [
      { dayIndex: 0, workoutTitle: { de: 'Kraft A', en: 'Strength A', ar: 'قوة أ' }, focus: ['quads', 'chest'], exerciseIds: ['back-squat', 'bench-press-barbell', 'barbell-row', 'plank'] },
      { dayIndex: 1, workoutTitle: { de: 'Kraft B', en: 'Strength B', ar: 'قوة ب' }, focus: ['hamstrings', 'shoulders'], exerciseIds: ['romanian-deadlift', 'overhead-press-barbell', 'lat-pulldown', 'farmer-walk'] },
      { dayIndex: 2, workoutTitle: { de: 'Kraft C', en: 'Strength C', ar: 'قوة ج' }, focus: ['glutes', 'back'], exerciseIds: ['hip-thrust', 'incline-press-barbell', 'seated-row-cable', 'standing-calf-raise'] }
    ]
  }),
  P({
    id: 'goal-weight-journey',
    name: { de: 'Weg zum Zielgewicht', en: 'Goal Weight Journey', ar: 'الطريق إلى الوزن الهدف' },
    description: {
      de: 'Kombination aus Krafttraining und moderatem Volumen, um Gewicht und Körperzusammensetzung langfristig zu verändern.',
      en: 'Strength work plus moderate volume to move weight and body composition over time.',
      ar: 'تدريب قوة مع حجم معتدل لتغيير الوزن وتكوين الجسم على المدى الطويل.'
    },
    level: ['beginner', 'intermediate', 'returning'], daysPerWeek: 4, weeks: 12, place: 'mixed',
    equipment: ['machine', 'dumbbell', 'cable', 'bodyweight'], premium: false, goal: 'fatLoss',
    days: [
      { dayIndex: 0, workoutTitle: { de: 'Ganzkörper Kraft', en: 'Full Body Strength', ar: 'قوة الجسم كامل' }, focus: ['quads', 'chest', 'back'], exerciseIds: ['goblet-squat', 'bench-press-dumbbell', 'seated-row-cable', 'plank'] },
      { dayIndex: 1, workoutTitle: { de: 'Oberkörper', en: 'Upper Body', ar: 'الجزء العلوي' }, focus: ['back', 'shoulders', 'biceps'], exerciseIds: ['lat-pulldown', 'incline-press-dumbbell', 'lateral-raise-dumbbell', 'triceps-pushdown', 'biceps-curl-dumbbell'] },
      { dayIndex: 2, workoutTitle: { de: 'Unterkörper', en: 'Lower Body', ar: 'الجزء السفلي' }, focus: ['glutes', 'hamstrings'], exerciseIds: ['hip-thrust', 'leg-curl-seated', 'leg-press', 'standing-calf-raise'] },
      { dayIndex: 3, workoutTitle: { de: 'Ganzkörper Zirkel', en: 'Full Body Circuit', ar: 'دائرة الجسم كامل' }, focus: ['fullBody', 'core'], exerciseIds: ['kettlebell-swing', 'farmer-walk', 'push-up', 'walking-lunge', 'side-plank'] }
    ]
  })
];

export const getProgram = (id: string) => PROGRAMS.find((p) => p.id === id);

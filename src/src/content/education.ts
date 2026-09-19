import type { LocalizedText } from '@/types';

export interface EducationTopic {
  id: string;
  icon: 'weight' | 'reps' | 'timer' | 'gauge' | 'trend' | 'flame' | 'users' | 'refresh' | 'alert';
  title: LocalizedText;
  summary: LocalizedText;
  body: { de: string[]; en: string[]; ar: string[] };
}

export const EDUCATION: EducationTopic[] = [
  {
    id: 'starting-weight', icon: 'weight',
    title: { de: 'Startgewicht wählen', en: 'Choosing a starting weight', ar: 'اختيار الوزن المبدئي' },
    summary: { de: 'Lieber zu leicht als zu schwer starten.', en: 'Better to start too light than too heavy.', ar: 'ابدأ بوزن خفيف بدل الثقيل.' },
    body: {
      de: [
        'Wähle ein Gewicht, mit dem du die geplanten Wiederholungen sauber schaffst und am Ende noch zwei bis drei im Tank hast.',
        'Führe bei Grundübungen ein bis zwei leichte Aufwärmsätze aus, bevor du das Arbeitsgewicht nimmst.',
        'Wenn die Technik im Satz zusammenbricht, war das Gewicht zu hoch. Reduziere um zehn Prozent und wiederhole sauber.'
      ],
      en: [
        'Pick a weight that lets you complete the planned reps cleanly with two or three reps left in the tank.',
        'On compound lifts do one or two light warm-up sets before the working weight.',
        'If technique breaks down inside a set the weight was too heavy. Drop ten percent and repeat cleanly.'
      ],
      ar: [
        'اختر وزناً يسمح لك بإتمام التكرارات المخططة بشكل نظيف مع بقاء تكرارين أو ثلاثة في الاحتياط.',
        'في التمارين المركّبة نفّذ مجموعة أو مجموعتين إحماء خفيفتين قبل وزن العمل.',
        'إذا انهارت التقنية داخل المجموعة فالوزن كان ثقيلاً. قلّل عشرة بالمئة وأعد الأداء بنظافة.'
      ]
    }
  },
  {
    id: 'sets-reps', icon: 'reps',
    title: { de: 'Sätze und Wiederholungen', en: 'Sets and repetitions', ar: 'المجموعات والتكرارات' },
    summary: { de: '6 bis 15 Wiederholungen bauen Muskeln auf.', en: '6 to 15 reps build muscle.', ar: 'من 6 إلى 15 تكراراً تبني العضلات.' },
    body: {
      de: [
        'Für Muskelaufbau funktionieren 6 bis 15 Wiederholungen sehr gut, solange die Sätze nah an die Erschöpfung gehen.',
        'Zwei bis vier Arbeitssätze pro Übung reichen für Einsteiger vollkommen aus.',
        'Wichtiger als die exakte Zahl ist, dass du jede Woche wiederkommst und Leistung dokumentierst.'
      ],
      en: [
        'For muscle growth 6 to 15 reps works very well as long as the sets come close to failure.',
        'Two to four working sets per exercise are plenty for beginners.',
        'Showing up every week and logging performance matters more than the exact number.'
      ],
      ar: [
        'لبناء العضلات تعمل التكرارات من 6 إلى 15 بشكل ممتاز طالما اقتربت المجموعة من الإجهاد.',
        'مجموعتان إلى أربع مجموعات عمل لكل تمرين تكفي المبتدئ تماماً.',
        'الالتزام الأسبوعي وتسجيل الأداء أهم من الرقم الدقيق.'
      ]
    }
  },
  {
    id: 'rest', icon: 'timer',
    title: { de: 'Pausenzeiten', en: 'Rest periods', ar: 'فترات الراحة' },
    summary: { de: 'Grundübungen 2–3 Minuten, Isolation 60–90 Sekunden.', en: 'Compounds 2–3 minutes, isolation 60–90 seconds.', ar: 'المركّبة 2–3 دقائق والعزل 60–90 ثانية.' },
    body: {
      de: [
        'Nach schweren Grundübungen brauchst du zwei bis drei Minuten, damit der nächste Satz wirklich zählt.',
        'Bei Isolationsübungen genügen meist 60 bis 90 Sekunden.',
        'Zu kurze Pausen kosten Leistung, zu lange Pausen kosten nur Zeit.'
      ],
      en: [
        'After heavy compound lifts take two to three minutes so the next set actually counts.',
        'For isolation work 60 to 90 seconds is usually enough.',
        'Too little rest costs performance, too much rest only costs time.'
      ],
      ar: [
        'بعد التمارين المركّبة الثقيلة خذ دقيقتين إلى ثلاث حتى تكون المجموعة التالية فعّالة.',
        'في تمارين العزل تكفي 60 إلى 90 ثانية عادة.',
        'الراحة القصيرة جداً تُضعف الأداء، والطويلة جداً تضيّع الوقت فقط.'
      ]
    }
  },
  {
    id: 'rir', icon: 'gauge',
    title: { de: 'RIR verstehen', en: 'Understanding RIR', ar: 'فهم RIR' },
    summary: { de: 'Wie viele Wiederholungen bleiben übrig?', en: 'How many reps are left in reserve?', ar: 'كم تكراراً بقي في الاحتياط؟' },
    body: {
      de: [
        'RIR bedeutet Reps in Reserve: die Anzahl an Wiederholungen, die du am Satzende noch sauber geschafft hättest.',
        'Für Einsteiger sind 2 bis 3 RIR ideal: hart genug für Wachstum, sicher genug für die Technik.',
        'RIR 0 heißt Muskelversagen. Das ist für Anfänger selten nötig und bei freien Gewichten riskant.'
      ],
      en: [
        'RIR means reps in reserve: how many clean reps you could still have done at the end of the set.',
        'For beginners 2 to 3 RIR is ideal: hard enough to grow, safe enough for technique.',
        'RIR 0 means training to failure. Beginners rarely need it and it is risky with free weights.'
      ],
      ar: [
        'RIR تعني التكرارات المتبقية: كم تكراراً نظيفاً كان بإمكانك أداؤه في نهاية المجموعة.',
        'للمبتدئ من 2 إلى 3 RIR مثالية: صعبة كفاية للنمو وآمنة كفاية للتقنية.',
        'RIR صفر تعني الوصول للفشل العضلي، ونادراً ما يحتاجها المبتدئ وهي خطرة مع الأوزان الحرة.'
      ]
    }
  },
  {
    id: 'progressive-overload', icon: 'trend',
    title: { de: 'Progressive Überlastung', en: 'Progressive overload', ar: 'الحمل التصاعدي' },
    summary: { de: 'Kleine Steigerungen schlagen große Sprünge.', en: 'Small increases beat big jumps.', ar: 'الزيادات الصغيرة أفضل من القفزات الكبيرة.' },
    body: {
      de: [
        'Muskeln wachsen, wenn die Anforderung langsam steigt: mehr Wiederholungen, mehr Gewicht oder bessere Technik.',
        'LIFTARA nutzt doppelte Progression: erst das obere Ende des Wiederholungsbereichs erreichen, dann das Gewicht leicht erhöhen.',
        'Zwei bis fünf Prozent mehr Last pro Steigerung reichen völlig aus.'
      ],
      en: [
        'Muscles grow when the demand rises slowly: more reps, more weight or cleaner technique.',
        'LIFTARA uses double progression: first reach the top of the rep range, then add a small amount of weight.',
        'Two to five percent more load per step is plenty.'
      ],
      ar: [
        'العضلات تنمو عندما يزداد التحدي ببطء: تكرارات أكثر أو وزن أعلى أو تقنية أنظف.',
        'يستخدم LIFTARA التدرّج المزدوج: اصل أولاً إلى أعلى نطاق التكرار ثم زد الوزن قليلاً.',
        'زيادة من 2 إلى 5 بالمئة في كل خطوة كافية تماماً.'
      ]
    }
  },
  {
    id: 'warmup', icon: 'flame',
    title: { de: 'Aufwärmen', en: 'Warm-up', ar: 'الإحماء' },
    summary: { de: 'Fünf Minuten allgemein, dann spezifische Sätze.', en: 'Five general minutes, then specific sets.', ar: 'خمس دقائق عامة ثم مجموعات خاصة.' },
    body: {
      de: [
        'Starte mit fünf Minuten lockerer Bewegung, bis Puls und Gelenke warm sind.',
        'Mache danach für die erste schwere Übung ein bis zwei Sätze mit etwa 50 und 75 Prozent des Arbeitsgewichts.',
        'Statisches Dehnen vor dem Training ist nicht nötig, beweglicher werden kannst du danach.'
      ],
      en: [
        'Start with five minutes of easy movement until the pulse and joints are warm.',
        'Then do one or two sets at roughly 50 and 75 percent of the working weight for the first heavy lift.',
        'Static stretching before training is not required, mobility work fits better afterwards.'
      ],
      ar: [
        'ابدأ بخمس دقائق حركة خفيفة حتى يسخن النبض والمفاصل.',
        'ثم نفّذ مجموعة أو مجموعتين بحوالي 50 و75 بالمئة من وزن العمل لأول تمرين ثقيل.',
        'الإطالة الساكنة قبل التمرين ليست ضرورية، والأفضل تركها لما بعد التمرين.'
      ]
    }
  },
  {
    id: 'etiquette', icon: 'users',
    title: { de: 'Verhalten im Studio', en: 'Gym etiquette', ar: 'آداب النادي' },
    summary: { de: 'Aufräumen, teilen, respektvoll bleiben.', en: 'Clean up, share, stay respectful.', ar: 'رتّب، شارك، واحترم الآخرين.' },
    body: {
      de: [
        'Gewichte zurückräumen und Geräte nach Benutzung abwischen.',
        'Wenn jemand wartet, biete an, sich abzuwechseln. Das kostet nichts und macht das Training angenehmer.',
        'Handy nicht auf der Bank liegen lassen und beim Filmen Rücksicht auf andere nehmen.'
      ],
      en: [
        'Rack your weights and wipe equipment after use.',
        'If someone is waiting, offer to alternate sets. It costs nothing and makes training easier for everyone.',
        'Do not park your phone on a bench and be considerate when filming.'
      ],
      ar: [
        'أعد الأوزان إلى مكانها ونظّف الأجهزة بعد الاستخدام.',
        'إذا كان أحدهم ينتظر اعرض تبادل المجموعات، فهذا لا يكلّف شيئاً ويريح الجميع.',
        'لا تترك هاتفك على المقعد وكن مراعياً عند التصوير.'
      ]
    }
  },
  {
    id: 'returning', icon: 'refresh',
    title: { de: 'Wiedereinstieg nach langer Pause', en: 'Returning after a long break', ar: 'العودة بعد انقطاع طويل' },
    summary: { de: 'Die ersten zwei Wochen bewusst leicht halten.', en: 'Keep the first two weeks deliberately easy.', ar: 'اجعل الأسبوعين الأولين سهلين عمداً.' },
    body: {
      de: [
        'Dein Nervensystem erinnert sich schneller als Sehnen und Gelenke. Deshalb fühlt sich viel Gewicht am Anfang möglich an, ist aber riskant.',
        'Starte mit etwa 50 bis 60 Prozent der früheren Last, zwei bis drei Sätzen und klaren Maschinenübungen.',
        'Rechne in den ersten Wochen mit deutlichem Muskelkater. Das ist normal und wird schnell weniger.'
      ],
      en: [
        'Your nervous system remembers faster than tendons and joints. Heavy weight feels possible early on but is risky.',
        'Start at roughly 50 to 60 percent of your old load with two or three sets and guided machine work.',
        'Expect noticeable soreness in the first weeks. That is normal and fades quickly.'
      ],
      ar: [
        'جهازك العصبي يتذكّر أسرع من الأوتار والمفاصل، لذلك تبدو الأوزان الثقيلة ممكنة لكنها خطرة في البداية.',
        'ابدأ بحوالي 50 إلى 60 بالمئة من حمولتك السابقة مع مجموعتين أو ثلاث وتمارين أجهزة موجّهة.',
        'توقّع ألماً عضلياً واضحاً في الأسابيع الأولى، وهذا طبيعي ويخفّ بسرعة.'
      ]
    }
  },
  {
    id: 'soreness-vs-pain', icon: 'alert',
    title: { de: 'Muskelkater oder Warnsignal?', en: 'Soreness or warning pain?', ar: 'ألم عضلي أم إشارة تحذير؟' },
    summary: { de: 'Dumpf und beidseitig ist normal, stechend nicht.', en: 'Dull and symmetric is normal, sharp is not.', ar: 'الألم الخفيف المتناظر طبيعي، والحاد لا.' },
    body: {
      de: [
        'Normaler Muskelkater fühlt sich dumpf an, betrifft beide Seiten ähnlich, beginnt nach 12 bis 48 Stunden und wird durch leichte Bewegung besser.',
        'Warnsignale sind stechender Schmerz, Schmerz in einem Gelenk, Kribbeln, Taubheit, Schwellung oder Schmerz, der nachts schlimmer wird.',
        'LIFTARA stellt keine Diagnose. Bei starken, ungewöhnlichen oder anhaltenden Beschwerden lass das bitte ärztlich abklären.'
      ],
      en: [
        'Normal soreness feels dull, affects both sides similarly, starts after 12 to 48 hours and improves with light movement.',
        'Warning signs are sharp pain, joint pain, tingling, numbness, swelling or pain that gets worse at night.',
        'LIFTARA does not diagnose anything. With severe, unusual or persistent symptoms please see a medical professional.'
      ],
      ar: [
        'الألم العضلي الطبيعي خفيف ومنتشر، يصيب الجهتين بشكل متشابه، ويبدأ بعد 12 إلى 48 ساعة ويتحسّن بالحركة الخفيفة.',
        'إشارات التحذير: ألم حاد، ألم داخل المفصل، وخز، تنميل، تورّم، أو ألم يزداد ليلاً.',
        'LIFTARA لا يقدّم تشخيصاً. عند الأعراض الشديدة أو غير المعتادة أو المستمرة راجع مختصاً طبياً.'
      ]
    }
  }
];

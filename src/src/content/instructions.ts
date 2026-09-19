import type { Exercise, ExerciseInstructions, Locale, MovementPattern } from '@/types';

/**
 * Anleitungen werden aus Bewegungsmuster-Vorlagen (dreisprachig) plus einem
 * übungsspezifischen Cue zusammengesetzt. So bleiben 80+ Übungen in 3 Sprachen
 * pflegbar, ohne den gleichen Text hunderte Male zu duplizieren.
 * Format je Sprache: [setup, execution, breathing, mistakes, safety] – '|' trennt Punkte.
 */
type Block = [string, string, string, string, string];
type PatternText = Record<Locale, Block>;

export const PATTERN_TEXT: Record<MovementPattern, PatternText> = {
  horizontalPress: {
    de: [
      'Schulterblätter zusammenziehen und fixieren|Füße fest am Boden, leichte Spannung im Rumpf',
      'Gewicht kontrolliert bis knapp über die Brust senken|Ellbogen etwa 45 Grad zum Körper halten|Gleichmäßig nach oben drücken, Ellbogen nicht überstrecken',
      'Beim Senken einatmen, beim Drücken ausatmen.',
      'Gewicht von der Brust abprallen lassen|Schultern nach vorne rollen lassen',
      'Mit freier Langhantel nur mit Ablage oder Hilfestellung arbeiten.'
    ],
    en: [
      'Retract and set the shoulder blades|Feet firmly planted, light core tension',
      'Lower the weight under control to just above the chest|Keep the elbows about 45 degrees from the torso|Press up smoothly without locking out hard',
      'Inhale while lowering, exhale while pressing.',
      'Bouncing the weight off the chest|Letting the shoulders roll forward',
      'With a free barbell only train inside a rack or with a spotter.'
    ],
    ar: [
      'اسحب لوحي الكتف للخلف وثبّتهما|القدمان ثابتتان على الأرض مع شدّ خفيف في الجذع',
      'أنزل الوزن بتحكّم حتى قرب الصدر|حافظ على المرفقين بزاوية 45 درجة تقريباً عن الجسم|ادفع للأعلى بثبات دون قفل المرفقين بعنف',
      'استنشق أثناء النزول وازفر أثناء الدفع.',
      'ارتداد الوزن عن الصدر|السماح للكتفين بالدوران للأمام',
      'مع البار الحر تمرّن داخل القفص أو مع مساعد فقط.'
    ]
  },
  inclinePress: {
    de: [
      'Bank auf etwa 30 bis 45 Grad einstellen|Kopf, Schultern und Gesäß bleiben in Kontakt',
      'Gewicht zur oberen Brust senken|Handgelenke bleiben gerade über den Ellbogen|Nach oben und leicht zusammen drücken',
      'Beim Senken einatmen, beim Drücken ausatmen.',
      'Bank zu steil einstellen, dadurch arbeitet nur die Schulter|Rücken stark vom Polster lösen',
      'Beginne leichter als beim Flachbankdrücken.'
    ],
    en: [
      'Set the bench to roughly 30 to 45 degrees|Head, shoulders and hips stay in contact',
      'Lower the weight toward the upper chest|Wrists stay stacked over the elbows|Press up and slightly together',
      'Inhale while lowering, exhale while pressing.',
      'Setting the bench too steep so only the shoulders work|Arching hard off the pad',
      'Start lighter than on the flat press.'
    ],
    ar: [
      'اضبط المقعد على 30 إلى 45 درجة تقريباً|الرأس والكتفان والحوض تبقى ملامسة للمقعد',
      'أنزل الوزن باتجاه أعلى الصدر|المعصمان فوق المرفقين مباشرة|ادفع للأعلى مع تقريب بسيط',
      'استنشق أثناء النزول وازفر أثناء الدفع.',
      'ضبط المقعد بزاوية عالية جداً فيعمل الكتف فقط|رفع الظهر بقوة عن المقعد',
      'ابدأ بوزن أخف من الضغط المستوي.'
    ]
  },
  verticalPress: {
    de: [
      'Aufrecht stehen oder sitzen, Rumpf fest|Hantel auf Höhe von Kinn oder Schulter',
      'Nach oben drücken, Kopf leicht nach hinten ausweichen|Oben kurz stabilisieren|Kontrolliert zurück auf Schulterhöhe',
      'Vor dem Drücken einatmen, oben ausatmen.',
      'Ins Hohlkreuz gehen|Mit Schwung aus den Beinen drücken',
      'Bei Schulterschmerzen stattdessen eine geführte Maschine wählen.'
    ],
    en: [
      'Stand or sit tall with a braced core|Weight at chin or shoulder height',
      'Press overhead, moving the head slightly back out of the way|Stabilise briefly at the top|Lower under control to shoulder height',
      'Inhale before pressing, exhale at the top.',
      'Over-arching the lower back|Using leg drive to cheat the weight up',
      'If the shoulder hurts, use a guided machine instead.'
    ],
    ar: [
      'قف أو اجلس بظهر مستقيم وجذع مشدود|الوزن على مستوى الذقن أو الكتف',
      'ادفع للأعلى مع إرجاع الرأس قليلاً|ثبّت لحظة في الأعلى|أنزل بتحكّم إلى مستوى الكتف',
      'استنشق قبل الدفع وازفر في الأعلى.',
      'تقويس أسفل الظهر|استخدام دفع الرجلين للغش',
      'عند ألم الكتف استخدم جهازاً موجّهاً بدلاً من ذلك.'
    ]
  },
  horizontalPull: {
    de: [
      'Brust aufrichten, Schultern tief|Rücken neutral, Blick nach vorn oder unten',
      'Ellbogen eng am Körper nach hinten ziehen|Schulterblätter am Ende zusammenführen|Langsam zurück in die Dehnung',
      'Beim Ziehen ausatmen, beim Zurückführen einatmen.',
      'Mit dem Oberkörper schwingen|Nur mit den Armen ziehen statt mit dem Rücken',
      'Bei Rückenproblemen eine Variante mit Brustpolster wählen.'
    ],
    en: [
      'Chest tall, shoulders down|Neutral spine, eyes forward or slightly down',
      'Pull the elbows back close to the body|Squeeze the shoulder blades at the end|Return slowly into the stretch',
      'Exhale while pulling, inhale while returning.',
      'Swinging the torso for momentum|Pulling with the arms only instead of the back',
      'With back issues choose a chest-supported variation.'
    ],
    ar: [
      'ارفع الصدر وأنزل الكتفين|ظهر محايد والنظر للأمام أو للأسفل قليلاً',
      'اسحب المرفقين للخلف قريباً من الجسم|اضغط لوحي الكتف في نهاية الحركة|عُد ببطء إلى وضع التمدد',
      'ازفر أثناء السحب واستنشق أثناء العودة.',
      'تأرجح الجذع للحصول على زخم|السحب بالذراعين فقط بدل الظهر',
      'عند مشاكل الظهر اختر نسخة بإسناد للصدر.'
    ]
  },
  verticalPull: {
    de: [
      'Griff etwas weiter als schulterbreit|Brust leicht nach oben, Rumpf fest',
      'Ellbogen nach unten zur Hüfte ziehen|Stange oder Körper bis Kinnhöhe bewegen|Kontrolliert in die volle Streckung zurück',
      'Beim Ziehen ausatmen, beim Ablassen einatmen.',
      'Mit den Beinen schwingen|Schultern zu den Ohren hochziehen',
      'Anfänger nutzen Latzug oder Unterstützung statt Klimmzügen.'
    ],
    en: [
      'Grip slightly wider than shoulder width|Chest up, core braced',
      'Drive the elbows down toward the hips|Move the bar or body to chin height|Return under control to full stretch',
      'Exhale while pulling, inhale while lowering.',
      'Kipping with the legs|Shrugging the shoulders toward the ears',
      'Beginners use the lat pulldown or assistance instead of pull-ups.'
    ],
    ar: [
      'قبضة أوسع قليلاً من عرض الكتفين|الصدر مرفوع والجذع مشدود',
      'ادفع المرفقين للأسفل باتجاه الحوض|حرّك البار أو الجسم حتى مستوى الذقن|عُد بتحكّم إلى التمدد الكامل',
      'ازفر أثناء السحب واستنشق أثناء النزول.',
      'التأرجح بالرجلين|رفع الكتفين باتجاه الأذنين',
      'المبتدئ يستخدم جهاز السحب أو المساعدة بدل العقلة.'
    ]
  },
  squat: {
    de: [
      'Füße schulterbreit, Zehen leicht nach außen|Rumpf anspannen, Brust aufrecht',
      'Hüfte und Knie gleichzeitig beugen|So tief wie kontrolliert möglich, Knie folgen den Zehen|Über die ganze Fußfläche nach oben drücken',
      'Oben einatmen, Spannung halten, beim Hochkommen ausatmen.',
      'Knie fallen nach innen|Fersen heben sich vom Boden',
      'Tiefe nur so weit wählen, wie der Rücken neutral bleibt.'
    ],
    en: [
      'Feet shoulder width, toes slightly out|Brace the core, chest tall',
      'Bend hips and knees together|Go as deep as you can control, knees track the toes|Drive up through the whole foot',
      'Inhale at the top, hold the brace, exhale on the way up.',
      'Knees collapsing inward|Heels lifting off the floor',
      'Only go as deep as your back stays neutral.'
    ],
    ar: [
      'القدمان بعرض الكتفين وأصابع القدم للخارج قليلاً|شدّ الجذع وارفع الصدر',
      'اثنِ الوركين والركبتين معاً|انزل بالعمق الذي تتحكم به، والركبتان باتجاه الأصابع|ادفع للأعلى من كامل القدم',
      'استنشق في الأعلى، احبس الشدّ، وازفر أثناء الصعود.',
      'سقوط الركبتين للداخل|ارتفاع الكعبين عن الأرض',
      'انزل فقط بالعمق الذي يبقي ظهرك محايداً.'
    ]
  },
  hinge: {
    de: [
      'Füße hüftbreit, Knie leicht gebeugt|Rücken neutral, Schultern tief',
      'Hüfte nach hinten schieben, Gewicht nah am Körper|Bis zur spürbaren Dehnung der Beinrückseite senken|Hüfte kraftvoll nach vorne strecken',
      'Beim Absenken einatmen, beim Aufrichten ausatmen.',
      'Runder Rücken|Bewegung aus dem Knie statt aus der Hüfte',
      'Bei Rückenschmerzen leichter beginnen und den Bewegungsweg verkürzen.'
    ],
    en: [
      'Feet hip width, knees softly bent|Neutral spine, shoulders down',
      'Push the hips back, weight close to the body|Lower until you feel the hamstrings stretch|Drive the hips forward powerfully',
      'Inhale while lowering, exhale while standing up.',
      'Rounding the back|Turning it into a squat instead of a hip hinge',
      'With back pain start lighter and shorten the range.'
    ],
    ar: [
      'القدمان بعرض الحوض والركبتان مثنيتان قليلاً|ظهر محايد وكتفان منخفضان',
      'ادفع الوركين للخلف والوزن قريب من الجسم|انزل حتى تشعر بتمدد خلف الفخذ|ادفع الوركين للأمام بقوة',
      'استنشق أثناء النزول وازفر أثناء الوقوف.',
      'تقويس الظهر للأمام|تحويل الحركة إلى قرفصاء بدل ثني الورك',
      'عند ألم الظهر ابدأ أخف واقصر مدى الحركة.'
    ]
  },
  lunge: {
    de: [
      'Aufrechter Oberkörper, Blick nach vorn|Schrittlänge etwa eine Beinlänge',
      'Hinteres Knie kontrolliert Richtung Boden senken|Vorderes Knie bleibt über dem Fuß|Über die vordere Ferse nach oben drücken',
      'Beim Absenken einatmen, beim Hochdrücken ausatmen.',
      'Zu kurzer Schritt, dadurch Belastung im Knie|Oberkörper kippt nach vorn',
      'Anfangs ohne Zusatzgewicht und in der Nähe einer Stütze üben.'
    ],
    en: [
      'Upright torso, eyes forward|Step about one leg length',
      'Lower the back knee toward the floor under control|Front knee stays over the foot|Push up through the front heel',
      'Inhale while lowering, exhale while pushing up.',
      'Too short a step, loading the knee|Letting the torso tip forward',
      'Start without extra weight and near something to hold.'
    ],
    ar: [
      'الجذع مستقيم والنظر للأمام|طول الخطوة بطول الساق تقريباً',
      'أنزل الركبة الخلفية نحو الأرض بتحكّم|الركبة الأمامية تبقى فوق القدم|ادفع للأعلى من كعب القدم الأمامية',
      'استنشق أثناء النزول وازفر أثناء الدفع.',
      'خطوة قصيرة جداً تحمّل الركبة|ميلان الجذع للأمام',
      'ابدأ دون أوزان إضافية وقرب نقطة استناد.'
    ]
  },
  curl: {
    de: [
      'Ellbogen nah am Körper fixieren|Schultern tief, Rumpf fest',
      'Gewicht ohne Schwung nach oben beugen|Oben kurz die Spannung halten|Langsam in die volle Streckung senken',
      'Beim Beugen ausatmen, beim Senken einatmen.',
      'Oberkörper nach hinten schwingen|Ellbogen nach vorne wandern lassen',
      'Bei Ellbogenschmerzen SZ-Stange oder neutralen Griff nutzen.'
    ],
    en: [
      'Pin the elbows close to the body|Shoulders down, core braced',
      'Curl the weight up without swinging|Hold the squeeze briefly at the top|Lower slowly into full extension',
      'Exhale while curling, inhale while lowering.',
      'Swinging the torso backward|Letting the elbows drift forward',
      'With elbow pain use an EZ bar or a neutral grip.'
    ],
    ar: [
      'ثبّت المرفقين قرب الجسم|الكتفان منخفضان والجذع مشدود',
      'ارفع الوزن دون تأرجح|اضغط لحظة في الأعلى|أنزل ببطء حتى البسط الكامل',
      'ازفر أثناء الرفع واستنشق أثناء النزول.',
      'تأرجح الجذع للخلف|تقدّم المرفقين للأمام',
      'عند ألم المرفق استخدم بار Z أو قبضة محايدة.'
    ]
  },
  triceps: {
    de: [
      'Oberarme parallel und ruhig halten|Handgelenke gerade',
      'Ellbogen vollständig strecken|Oben kurz halten, ohne zu überstrecken|Kontrolliert zurückführen',
      'Beim Strecken ausatmen, beim Zurückführen einatmen.',
      'Oberarme wandern mit|Zu schweres Gewicht mit halbem Bewegungsweg',
      'Bei Ellbogenreizung Bewegungsweg verkleinern und Gewicht reduzieren.'
    ],
    en: [
      'Keep the upper arms parallel and still|Wrists straight',
      'Extend the elbows fully|Brief hold at the top without hyperextending|Return under control',
      'Exhale while extending, inhale while returning.',
      'Letting the upper arms travel|Too much weight with half range',
      'If the elbow gets irritated, shorten the range and reduce load.'
    ],
    ar: [
      'أبقِ العضدين متوازيين وثابتين|المعصمان مستقيمان',
      'ابسط المرفقين بالكامل|ثبّت لحظة في الأعلى دون مبالغة|عُد بتحكّم',
      'ازفر أثناء البسط واستنشق أثناء العودة.',
      'تحرّك العضدين مع الحركة|وزن ثقيل جداً مع نصف مدى',
      'عند تهيّج المرفق قلّل المدى والوزن.'
    ]
  },
  lateralRaise: {
    de: [
      'Leicht nach vorn geneigt stehen|Ellbogen minimal gebeugt',
      'Arme seitlich bis etwa Schulterhöhe heben|Ellbogen führen die Bewegung|Langsam absenken, Spannung halten',
      'Beim Heben ausatmen, beim Senken einatmen.',
      'Zu schweres Gewicht mit Schwung|Schultern zu den Ohren ziehen',
      'Diese Übung lebt von leichtem Gewicht und sauberer Ausführung.'
    ],
    en: [
      'Stand with a slight forward lean|Elbows softly bent',
      'Raise the arms to about shoulder height|Lead with the elbows|Lower slowly keeping tension',
      'Exhale while raising, inhale while lowering.',
      'Too heavy with swinging|Shrugging toward the ears',
      'This exercise works with light weight and clean form.'
    ],
    ar: [
      'قف مع ميل بسيط للأمام|المرفقان مثنيان قليلاً',
      'ارفع الذراعين جانباً حتى مستوى الكتف تقريباً|المرفق يقود الحركة|أنزل ببطء مع الحفاظ على الشدّ',
      'ازفر أثناء الرفع واستنشق أثناء النزول.',
      'وزن ثقيل مع تأرجح|رفع الكتفين نحو الأذنين',
      'هذا التمرين ينجح بالوزن الخفيف والأداء النظيف.'
    ]
  },
  rearDelt: {
    de: [
      'Oberkörper nach vorne neigen oder anlehnen|Rücken neutral',
      'Arme seitlich nach hinten öffnen|Schulterblätter leicht zusammenführen|Kontrolliert zurück',
      'Beim Öffnen ausatmen, beim Zurückführen einatmen.',
      'Zu viel Gewicht, Bewegung kommt aus dem Rücken|Ellbogen komplett durchstrecken',
      'Leichtes Gewicht und hohe Wiederholungen funktionieren hier am besten.'
    ],
    en: [
      'Hinge forward or rest the chest on a pad|Neutral spine',
      'Open the arms out and back|Lightly squeeze the shoulder blades|Return under control',
      'Exhale while opening, inhale while returning.',
      'Too heavy so the movement comes from the back|Locking the elbows out',
      'Light weight and higher reps work best here.'
    ],
    ar: [
      'مِل بالجذع للأمام أو استند بالصدر|ظهر محايد',
      'افتح الذراعين للجانبين والخلف|اضغط لوحي الكتف بلطف|عُد بتحكّم',
      'ازفر أثناء الفتح واستنشق أثناء العودة.',
      'وزن كبير فتأتي الحركة من الظهر|قفل المرفقين',
      'الوزن الخفيف والتكرارات الأعلى أفضل هنا.'
    ]
  },
  calf: {
    de: [
      'Fußballen stabil auf der Fläche|Rumpf aufrecht',
      'Fersen so hoch wie möglich drücken|Oben eine Sekunde halten|Kontrolliert in die Dehnung senken',
      'Beim Drücken ausatmen, beim Senken einatmen.',
      'Zu schnelles Wippen ohne Spannung|Sehr kurzer Bewegungsweg',
      'Bei Wadenkrämpfen Gewicht reduzieren und danach dehnen.'
    ],
    en: [
      'Balls of the feet stable on the platform|Torso upright',
      'Press the heels as high as possible|Hold one second at the top|Lower under control into the stretch',
      'Exhale while pressing, inhale while lowering.',
      'Fast bouncing without tension|Very short range of motion',
      'With calf cramps reduce the load and stretch afterwards.'
    ],
    ar: [
      'مقدمة القدمين ثابتة على المنصة|الجذع مستقيم',
      'ادفع الكعبين لأعلى ما يمكن|ثبّت ثانية في الأعلى|أنزل بتحكّم حتى التمدد',
      'ازفر أثناء الدفع واستنشق أثناء النزول.',
      'الاهتزاز السريع دون شدّ|مدى حركة قصير جداً',
      'عند تشنّج السمانة قلّل الوزن ومدّد بعد التمرين.'
    ]
  },
  coreBrace: {
    de: [
      'Körper bildet eine gerade Linie|Bauch und Gesäß aktiv anspannen',
      'Position ruhig halten und gleichmäßig atmen|Becken nicht absinken lassen|Am Ende kontrolliert lösen',
      'Ruhig weiteratmen, niemals die Luft anhalten.',
      'Hüfte sinkt ab oder schiebt nach oben|Kopf fällt nach unten',
      'Lieber kurze saubere Sätze als lange Zeit mit schlechter Haltung.'
    ],
    en: [
      'Body forms one straight line|Actively brace abs and glutes',
      'Hold the position calmly and keep breathing|Do not let the hips drop|Release under control at the end',
      'Keep breathing steadily, never hold your breath.',
      'Hips sagging or piking up|Letting the head drop',
      'Short clean sets beat long sets with poor position.'
    ],
    ar: [
      'الجسم على خط مستقيم|شدّ البطن والأرداف بفعالية',
      'ثبّت الوضعية بهدوء واستمر بالتنفس|لا تدع الحوض ينزل|أنهِ الحركة بتحكّم',
      'تنفّس بانتظام ولا تحبس نفسك أبداً.',
      'نزول الحوض أو رفعه كثيراً|إسقاط الرأس للأسفل',
      'مجموعات قصيرة نظيفة أفضل من وقت طويل بوضعية سيئة.'
    ]
  },
  coreFlexion: {
    de: [
      'Unterer Rücken bleibt in Kontakt mit der Unterlage|Nacken lang, Kinn leicht gesenkt',
      'Oberkörper oder Beine langsam heranführen|Bewegung kommt aus dem Bauch|Kontrolliert zurück, ohne abzulegen',
      'Beim Zusammenziehen ausatmen, beim Zurückgehen einatmen.',
      'Am Nacken ziehen|Mit Schwung arbeiten',
      'Bei Rückenschmerzen Bewegungsweg verkürzen oder Plank wählen.'
    ],
    en: [
      'Lower back stays in contact with the surface|Long neck, chin slightly tucked',
      'Bring the torso or legs in slowly|The movement comes from the abs|Return under control without resting',
      'Exhale while crunching, inhale while returning.',
      'Pulling on the neck|Using momentum',
      'With back pain shorten the range or choose a plank.'
    ],
    ar: [
      'أسفل الظهر يبقى ملامساً للسطح|الرقبة ممدودة والذقن للأسفل قليلاً',
      'قرّب الجذع أو الرجلين ببطء|الحركة تأتي من البطن|عُد بتحكّم دون راحة',
      'ازفر أثناء الانقباض واستنشق أثناء العودة.',
      'الشدّ على الرقبة|استخدام الزخم',
      'عند ألم الظهر قلّل المدى أو اختر تمرين البلانك.'
    ]
  },
  hipAbduction: {
    de: [
      'Becken stabil, Rumpf angespannt|Knie leicht gebeugt',
      'Beine oder Knie gegen den Widerstand nach außen führen|Kurz halten|Langsam zurückführen',
      'Beim Öffnen ausatmen, beim Schließen einatmen.',
      'Mit dem Oberkörper ausweichen|Zurückbewegung fallen lassen',
      'Bei Hüftreizung Bewegungsweg verkleinern.'
    ],
    en: [
      'Pelvis stable, core braced|Knees softly bent',
      'Drive the legs or knees out against the resistance|Hold briefly|Return slowly',
      'Exhale while opening, inhale while closing.',
      'Compensating with the torso|Dropping the return phase',
      'With hip irritation reduce the range of motion.'
    ],
    ar: [
      'الحوض ثابت والجذع مشدود|الركبتان مثنيتان قليلاً',
      'افتح الرجلين أو الركبتين ضد المقاومة|ثبّت لحظة|عُد ببطء',
      'ازفر أثناء الفتح واستنشق أثناء الإغلاق.',
      'التعويض بحركة الجذع|إرخاء مرحلة العودة',
      'عند تهيّج الورك قلّل مدى الحركة.'
    ]
  },
  forearm: {
    de: [
      'Unterarme abgelegt oder fixiert|Nur das Handgelenk bewegt sich',
      'Gewicht langsam nach oben führen|Kurz halten|Vollständig ablassen',
      'Beim Anheben ausatmen, beim Ablassen einatmen.',
      'Zu schweres Gewicht|Ellbogen bewegt mit',
      'Bei Handgelenksschmerzen sofort abbrechen und leichter starten.'
    ],
    en: [
      'Forearms supported or fixed|Only the wrist moves',
      'Raise the weight slowly|Brief hold|Lower all the way down',
      'Exhale while raising, inhale while lowering.',
      'Too much weight|The elbow moving along',
      'Stop immediately with wrist pain and restart much lighter.'
    ],
    ar: [
      'الساعدان مستندان أو ثابتان|المعصم وحده يتحرك',
      'ارفع الوزن ببطء|ثبّت لحظة|أنزل بالكامل',
      'ازفر أثناء الرفع واستنشق أثناء النزول.',
      'وزن ثقيل جداً|تحرّك المرفق مع الحركة',
      'توقف فوراً عند ألم المعصم وابدأ بوزن أخف بكثير.'
    ]
  },
  carryFullBody: {
    de: [
      'Aufrechte Haltung, Schultern tief|Rumpf fest, Blick geradeaus',
      'Gleichmäßig und kontrolliert bewegen|Atmung nicht anhalten|Sauber abstellen statt fallen lassen',
      'Ruhig und gleichmäßig durch die ganze Bewegung atmen.',
      'Haltung bricht bei Ermüdung ein|Zu lange Sätze ohne Technikkontrolle',
      'Satz beenden, sobald die Technik nachlässt.'
    ],
    en: [
      'Tall posture, shoulders down|Braced core, eyes forward',
      'Move evenly and under control|Do not hold your breath|Set the weight down instead of dropping it',
      'Breathe calmly and evenly throughout.',
      'Posture breaking down under fatigue|Sets too long to keep technique',
      'End the set as soon as technique degrades.'
    ],
    ar: [
      'وقفة مستقيمة والكتفان منخفضان|الجذع مشدود والنظر للأمام',
      'تحرّك بانتظام وتحكّم|لا تحبس نفسك|أنزل الوزن بهدوء بدل إسقاطه',
      'تنفّس بهدوء وانتظام طوال الحركة.',
      'انهيار الوضعية عند التعب|مجموعات طويلة بلا تحكّم بالتقنية',
      'أنهِ المجموعة فور تراجع التقنية.'
    ]
  }
};

const split = (s: string) => s.split('|').map((x) => x.trim()).filter(Boolean);

export function buildInstructions(ex: Exercise, locale: Locale): ExerciseInstructions {
  const b = PATTERN_TEXT[ex.pattern][locale];
  return {
    setup: split(b[0]),
    execution: [...split(b[1]), ex.cue[locale]],
    breathing: b[2],
    mistakes: split(b[3]),
    safety: split(b[4])
  };
}

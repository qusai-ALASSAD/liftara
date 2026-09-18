import type {
  ContraindicationTag, Difficulty, Equipment, Exercise, MovementPattern, MuscleGroup
} from '@/types';

/**
 * Kompakte Zeilen-Definition: Namen + Cue dreisprachig, Rest strukturiert.
 * Alternativen werden deterministisch berechnet (gleicher Primärmuskel, anderes Gerät).
 */
type Row = [
  id: string, de: string, en: string, ar: string,
  pattern: MovementPattern, primary: MuscleGroup[], secondary: MuscleGroup[],
  equipment: Equipment[], difficulty: Difficulty, loadStep: number,
  contra: ContraindicationTag[], cueDe: string, cueEn: string, cueAr: string,
  unilateral?: boolean
];

const COMPOUND: MovementPattern[] = [
  'horizontalPress', 'inclinePress', 'verticalPress', 'horizontalPull', 'verticalPull',
  'squat', 'hinge', 'lunge', 'carryFullBody'
];

const ROWS: Row[] = [
  // ---------------- CHEST ----------------
  ['bench-press-barbell','Bankdrücken Langhantel','Barbell Bench Press','ضغط البار على المقعد المستوي','horizontalPress',['chest'],['triceps','shoulders'],['barbell','bench'],'intermediate',2.5,['shoulderPain'],'Stange zur Mitte der Brust führen.','Bring the bar to mid-chest.','وجّه البار إلى منتصف الصدر.'],
  ['bench-press-dumbbell','Kurzhantel Bankdrücken','Dumbbell Bench Press','ضغط الدمبل على المقعد','horizontalPress',['chest'],['triceps','shoulders'],['dumbbell','bench'],'beginner',2,['shoulderPain'],'Hanteln oben nicht aneinanderschlagen.','Do not clash the dumbbells at the top.','لا تصطدم الدمبلز في الأعلى.'],
  ['chest-press-machine','Brustpresse Maschine','Chest Press Machine','جهاز ضغط الصدر','horizontalPress',['chest'],['triceps','shoulders'],['machine'],'beginner',2.5,[],'Griffe auf Brusthöhe einstellen.','Set the handles at chest height.','اضبط المقابض على مستوى الصدر.'],
  ['incline-press-dumbbell','Schrägbankdrücken Kurzhantel','Incline Dumbbell Press','ضغط الدمبل على المقعد المائل','inclinePress',['chest'],['shoulders','triceps'],['dumbbell','bench'],'beginner',2,['shoulderPain'],'Hanteln zur oberen Brust führen.','Drive the dumbbells to the upper chest.','وجّه الدمبلز نحو أعلى الصدر.'],
  ['incline-press-barbell','Schrägbankdrücken Langhantel','Incline Barbell Press','ضغط البار المائل','inclinePress',['chest'],['shoulders','triceps'],['barbell','bench'],'intermediate',2.5,['shoulderPain'],'Stange knapp unter das Schlüsselbein senken.','Lower the bar just below the collarbone.','أنزل البار تحت عظم الترقوة بقليل.'],
  ['cable-fly','Kabelzug Fliegende','Cable Chest Fly','تفتيح الصدر بالكيبل','horizontalPress',['chest'],['shoulders'],['cable'],'beginner',2.5,['shoulderPain'],'Leichte Ellbogenbeugung konstant halten.','Keep a constant slight elbow bend.','حافظ على ثني بسيط ثابت في المرفق.'],
  ['pec-deck','Butterfly Maschine','Pec Deck Machine','جهاز التفتيح (بيك ديك)','horizontalPress',['chest'],['shoulders'],['machine'],'beginner',2.5,['shoulderPain'],'Nur bis zur angenehmen Dehnung öffnen.','Only open to a comfortable stretch.','افتح فقط حتى تمدد مريح.'],
  ['push-up','Liegestütz','Push-Up','تمرين الضغط','horizontalPress',['chest'],['triceps','core','shoulders'],['bodyweight'],'beginner',0,['wristPain'],'Körper bleibt eine gerade Linie.','Keep the body in one straight line.','أبقِ الجسم على خط مستقيم.'],
  ['push-up-incline','Liegestütz erhöht','Incline Push-Up','ضغط مائل على مسند','horizontalPress',['chest'],['triceps','core'],['bodyweight','bench'],'beginner',0,['wristPain'],'Je höher die Auflage, desto leichter.','The higher the surface, the easier it is.','كلما ارتفع السطح صار التمرين أسهل.'],

  // ---------------- BACK ----------------
  ['lat-pulldown','Latzug','Lat Pulldown','سحب أمامي (لات)','verticalPull',['back'],['biceps','shoulders'],['machine','cable'],'beginner',2.5,[],'Stange zur oberen Brust ziehen.','Pull the bar to the upper chest.','اسحب البار نحو أعلى الصدر.'],
  ['lat-pulldown-neutral','Latzug enger Neutralgriff','Neutral Grip Pulldown','سحب بقبضة محايدة','verticalPull',['back'],['biceps'],['machine','cable'],'beginner',2.5,['shoulderPain'],'Schulterfreundliche Variante bei Beschwerden.','Shoulder friendly option when sore.','خيار مريح للكتف عند الانزعاج.'],
  ['pull-up-assisted','Klimmzug unterstützt','Assisted Pull-Up','عقلة بمساعدة','verticalPull',['back'],['biceps','core'],['machine','bodyweight'],'beginner',2.5,[],'Unterstützung so wählen, dass 8 saubere Wiederholungen möglich sind.','Pick assistance that allows 8 clean reps.','اختر مساعدة تسمح بـ8 تكرارات نظيفة.'],
  ['pull-up','Klimmzug','Pull-Up','العقلة','verticalPull',['back'],['biceps','core'],['bodyweight'],'advanced',0,['shoulderPain'],'Aus der vollen Streckung starten.','Start from a full hang.','ابدأ من التعلّق الكامل.'],
  ['seated-row-cable','Rudern am Kabel sitzend','Seated Cable Row','تجديف بالكيبل جالساً','horizontalPull',['back'],['biceps','shoulders'],['cable'],'beginner',2.5,['lowerBackPain'],'Griff zum unteren Brustkorb ziehen.','Pull the handle to the lower ribs.','اسحب المقبض إلى أسفل القفص الصدري.'],
  ['row-machine-chest-supported','Rudermaschine mit Brustpolster','Chest Supported Row','تجديف بإسناد الصدر','horizontalPull',['back'],['biceps'],['machine'],'beginner',2.5,[],'Beste Wahl bei empfindlichem unterem Rücken.','Best option for a sensitive lower back.','الخيار الأفضل لأسفل ظهر حسّاس.'],
  ['dumbbell-row','Kurzhantelrudern einarmig','One-Arm Dumbbell Row','تجديف دمبل بذراع واحدة','horizontalPull',['back'],['biceps','core'],['dumbbell','bench'],'beginner',2,['lowerBackPain'],'Schulter nicht nach vorne rotieren lassen.','Do not let the shoulder rotate forward.','لا تدع الكتف يدور للأمام.',true],
  ['barbell-row','Langhantelrudern','Barbell Row','تجديف بالبار','horizontalPull',['back'],['biceps','core'],['barbell'],'intermediate',2.5,['lowerBackPain'],'Oberkörper stabil bei etwa 45 Grad halten.','Hold the torso steady at about 45 degrees.','ثبّت الجذع بزاوية 45 درجة تقريباً.'],
  ['straight-arm-pulldown','Überzüge am Kabel','Straight Arm Pulldown','سحب بالذراعين ممدودتين','verticalPull',['back'],['core'],['cable'],'beginner',2.5,['shoulderPain'],'Arme fast gestreckt zur Hüfte ziehen.','Pull nearly straight arms to the hips.','اسحب الذراعين شبه ممدودتين نحو الحوض.'],
  ['band-row','Rudern mit Widerstandsband','Resistance Band Row','تجديف بالحبل المطاطي','horizontalPull',['back'],['biceps'],['band'],'beginner',0,[],'Band auf Bauchhöhe fixieren.','Anchor the band at belly height.','ثبّت الحبل على مستوى البطن.'],
  ['inverted-row','Schrägzug am Gestell','Inverted Row','تجديف مقلوب على البار','horizontalPull',['back'],['biceps','core'],['bodyweight'],'beginner',0,[],'Je aufrechter der Körper, desto leichter.','The more upright you are, the easier it gets.','كلما كان الجسم أكثر عمودية صار أسهل.'],

  // ---------------- SHOULDERS ----------------
  ['shoulder-press-machine','Schulterpresse Maschine','Shoulder Press Machine','جهاز ضغط الكتف','verticalPress',['shoulders'],['triceps'],['machine'],'beginner',2.5,[],'Sitzhöhe so wählen, dass Griffe auf Schulterhöhe sind.','Set the seat so the handles sit at shoulder height.','اضبط المقعد بحيث تكون المقابض بمستوى الكتف.'],
  ['shoulder-press-dumbbell','Schulterdrücken Kurzhantel','Dumbbell Shoulder Press','ضغط الكتف بالدمبل','verticalPress',['shoulders'],['triceps','core'],['dumbbell'],'beginner',2,['shoulderPain'],'Handflächen leicht zueinander drehen.','Turn the palms slightly toward each other.','أدر الكفين قليلاً نحو بعضهما.'],
  ['overhead-press-barbell','Schulterdrücken Langhantel','Overhead Barbell Press','ضغط البار فوق الرأس','verticalPress',['shoulders'],['triceps','core'],['barbell'],'intermediate',2.5,['shoulderPain','lowerBackPain'],'Rippen unten halten, kein Hohlkreuz.','Keep the ribs down, no big arch.','أبقِ القفص الصدري منخفضاً دون تقويس.'],
  ['lateral-raise-dumbbell','Seitheben Kurzhantel','Dumbbell Lateral Raise','رفرفة جانبية بالدمبل','lateralRaise',['shoulders'],[],['dumbbell'],'beginner',1,[],'Kleine Finger minimal höher als Daumen.','Little fingers a touch higher than thumbs.','الخنصر أعلى قليلاً من الإبهام.'],
  ['lateral-raise-cable','Seitheben Kabel','Cable Lateral Raise','رفرفة جانبية بالكيبل','lateralRaise',['shoulders'],[],['cable'],'beginner',1.25,[],'Konstante Spannung über den ganzen Weg.','Constant tension through the whole range.','شدّ ثابت طوال مدى الحركة.',true],
  ['lateral-raise-band','Seitheben mit Band','Band Lateral Raise','رفرفة جانبية بالمطاط','lateralRaise',['shoulders'],[],['band'],'beginner',0,[],'Band unter beiden Füßen fixieren.','Anchor the band under both feet.','ثبّت الحبل تحت القدمين.'],
  ['rear-delt-fly-machine','Reverse Butterfly','Reverse Pec Deck','تفتيح عكسي على الجهاز','rearDelt',['shoulders'],['back'],['machine'],'beginner',2.5,[],'Ellbogen auf Schulterhöhe führen.','Guide the elbows at shoulder height.','حرّك المرفقين بمستوى الكتف.'],
  ['face-pull','Face Pull am Kabel','Cable Face Pull','سحب باتجاه الوجه','rearDelt',['shoulders'],['back'],['cable'],'beginner',2.5,[],'Seil zur Stirn ziehen, Ellbogen hoch.','Pull the rope to the forehead, elbows high.','اسحب الحبل نحو الجبهة والمرفقان مرتفعان.'],
  ['rear-delt-fly-dumbbell','Reverse Fliegende Kurzhantel','Bent-Over Rear Delt Fly','تفتيح خلفي بالدمبل','rearDelt',['shoulders'],['back'],['dumbbell'],'beginner',1,['lowerBackPain'],'Brust Richtung Boden, Rücken gerade.','Chest toward the floor, back flat.','الصدر نحو الأرض والظهر مستقيم.'],

  // ---------------- BICEPS ----------------
  ['biceps-curl-dumbbell','Bizeps Curls Kurzhantel','Dumbbell Biceps Curl','تمرين البايسبس بالدمبل','curl',['biceps'],['forearms'],['dumbbell'],'beginner',1,['elbowPain'],'Handflächen zeigen oben nach vorne.','Palms face up at the top.','الكفان للأعلى في نهاية الحركة.'],
  ['hammer-curl','Hammer Curls','Hammer Curl','تمرين المطرقة','curl',['biceps'],['forearms'],['dumbbell'],'beginner',1,['elbowPain'],'Neutraler Griff, Daumen zeigt nach oben.','Neutral grip, thumb points up.','قبضة محايدة والإبهام للأعلى.'],
  ['biceps-curl-barbell','Bizeps Curls SZ-Stange','EZ Bar Curl','بايسبس ببار Z','curl',['biceps'],['forearms'],['barbell'],'beginner',2.5,['elbowPain','wristPain'],'SZ-Stange entlastet die Handgelenke.','The EZ bar is easier on the wrists.','بار Z أرحم للمعصمين.'],
  ['preacher-curl','Scottcurls','Preacher Curl','بايسبس على المقعد المائل','curl',['biceps'],[],['machine','barbell'],'beginner',2.5,['elbowPain'],'Ellbogen bleiben vollständig aufgelegt.','Keep the elbows fully supported.','أبقِ المرفقين مستندين تماماً.'],
  ['cable-curl','Bizeps Curls Kabel','Cable Curl','بايسبس بالكيبل','curl',['biceps'],['forearms'],['cable'],'beginner',2.5,['elbowPain'],'Ellbogen bleiben vor der Körperlinie ruhig.','Keep the elbows quiet in front of the body.','أبقِ المرفقين ثابتين أمام الجسم.'],
  ['incline-curl','Schrägbank Curls','Incline Dumbbell Curl','بايسبس على المقعد المائل بالدمبل','curl',['biceps'],[],['dumbbell','bench'],'intermediate',1,['elbowPain','shoulderPain'],'Arme hängen hinter der Körperlinie.','Arms hang behind the body line.','الذراعان متدليتان خلف خط الجسم.'],
  ['band-curl','Curls mit Band','Band Curl','بايسبس بالمطاط','curl',['biceps'],['forearms'],['band'],'beginner',0,[],'Band spannt am Ende am stärksten.','The band is hardest at the top.','المطاط يكون أصعب في نهاية الحركة.'],

  // ---------------- TRICEPS ----------------
  ['triceps-pushdown','Trizepsdrücken am Kabel','Cable Triceps Pushdown','دفع الترايسبس بالكيبل','triceps',['triceps'],[],['cable'],'beginner',2.5,['elbowPain'],'Ellbogen bleiben an der Körperseite.','Keep the elbows pinned to the sides.','أبقِ المرفقين ملاصقين للجسم.'],
  ['rope-pushdown','Seildrücken','Rope Pushdown','دفع بالحبل','triceps',['triceps'],[],['cable'],'beginner',2.5,['elbowPain'],'Unten die Seilenden auseinanderziehen.','Spread the rope ends at the bottom.','افتح طرفي الحبل في الأسفل.'],
  ['overhead-triceps-dumbbell','Trizepsdrücken über Kopf','Overhead Triceps Extension','تمديد الترايسبس فوق الرأس','triceps',['triceps'],[],['dumbbell'],'beginner',2,['elbowPain','shoulderPain'],'Oberarme senkrecht neben den Ohren halten.','Keep the upper arms vertical beside the ears.','أبقِ العضدين عموديين قرب الأذنين.'],
  ['skullcrusher','Stirndrücken','Lying Triceps Extension','تمديد الترايسبس مستلقياً','triceps',['triceps'],[],['barbell','bench'],'intermediate',2.5,['elbowPain'],'Stange zur Stirn oder knapp dahinter senken.','Lower the bar to the forehead or just behind.','أنزل البار نحو الجبهة أو خلفها قليلاً.'],
  ['triceps-dips-bench','Dips an der Bank','Bench Dips','غطس على المقعد','triceps',['triceps'],['chest','shoulders'],['bodyweight','bench'],'beginner',0,['shoulderPain'],'Gesäß nah an der Bank führen.','Keep the hips close to the bench.','أبقِ الحوض قريباً من المقعد.'],
  ['triceps-machine','Trizepsmaschine','Triceps Machine','جهاز الترايسبس','triceps',['triceps'],[],['machine'],'beginner',2.5,[],'Rücken bleibt am Polster.','Back stays on the pad.','الظهر ملاصق للمسند.'],
  ['diamond-push-up','Enger Liegestütz','Diamond Push-Up','ضغط بقبضة ضيقة','triceps',['triceps'],['chest','core'],['bodyweight'],'intermediate',0,['wristPain','elbowPain'],'Hände unter der Brust nah zusammen.','Hands close together under the chest.','اليدان متقاربتان تحت الصدر.'],

  // ---------------- FOREARMS ----------------
  ['wrist-curl','Handgelenkcurls','Wrist Curl','ثني المعصم','forearm',['forearms'],[],['dumbbell','barbell'],'beginner',1,['wristPain'],'Unterarme auf Oberschenkeln ablegen.','Rest the forearms on the thighs.','ضع الساعدين على الفخذين.'],
  ['reverse-wrist-curl','Reverse Handgelenkcurls','Reverse Wrist Curl','ثني المعصم العكسي','forearm',['forearms'],[],['dumbbell'],'beginner',1,['wristPain'],'Handrücken zeigt nach oben.','Backs of the hands face up.','ظهر الكفين للأعلى.'],
  ['farmer-hold','Farmer Hold','Farmer Hold','حمل المزارع (ثبات)','carryFullBody',['forearms'],['core','back'],['dumbbell','kettlebell'],'beginner',2,[],'Griff halten, bis die Technik nachlässt.','Hold until technique starts to fade.','احمل حتى تبدأ التقنية بالتراجع.'],
  ['reverse-curl','Reverse Curls','Reverse Curl','بايسبس بقبضة عكسية','curl',['forearms'],['biceps'],['barbell','dumbbell'],'beginner',1,['wristPain','elbowPain'],'Obergriff, Handgelenke stabil.','Overhand grip, wrists stable.','قبضة علوية والمعصمان ثابتان.'],

  // ---------------- CORE ----------------
  ['plank','Unterarmstütz','Forearm Plank','بلانك على الساعدين','coreBrace',['core'],['shoulders','glutes'],['bodyweight'],'beginner',0,[],'Ellbogen unter den Schultern.','Elbows under the shoulders.','المرفقان تحت الكتفين.'],
  ['side-plank','Seitstütz','Side Plank','بلانك جانبي','coreBrace',['core'],['glutes','shoulders'],['bodyweight'],'beginner',0,['shoulderPain'],'Hüfte aktiv nach oben drücken.','Actively press the hip up.','ادفع الحوض للأعلى بفعالية.',true],
  ['dead-bug','Dead Bug','Dead Bug','تمرين الحشرة الميتة','coreBrace',['core'],[],['bodyweight'],'beginner',0,['lowerBackPain'],'Unterer Rücken bleibt am Boden.','Lower back stays glued to the floor.','أسفل الظهر ملاصق للأرض.'],
  ['crunch','Crunches','Crunch','تمرين البطن (كرانش)','coreFlexion',['core'],[],['bodyweight'],'beginner',0,['neckPain'],'Nur Schulterblätter lösen sich vom Boden.','Only the shoulder blades leave the floor.','فقط لوحا الكتف يرتفعان عن الأرض.'],
  ['cable-crunch','Kabelcrunch','Cable Crunch','كرانش بالكيبل','coreFlexion',['core'],[],['cable'],'beginner',2.5,['lowerBackPain'],'Bewegung kommt aus der Wirbelsäule, nicht der Hüfte.','The movement comes from the spine, not the hips.','الحركة من العمود الفقري وليس الورك.'],
  ['leg-raise','Beinheben liegend','Lying Leg Raise','رفع الرجلين مستلقياً','coreFlexion',['core'],['quads'],['bodyweight'],'beginner',0,['lowerBackPain'],'Hände unter das Gesäß für mehr Stabilität.','Hands under the hips for stability.','ضع اليدين تحت الحوض للثبات.'],
  ['hanging-knee-raise','Hängendes Knieheben','Hanging Knee Raise','رفع الركبتين معلقاً','coreFlexion',['core'],['forearms'],['bodyweight'],'intermediate',0,['shoulderPain'],'Ohne Schwung, Becken leicht einrollen.','No swinging, slightly curl the pelvis.','بلا تأرجح مع لفّ بسيط للحوض.'],
  ['pallof-press','Pallof Press','Pallof Press','ضغط بالوف','coreBrace',['core'],['shoulders'],['cable','band'],'beginner',2.5,[],'Der Rumpf verhindert die Rotation.','The core resists rotation.','الجذع يقاوم الدوران.',true],

  // ---------------- GLUTES ----------------
  ['hip-thrust','Hip Thrust','Barbell Hip Thrust','دفع الحوض بالبار','hinge',['glutes'],['hamstrings','core'],['barbell','bench'],'beginner',5,[],'Oben Becken leicht einrollen, Rippen unten.','Tuck the pelvis slightly at the top, ribs down.','لفّ الحوض قليلاً في الأعلى مع خفض الأضلاع.'],
  ['glute-bridge','Beckenheben','Glute Bridge','جسر الأرداف','hinge',['glutes'],['hamstrings','core'],['bodyweight'],'beginner',0,[],'Fersen fest in den Boden drücken.','Drive the heels into the floor.','اضغط الكعبين بقوة في الأرض.'],
  ['cable-kickback','Kickbacks am Kabel','Cable Glute Kickback','ركل خلفي بالكيبل','hinge',['glutes'],['hamstrings'],['cable'],'beginner',2.5,['lowerBackPain'],'Bewegung nur aus der Hüfte.','The movement comes from the hip only.','الحركة من الورك فقط.',true],
  ['hip-abduction-machine','Abduktorenmaschine','Hip Abduction Machine','جهاز مبعّدات الورك','hipAbduction',['glutes'],[],['machine'],'beginner',2.5,[],'Oberkörper aufrecht, nicht zurücklehnen.','Stay upright, do not lean back.','ابقَ مستقيماً ولا تتكئ للخلف.'],
  ['band-hip-abduction','Abduktion mit Band','Band Hip Abduction','تبعيد الورك بالمطاط','hipAbduction',['glutes'],[],['band'],'beginner',0,[],'Band knapp über den Knien platzieren.','Place the band just above the knees.','ضع المطاط فوق الركبتين مباشرة.'],
  ['step-up','Step Ups','Step-Up','الصعود على المنصة','lunge',['glutes'],['quads','core'],['dumbbell','bench'],'beginner',2,['kneePain'],'Vollständig über das obere Bein aufrichten.','Stand up fully through the top leg.','انهض بالكامل من الرجل العليا.',true],

  // ---------------- QUADS ----------------
  ['back-squat','Kniebeuge Langhantel','Barbell Back Squat','القرفصاء بالبار','squat',['quads'],['glutes','core','hamstrings'],['barbell'],'intermediate',5,['kneePain','lowerBackPain'],'Immer im Rack mit Sicherheitsablagen arbeiten.','Always train in a rack with safety pins.','تمرّن دائماً داخل القفص مع مصدات الأمان.'],
  ['goblet-squat','Goblet Squat','Goblet Squat','قرفصاء الكأس','squat',['quads'],['glutes','core'],['dumbbell','kettlebell'],'beginner',2,['kneePain'],'Hantel eng an der Brust halten.','Hold the weight tight to the chest.','أمسك الوزن قريباً من الصدر.'],
  ['leg-press','Beinpresse','Leg Press','ضغط الأرجل','squat',['quads'],['glutes','hamstrings'],['machine'],'beginner',5,['kneePain'],'Knie nicht vollständig durchstrecken.','Do not lock the knees out hard.','لا تقفل الركبتين بالكامل.'],
  ['hack-squat','Hackenschmidt Kniebeuge','Hack Squat Machine','جهاز الهاك سكوات','squat',['quads'],['glutes'],['machine'],'intermediate',5,['kneePain'],'Rücken bleibt vollständig am Polster.','Keep the back fully on the pad.','أبقِ الظهر ملاصقاً للمسند.'],
  ['leg-extension','Beinstrecker','Leg Extension','تمديد الساق','squat',['quads'],[],['machine'],'beginner',2.5,['kneePain'],'Oben eine Sekunde halten.','Hold one second at the top.','ثبّت ثانية في الأعلى.'],
  ['split-squat','Ausfallschritt statisch','Bulgarian Split Squat','قرفصاء بلغارية','lunge',['quads'],['glutes','core'],['dumbbell','bench'],'intermediate',2,['kneePain'],'Hinteren Fuß locker auflegen.','Rest the back foot lightly.','ضع القدم الخلفية بشكل مرتاح.',true],
  ['walking-lunge','Ausfallschritte gehend','Walking Lunge','خطوات الطعن','lunge',['quads'],['glutes','hamstrings'],['dumbbell','bodyweight'],'beginner',2,['kneePain'],'Erst Technik, dann Zusatzgewicht.','Technique first, weight later.','التقنية أولاً ثم الوزن.',true],
  ['bodyweight-squat','Kniebeuge ohne Gewicht','Bodyweight Squat','قرفصاء بوزن الجسم','squat',['quads'],['glutes','core'],['bodyweight'],'beginner',0,[],'Arme zum Ausbalancieren nach vorne strecken.','Reach the arms forward to balance.','مدّ الذراعين للأمام للتوازن.'],
  ['wall-sit','Wandsitzen','Wall Sit','الجلوس على الحائط','coreBrace',['quads'],['glutes','core'],['bodyweight'],'beginner',0,['kneePain'],'Oberschenkel möglichst parallel zum Boden.','Thighs as parallel to the floor as possible.','الفخذان بموازاة الأرض قدر الإمكان.'],

  // ---------------- HAMSTRINGS ----------------
  ['romanian-deadlift','Rumänisches Kreuzheben','Romanian Deadlift','الرفعة الرومانية','hinge',['hamstrings'],['glutes','back','core'],['barbell','dumbbell'],'intermediate',2.5,['lowerBackPain'],'Stange bleibt an den Beinen entlang.','The bar stays in contact with the legs.','البار يبقى ملاصقاً للرجلين.'],
  ['deadlift','Kreuzheben','Conventional Deadlift','الرفعة الميتة','hinge',['hamstrings'],['back','glutes','core','forearms'],['barbell'],'advanced',5,['lowerBackPain'],'Erst Technik mit leichter Stange lernen.','Learn the technique with a light bar first.','تعلّم التقنية ببار خفيف أولاً.'],
  ['leg-curl-lying','Beinbeuger liegend','Lying Leg Curl','ثني الساق مستلقياً','hinge',['hamstrings'],['calves'],['machine'],'beginner',2.5,[],'Hüfte bleibt am Polster.','Keep the hips on the pad.','أبقِ الحوض ملاصقاً للمسند.'],
  ['leg-curl-seated','Beinbeuger sitzend','Seated Leg Curl','ثني الساق جالساً','hinge',['hamstrings'],[],['machine'],'beginner',2.5,[],'Polster knapp über den Knöcheln fixieren.','Set the pad just above the ankles.','ثبّت الوسادة فوق الكاحلين مباشرة.'],
  ['good-morning','Good Morning','Good Morning','تمرين الصباح الجيد','hinge',['hamstrings'],['back','glutes'],['barbell'],'advanced',2.5,['lowerBackPain'],'Sehr leicht starten, Rücken bleibt neutral.','Start very light, back stays neutral.','ابدأ بوزن خفيف جداً والظهر محايد.'],
  ['nordic-curl-assisted','Nordic Curl unterstützt','Assisted Nordic Curl','تمرين نورديك بمساعدة','hinge',['hamstrings'],['glutes','core'],['bodyweight'],'advanced',0,['kneePain'],'Mit den Händen abfangen.','Catch yourself with the hands.','استقبل نفسك باليدين.'],

  // ---------------- CALVES ----------------
  ['standing-calf-raise','Wadenheben stehend','Standing Calf Raise','رفع السمانة واقفاً','calf',['calves'],[],['machine','dumbbell'],'beginner',2.5,[],'Vollen Bewegungsweg nutzen.','Use the full range of motion.','استخدم مدى الحركة الكامل.'],
  ['seated-calf-raise','Wadenheben sitzend','Seated Calf Raise','رفع السمانة جالساً','calf',['calves'],[],['machine'],'beginner',2.5,[],'Sitzend trifft es den tieferen Wadenmuskel.','Seated hits the deeper calf muscle.','الجلوس يستهدف العضلة العميقة.'],
  ['calf-raise-bodyweight','Wadenheben ohne Gewicht','Bodyweight Calf Raise','رفع السمانة بوزن الجسم','calf',['calves'],[],['bodyweight'],'beginner',0,[],'Auf einer Stufe für mehr Dehnung.','Use a step for more stretch.','استخدم درجة لزيادة التمدد.'],
  ['single-leg-calf-raise','Einbeiniges Wadenheben','Single-Leg Calf Raise','رفع السمانة برجل واحدة','calf',['calves'],['core'],['bodyweight','dumbbell'],'intermediate',2,[],'Leicht festhalten für das Gleichgewicht.','Hold on lightly for balance.','استند بخفة للتوازن.',true],

  // ---------------- FULL BODY ----------------
  ['kettlebell-swing','Kettlebell Swing','Kettlebell Swing','مرجحة الكيتلبل','hinge',['fullBody'],['glutes','hamstrings','core'],['kettlebell'],'intermediate',4,['lowerBackPain'],'Kraft kommt aus der Hüfte, nicht den Armen.','The power comes from the hips, not the arms.','القوة من الورك وليس الذراعين.'],
  ['farmer-walk','Farmer Walk','Farmer Walk','مشي المزارع','carryFullBody',['fullBody'],['forearms','core','back'],['dumbbell','kettlebell'],'beginner',2,[],'Aufrecht gehen, kurze kontrollierte Schritte.','Walk tall with short controlled steps.','امشِ مستقيماً بخطوات قصيرة ومتحكّمة.'],
  ['dumbbell-thruster','Thruster Kurzhantel','Dumbbell Thruster','ثراستر بالدمبل','verticalPress',['fullBody'],['shoulders','quads','core'],['dumbbell'],'intermediate',2,['shoulderPain','kneePain'],'Kniebeuge und Drücken fließend verbinden.','Blend the squat and press into one motion.','ادمج القرفصاء والدفع بحركة واحدة.'],
  ['bear-crawl','Bear Crawl','Bear Crawl','زحف الدب','coreBrace',['fullBody'],['core','shoulders'],['bodyweight'],'beginner',0,['wristPain'],'Hüfte bleibt tief und ruhig.','Keep the hips low and quiet.','أبقِ الحوض منخفضاً وثابتاً.'],
  ['burpee-step','Burpee mit Schritt','Step-Back Burpee','بيربي بخطوة','carryFullBody',['fullBody'],['core','chest','quads'],['bodyweight'],'intermediate',0,['kneePain','highImpact'],'Gelenkschonende Variante ohne Sprung.','Joint friendly version without the jump.','نسخة لطيفة على المفاصل بلا قفز.']
];

function build(): Exercise[] {
  const list: Exercise[] = ROWS.map((r) => ({
    id: r[0],
    name: { de: r[1], en: r[2], ar: r[3] },
    pattern: r[4],
    primary: r[5],
    secondary: r[6],
    equipment: r[7],
    difficulty: r[8],
    isCompound: COMPOUND.includes(r[4]) && r[6].length > 0,
    loadStep: r[9],
    contraindications: r[10],
    cue: { de: r[11], en: r[12], ar: r[13] },
    unilateral: r[14] ?? false,
    media: { type: 'svg', ref: r[4] },
    alternatives: []
  }));

  // Alternativen deterministisch: gleicher Primärmuskel, bevorzugt anderes Gerät.
  for (const ex of list) {
    ex.alternatives = list
      .filter((o) => o.id !== ex.id && o.primary[0] === ex.primary[0])
      .sort((a, b) => {
        const diffEquip = (x: Exercise) => (x.equipment.some((e) => ex.equipment.includes(e)) ? 1 : 0);
        return diffEquip(a) - diffEquip(b) || a.difficulty.localeCompare(b.difficulty);
      })
      .slice(0, 4)
      .map((o) => o.id);
  }
  return list;
}

export const EXERCISES: Exercise[] = build();
export const EXERCISE_MAP: Record<string, Exercise> = Object.fromEntries(EXERCISES.map((e) => [e.id, e]));
export const getExercise = (id: string): Exercise | undefined => EXERCISE_MAP[id];

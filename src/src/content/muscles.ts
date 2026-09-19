import type { LocalizedText, MuscleGroup } from '@/types';

export interface MuscleInfo {
  id: MuscleGroup;
  name: LocalizedText;
  fn: LocalizedText;
  /** Erholungszeit in Stunden für die Recovery-Anzeige */
  recoveryHours: number;
  side: 'front' | 'back' | 'both';
}

export const MUSCLES: Record<MuscleGroup, MuscleInfo> = {
  chest: {
    id: 'chest', side: 'front', recoveryHours: 48,
    name: { de: 'Brust', en: 'Chest', ar: 'الصدر' },
    fn: { de: 'Drückt die Arme nach vorn und führt sie zur Körpermitte.', en: 'Pushes the arms forward and brings them toward the midline.', ar: 'يدفع الذراعين للأمام ويقرّبهما نحو منتصف الجسم.' }
  },
  back: {
    id: 'back', side: 'back', recoveryHours: 48,
    name: { de: 'Rücken', en: 'Back', ar: 'الظهر' },
    fn: { de: 'Zieht die Arme zum Körper und stabilisiert die Wirbelsäule.', en: 'Pulls the arms toward the body and stabilises the spine.', ar: 'يسحب الذراعين نحو الجسم ويثبّت العمود الفقري.' }
  },
  shoulders: {
    id: 'shoulders', side: 'both', recoveryHours: 48,
    name: { de: 'Schultern', en: 'Shoulders', ar: 'الأكتاف' },
    fn: { de: 'Hebt die Arme nach oben und zur Seite.', en: 'Raises the arms overhead and to the side.', ar: 'يرفع الذراعين للأعلى وللجانب.' }
  },
  biceps: {
    id: 'biceps', side: 'front', recoveryHours: 36,
    name: { de: 'Bizeps', en: 'Biceps', ar: 'العضلة ذات الرأسين' },
    fn: { de: 'Beugt den Ellbogen und dreht den Unterarm.', en: 'Bends the elbow and rotates the forearm.', ar: 'يثني المرفق ويدير الساعد.' }
  },
  triceps: {
    id: 'triceps', side: 'back', recoveryHours: 36,
    name: { de: 'Trizeps', en: 'Triceps', ar: 'العضلة ثلاثية الرؤوس' },
    fn: { de: 'Streckt den Ellbogen bei allen Drückbewegungen.', en: 'Extends the elbow in every pressing movement.', ar: 'يبسط المرفق في كل حركات الدفع.' }
  },
  forearms: {
    id: 'forearms', side: 'both', recoveryHours: 24,
    name: { de: 'Unterarme', en: 'Forearms', ar: 'الساعدان' },
    fn: { de: 'Steuert Griffkraft und Handgelenk.', en: 'Controls grip strength and the wrist.', ar: 'يتحكم بقوة القبضة والمعصم.' }
  },
  core: {
    id: 'core', side: 'front', recoveryHours: 24,
    name: { de: 'Rumpf', en: 'Core', ar: 'عضلات الجذع' },
    fn: { de: 'Stabilisiert Becken und Wirbelsäule.', en: 'Stabilises the pelvis and spine.', ar: 'يثبّت الحوض والعمود الفقري.' }
  },
  glutes: {
    id: 'glutes', side: 'back', recoveryHours: 48,
    name: { de: 'Gesäß', en: 'Glutes', ar: 'عضلات الأرداف' },
    fn: { de: 'Streckt die Hüfte, stärkster Muskel im Alltag.', en: 'Extends the hip, the strongest muscle in daily life.', ar: 'يبسط الورك، أقوى عضلة في الحياة اليومية.' }
  },
  quads: {
    id: 'quads', side: 'front', recoveryHours: 48,
    name: { de: 'Quadrizeps', en: 'Quadriceps', ar: 'العضلة رباعية الرؤوس' },
    fn: { de: 'Streckt das Knie beim Stehen, Gehen, Springen.', en: 'Extends the knee for standing, walking, jumping.', ar: 'يبسط الركبة عند الوقوف والمشي والقفز.' }
  },
  hamstrings: {
    id: 'hamstrings', side: 'back', recoveryHours: 48,
    name: { de: 'Beinbeuger', en: 'Hamstrings', ar: 'أوتار الركبة' },
    fn: { de: 'Beugt das Knie und unterstützt die Hüftstreckung.', en: 'Bends the knee and assists hip extension.', ar: 'يثني الركبة ويساعد على بسط الورك.' }
  },
  calves: {
    id: 'calves', side: 'back', recoveryHours: 24,
    name: { de: 'Waden', en: 'Calves', ar: 'السمانة' },
    fn: { de: 'Drückt den Fuß nach unten, wichtig für jeden Schritt.', en: 'Pushes the foot down, essential for every step.', ar: 'يدفع القدم للأسفل، أساسي لكل خطوة.' }
  },
  fullBody: {
    id: 'fullBody', side: 'both', recoveryHours: 48,
    name: { de: 'Ganzkörper', en: 'Full body', ar: 'الجسم كامل' },
    fn: { de: 'Mehrere große Muskelgruppen arbeiten gleichzeitig.', en: 'Several large muscle groups work at the same time.', ar: 'عدة مجموعات عضلية كبيرة تعمل معاً.' }
  }
};

export const muscleName = (m: MuscleGroup, l: 'de' | 'en' | 'ar') => MUSCLES[m].name[l];

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';
import type { ContraindicationTag, Equipment, ExperienceLevel, Gender, Locale, ProgramGoal, Profile, TrainingPlace, UnitSystem } from '@/types';
import { EQUIPMENT } from '@/types';
import { Button, Card, Chip, Field, Input, Progress, Select, Toggle } from '@/components/ui';
import { Wordmark } from '@/components/Layout';
import { useAppStore } from '@/store/appStore';
import { demoProfile } from '@/content/demoProfile';
import { displayLength, displayWeight, inToCm, lbToKg } from '@/lib/units';

const GOALS: ProgramGoal[] = ['muscle', 'strength', 'fatLoss', 'health', 'returning'];
const LEVELS: ExperienceLevel[] = ['beginner', 'returning', 'intermediate', 'advanced'];
const PLACES: TrainingPlace[] = ['gym', 'home', 'mixed'];
const RESTRICTIONS: ContraindicationTag[] = ['shoulderPain', 'lowerBackPain', 'kneePain', 'wristPain', 'elbowPain', 'neckPain', 'highImpact'];
const STEPS = 7;

interface Draft {
  name: string; age: string; gender: Gender; heightCm: string; weightKg: string; goalWeightKg: string;
  units: UnitSystem; goal: ProgramGoal; experience: ExperienceLevel; returning: boolean;
  place: TrainingPlace; equipment: Equipment[]; daysPerWeek: number; weekdays: number[];
  sessionMinutes: number; restrictions: ContraindicationTag[]; locale: Locale;
  ads: boolean; analytics: boolean; personalized: boolean;
}

export default function OnboardingScreen() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const saveProfile = useAppStore((s) => s.saveProfile);
  const setConsent = useAppStore((s) => s.setConsent);
  const setLocale = useAppStore((s) => s.setLocale);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [d, setD] = useState<Draft>({
    name: '', age: '30', gender: 'unspecified', heightCm: '175', weightKg: '75', goalWeightKg: '78',
    units: 'metric', goal: 'muscle', experience: 'beginner', returning: false,
    place: 'gym', equipment: ['machine', 'cable', 'dumbbell', 'bodyweight'], daysPerWeek: 3, weekdays: [0, 2, 4],
    sessionMinutes: 60, restrictions: [], locale: (i18n.language as Locale) ?? 'de',
    ads: true, analytics: false, personalized: false
  });

  const patch = (p: Partial<Draft>) => setD((prev) => ({ ...prev, ...p }));
  const toggle = <T,>(list: T[], v: T): T[] => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const validate = (s: number): boolean => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!d.name.trim()) e.name = t('onboarding.errName');
      const age = Number(d.age);
      if (!Number.isFinite(age) || age < 14 || age > 99) e.age = t('onboarding.errAge');
    }
    if (s === 2) {
      const h = Number(d.heightCm);
      const w = Number(d.weightKg);
      if (!Number.isFinite(h) || h < 100 || h > 260) e.height = t('onboarding.errHeight');
      if (!Number.isFinite(w) || w < 30 || w > 300) e.weight = t('onboarding.errWeight');
    }
    if (s === 5 && d.equipment.length === 0) e.equipment = t('onboarding.errEquipment');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate(step)) setStep((s) => Math.min(STEPS, s + 1)); };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const finish = async (profile?: Profile) => {
    const heightCm = d.units === 'metric' ? Number(d.heightCm) : inToCm(Number(d.heightCm));
    const weightKg = d.units === 'metric' ? Number(d.weightKg) : lbToKg(Number(d.weightKg));
    const goalWeightKg = d.units === 'metric' ? Number(d.goalWeightKg) : lbToKg(Number(d.goalWeightKg));
    const p: Profile = profile ?? {
      id: 1, name: d.name.trim(), age: Number(d.age), gender: d.gender,
      heightCm, weightKg, goalWeightKg,
      units: d.units, goal: d.goal, experience: d.returning ? 'returning' : d.experience,
      returningAfterBreak: d.returning, place: d.place, equipment: d.equipment,
      daysPerWeek: d.daysPerWeek, weekdays: d.weekdays, sessionMinutes: d.sessionMinutes,
      restrictions: d.restrictions, avoidExerciseIds: [], locale: d.locale,
      createdAt: Date.now(), onboardingComplete: true
    };
    await saveProfile(p);
    setConsent({ ads: d.ads, analytics: d.analytics, personalizedAds: d.personalized && p.age >= 18 });
    navigate('/', { replace: true });
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-4 pb-10 pt-8">
      {step > 0 && (
        <div className="mb-5">
          <Progress value={(step / STEPS) * 100} label={t('onboarding.step', { current: step, total: STEPS })} />
          <p className="mt-2 text-xs muted">{t('onboarding.step', { current: step, total: STEPS })}</p>
        </div>
      )}

      {step === 0 && (
        <div className="flex flex-1 flex-col justify-center gap-6 animate-fade-up">
          <div>
            <Wordmark />
            <h1 className="mt-5 font-display text-[32px] font-bold leading-tight">{t('onboarding.welcomeTitle')}</h1>
            <p className="mt-3 text-[15px] muted">{t('onboarding.welcomeText')}</p>
            <p className="mt-4 text-sm font-semibold text-brand-600">{t('common.tagline')}</p>
          </div>
          <div className="space-y-3">
            <Button size="lg" className="w-full" onClick={() => setStep(1)}>{t('onboarding.welcomeCta')}<ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden /></Button>
            <Card className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl tint text-brand-500">
                <Sparkles className="h-5 w-5" aria-hidden />
              </span>
              <div className="flex-1">
                <p className="font-semibold">{t('onboarding.demoTitle')}</p>
                <p className="mt-1 text-sm muted">{t('onboarding.demoText')}</p>
                <Button variant="secondary" size="sm" className="mt-3" onClick={() => void finish(demoProfile(d.locale))}>
                  {t('common.start')}
                </Button>
              </div>
            </Card>
            <Field label={t('onboarding.languageLabel')} htmlFor="ob-lang">
              <Select id="ob-lang" value={d.locale} onChange={(e) => { const l = e.target.value as Locale; patch({ locale: l }); setLocale(l); }}>
                <option value="de">Deutsch</option>
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </Select>
            </Field>
          </div>
        </div>
      )}

      {step === 1 && (
        <section className="animate-fade-up">
          <h2 className="mb-4 font-display text-xl font-semibold">{t('onboarding.s1')}</h2>
          <Field label={t('onboarding.name')} error={errors.name} htmlFor="ob-name">
            <Input id="ob-name" value={d.name} placeholder={t('onboarding.namePh')} onChange={(e) => patch({ name: e.target.value })} />
          </Field>
          <Field label={t('onboarding.age')} error={errors.age} htmlFor="ob-age">
            <Input id="ob-age" type="number" inputMode="numeric" value={d.age} onChange={(e) => patch({ age: e.target.value })} />
          </Field>
          <Field label={`${t('onboarding.genderLabel')} (${t('common.optional')})`} htmlFor="ob-gender">
            <Select id="ob-gender" value={d.gender} onChange={(e) => patch({ gender: e.target.value as Gender })}>
              {(['unspecified', 'male', 'female', 'other'] as Gender[]).map((g) => <option key={g} value={g}>{t(`gender.${g}`)}</option>)}
            </Select>
          </Field>
        </section>
      )}

      {step === 2 && (
        <section className="animate-fade-up">
          <h2 className="mb-4 font-display text-xl font-semibold">{t('onboarding.s2')}</h2>
          <Field label={t('onboarding.unitsLabel')} htmlFor="ob-units">
            <Select
              id="ob-units" value={d.units}
              onChange={(e) => {
                const u = e.target.value as UnitSystem;
                const conv = (v: string, kind: 'w' | 'h') => {
                  const n = Number(v);
                  if (!Number.isFinite(n)) return v;
                  if (u === 'imperial') return String(kind === 'w' ? displayWeight(n, 'imperial') : displayLength(n, 'imperial'));
                  return String(kind === 'w' ? Math.round(lbToKg(n) * 10) / 10 : Math.round(inToCm(n)));
                };
                patch({ units: u, heightCm: conv(d.heightCm, 'h'), weightKg: conv(d.weightKg, 'w'), goalWeightKg: conv(d.goalWeightKg, 'w') });
              }}
            >
              <option value="metric">{t('units.metric')}</option>
              <option value="imperial">{t('units.imperial')}</option>
            </Select>
          </Field>
          <Field label={`${t('onboarding.height')} (${d.units === 'metric' ? t('common.cm') : t('common.in')})`} error={errors.height} htmlFor="ob-h">
            <Input id="ob-h" type="number" inputMode="decimal" value={d.heightCm} onChange={(e) => patch({ heightCm: e.target.value })} />
          </Field>
          <Field label={`${t('onboarding.weight')} (${d.units === 'metric' ? t('common.kg') : t('common.lb')})`} error={errors.weight} htmlFor="ob-w">
            <Input id="ob-w" type="number" inputMode="decimal" value={d.weightKg} onChange={(e) => patch({ weightKg: e.target.value })} />
          </Field>
          <Field label={`${t('onboarding.goalWeight')} (${d.units === 'metric' ? t('common.kg') : t('common.lb')})`} htmlFor="ob-gw">
            <Input id="ob-gw" type="number" inputMode="decimal" value={d.goalWeightKg} onChange={(e) => patch({ goalWeightKg: e.target.value })} />
          </Field>
        </section>
      )}

      {step === 3 && (
        <section className="animate-fade-up">
          <h2 className="mb-4 font-display text-xl font-semibold">{t('onboarding.s3')}</h2>
          <p className="mb-2 text-sm font-medium">{t('onboarding.goalLabel')}</p>
          <div className="mb-5 flex flex-wrap gap-2">
            {GOALS.map((g) => <Chip key={g} active={d.goal === g} onClick={() => patch({ goal: g })}>{t(`goal.${g}`)}</Chip>)}
          </div>
          <p className="mb-2 text-sm font-medium">{t('onboarding.experienceLabel')}</p>
          <div className="mb-3 flex flex-wrap gap-2">
            {LEVELS.map((l) => <Chip key={l} active={d.experience === l} onClick={() => patch({ experience: l })}>{t(`level.${l}`)}</Chip>)}
          </div>
          <Card><Toggle id="ob-ret" checked={d.returning} onChange={(v) => patch({ returning: v })} label={t('onboarding.returningLabel')} /></Card>
        </section>
      )}

      {step === 4 && (
        <section className="animate-fade-up">
          <h2 className="mb-4 font-display text-xl font-semibold">{t('onboarding.s4')}</h2>
          <p className="mb-2 text-sm font-medium">{t('onboarding.placeLabel')}</p>
          <div className="mb-5 flex flex-wrap gap-2">
            {PLACES.map((p) => <Chip key={p} active={d.place === p} onClick={() => patch({ place: p })}>{t(`place.${p}`)}</Chip>)}
          </div>
          <p className="mb-2 text-sm font-medium">{t('onboarding.daysLabel')}</p>
          <div className="mb-5 flex flex-wrap gap-2">
            {[2, 3, 4, 5, 6].map((n) => <Chip key={n} active={d.daysPerWeek === n} onClick={() => patch({ daysPerWeek: n })}>{n}</Chip>)}
          </div>
          <p className="mb-2 text-sm font-medium">{t('onboarding.weekdaysLabel')}</p>
          <div className="mb-5 flex flex-wrap gap-2">
            {[0, 1, 2, 3, 4, 5, 6].map((n) => (
              <Chip key={n} active={d.weekdays.includes(n)} onClick={() => patch({ weekdays: toggle(d.weekdays, n) })}>{t(`wd.${n}`)}</Chip>
            ))}
          </div>
          <p className="mb-2 text-sm font-medium">{t('onboarding.durationLabel')}</p>
          <div className="flex flex-wrap gap-2">
            {[30, 45, 60, 75, 90].map((m) => <Chip key={m} active={d.sessionMinutes === m} onClick={() => patch({ sessionMinutes: m })}>{m} {t('common.min')}</Chip>)}
          </div>
        </section>
      )}

      {step === 5 && (
        <section className="animate-fade-up">
          <h2 className="mb-4 font-display text-xl font-semibold">{t('onboarding.s5')}</h2>
          <p className="mb-2 text-sm font-medium">{t('onboarding.equipmentLabel')}</p>
          <div className="flex flex-wrap gap-2">
            {EQUIPMENT.map((e) => <Chip key={e} active={d.equipment.includes(e)} onClick={() => patch({ equipment: toggle(d.equipment, e) })}>{t(`equip.${e}`)}</Chip>)}
          </div>
          {errors.equipment && <p className="mt-3 text-xs text-red-600" role="alert">{errors.equipment}</p>}
        </section>
      )}

      {step === 6 && (
        <section className="animate-fade-up">
          <h2 className="mb-1 font-display text-xl font-semibold">{t('onboarding.s6')}</h2>
          <p className="mb-4 text-sm muted">{t('onboarding.restrictionsHint')}</p>
          <div className="flex flex-wrap gap-2">
            {RESTRICTIONS.map((r) => <Chip key={r} active={d.restrictions.includes(r)} onClick={() => patch({ restrictions: toggle(d.restrictions, r) })}>{t(`restriction.${r}`)}</Chip>)}
          </div>
        </section>
      )}

      {step === 7 && (
        <section className="animate-fade-up">
          <h2 className="mb-1 font-display text-xl font-semibold">{t('onboarding.consentTitle')}</h2>
          <p className="mb-4 text-sm muted">{t('onboarding.consentText')}</p>
          <Card>
            <Toggle id="c-ads" checked={d.ads} onChange={(v) => patch({ ads: v, personalized: v ? d.personalized : false })} label={t('onboarding.consentAds')} />
            <Toggle id="c-an" checked={d.analytics} onChange={(v) => patch({ analytics: v })} label={t('onboarding.consentAnalytics')} />
            <Toggle id="c-pers" checked={d.personalized} onChange={(v) => patch({ personalized: v })} label={t('onboarding.consentPersonalized')} description={t('onboarding.consentMinor')} />
          </Card>
        </section>
      )}

      {step > 0 && (
        <div className="mt-auto flex gap-3 pt-8">
          <Button variant="secondary" onClick={back}><ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />{t('common.back')}</Button>
          {step < STEPS ? (
            <Button className="flex-1" onClick={next}>{t('common.next')}<ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden /></Button>
          ) : (
            <Button className="flex-1" onClick={() => void finish()}><Check className="h-4 w-4" aria-hidden />{t('onboarding.finishCta')}</Button>
          )}
        </div>
      )}
    </main>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, ChevronRight, Crown, FileText, Languages, Moon, Scale, ShieldCheck, Stethoscope, Sun, User } from 'lucide-react';
import type { ContraindicationTag, Equipment, ExperienceLevel, Gender, Locale, ProgramGoal, TrainingPlace, UnitSystem } from '@/types';
import { EQUIPMENT, LOCALES } from '@/types';
import { Badge, Button, Card, Chip, Dialog, Field, Input, SectionTitle, Select, Toggle } from '@/components/ui';
import { Page } from '@/components/Layout';
import { useAppStore } from '@/store/appStore';
import { displayLength, displayWeight, toKg, inToCm, weightUnit, lengthUnit } from '@/lib/units';

const LOCALE_LABEL: Record<Locale, string> = { de: 'Deutsch', en: 'English', ar: 'العربية' };
const GOALS: ProgramGoal[] = ['muscle', 'strength', 'fatLoss', 'health', 'returning'];
const LEVELS: ExperienceLevel[] = ['beginner', 'returning', 'intermediate', 'advanced'];
const PLACES: TrainingPlace[] = ['gym', 'home', 'mixed'];
const RESTRICTIONS: ContraindicationTag[] = ['shoulderPain', 'lowerBackPain', 'kneePain', 'wristPain', 'elbowPain', 'neckPain', 'highImpact'];

export default function ProfileScreen() {
  const { t } = useTranslation();
  const profile = useAppStore((s) => s.profile);
  const settings = useAppStore((s) => s.settings);
  const setLocale = useAppStore((s) => s.setLocale);
  const setTheme = useAppStore((s) => s.setTheme);
  const setUnits = useAppStore((s) => s.setUnits);
  const setPremium = useAppStore((s) => s.setPremium);
  const setConsent = useAppStore((s) => s.setConsent);
  const saveProfile = useAppStore((s) => s.saveProfile);
  const [editOpen, setEditOpen] = useState(false);
  const [consentOpen, setConsentOpen] = useState(false);

  if (!profile) return null;
  const units = settings.units;
  const wUnit = weightUnit(units);
  const lUnit = lengthUnit(units);

  const toggleIn = <T,>(list: T[], v: T): T[] => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  return (
    <Page title={t('profile.title')}>
      <Card>
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-white">
            <User className="h-6 w-6" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-semibold">{profile.name}</p>
            <p className="text-sm muted">
              {t(`goal.${profile.goal}`)} · {t(`level.${profile.experience}`)}
            </p>
          </div>
          <Badge tone={settings.premium ? 'warn' : 'neutral'}>
            {settings.premium ? <><Crown className="h-3 w-3" aria-hidden />{t('common.premium')}</> : t('common.free')}
          </Badge>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div><dt className="text-xs muted">{t('onboarding.age')}</dt><dd className="font-medium">{profile.age}</dd></div>
          <div><dt className="text-xs muted">{t('onboarding.height')}</dt><dd className="font-medium">{displayLength(profile.heightCm, units)} {lUnit}</dd></div>
          <div><dt className="text-xs muted">{t('onboarding.weight')}</dt><dd className="font-medium">{displayWeight(profile.weightKg, units)} {wUnit}</dd></div>
          <div><dt className="text-xs muted">{t('onboarding.goalWeight')}</dt><dd className="font-medium">{displayWeight(profile.goalWeightKg, units)} {wUnit}</dd></div>
          <div><dt className="text-xs muted">{t('onboarding.daysLabel')}</dt><dd className="font-medium">{profile.daysPerWeek}</dd></div>
          <div><dt className="text-xs muted">{t('onboarding.durationLabel')}</dt><dd className="font-medium">{t('common.minutes', { count: profile.sessionMinutes })}</dd></div>
        </dl>

        <Button variant="secondary" className="mt-4 w-full" onClick={() => setEditOpen(true)}>{t('profile.edit')}</Button>
      </Card>

      <SectionTitle>{t('profile.language')}</SectionTitle>
      <Card>
        <div className="flex flex-wrap gap-2" role="group" aria-label={t('profile.language')}>
          {LOCALES.map((l) => (
            <Chip key={l} active={settings.locale === l} onClick={() => setLocale(l)}>
              <span className="inline-flex items-center gap-1"><Languages className="h-3.5 w-3.5" aria-hidden />{LOCALE_LABEL[l]}</span>
            </Chip>
          ))}
        </div>
      </Card>

      <SectionTitle>{t('profile.appearance')}</SectionTitle>
      <Card>
        <div className="flex flex-wrap gap-2" role="group" aria-label={t('profile.appearance')}>
          <Chip active={settings.theme === 'light'} onClick={() => setTheme('light')}>
            <span className="inline-flex items-center gap-1"><Sun className="h-3.5 w-3.5" aria-hidden />{t('profile.themeLight')}</span>
          </Chip>
          <Chip active={settings.theme === 'dark'} onClick={() => setTheme('dark')}>
            <span className="inline-flex items-center gap-1"><Moon className="h-3.5 w-3.5" aria-hidden />{t('profile.themeDark')}</span>
          </Chip>
          <Chip active={settings.theme === 'system'} onClick={() => setTheme('system')}>{t('profile.themeSystem')}</Chip>
        </div>

        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={t('profile.unitsTitle')}>
          {(['metric', 'imperial'] as UnitSystem[]).map((u) => (
            <Chip key={u} active={units === u} onClick={() => setUnits(u)}>
              <span className="inline-flex items-center gap-1"><Scale className="h-3.5 w-3.5" aria-hidden />{t(`units.${u}`)}</span>
            </Chip>
          ))}
        </div>
      </Card>

      <SectionTitle>{t('profile.plan')}</SectionTitle>
      <Card>
        <p className="text-sm">{settings.premium ? t('profile.premiumDesc') : t('profile.freeDesc')}</p>
        <Button
          className="mt-3"
          variant={settings.premium ? 'secondary' : 'primary'}
          onClick={() => setPremium(!settings.premium)}
        >
          <Crown className="h-4 w-4" aria-hidden />
          {settings.premium ? t('profile.downgrade') : t('profile.upgrade')}
        </Button>
        <p className="mt-2 text-xs muted">{t('profile.devNote')}</p>
      </Card>

      <SectionTitle>{t('profile.consentSettings')}</SectionTitle>
      <Card>
        <Toggle
          id="c-ads"
          checked={settings.consent.ads}
          onChange={(v) => setConsent({ ads: v })}
          label={t('onboarding.consentAds')}
        />
        <Toggle
          id="c-analytics"
          checked={settings.consent.analytics}
          onChange={(v) => setConsent({ analytics: v })}
          label={t('onboarding.consentAnalytics')}
        />
        <Toggle
          id="c-personalized"
          checked={settings.consent.personalizedAds}
          onChange={(v) => setConsent({ personalizedAds: v })}
          label={t('onboarding.consentPersonalized')}
          description={profile.age < 18 ? t('onboarding.consentMinor') : undefined}
        />
        <Button size="sm" variant="ghost" className="mt-2" onClick={() => setConsentOpen(true)}>{t('privacy.withdraw')}</Button>
      </Card>

      <SectionTitle>{t('profile.about')}</SectionTitle>
      <ul className="space-y-2">
        <NavRow to="/education" icon={<BookOpen className="h-4 w-4" aria-hidden />} label={t('profile.education')} />
        <NavRow to="/legal/privacy" icon={<ShieldCheck className="h-4 w-4" aria-hidden />} label={t('profile.privacy')} />
        <NavRow to="/legal/terms" icon={<FileText className="h-4 w-4" aria-hidden />} label={t('profile.terms')} />
        <NavRow to="/legal/disclaimer" icon={<Stethoscope className="h-4 w-4" aria-hidden />} label={t('profile.disclaimer')} />
      </ul>
      <p className="mt-4 text-xs muted">{t('common.appName')} · {t('profile.version')} 1.0.0 · {t('common.tagline')}</p>

      <Dialog
        open={consentOpen}
        title={t('privacy.withdraw')}
        onClose={() => setConsentOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setConsentOpen(false)}>{t('common.cancel')}</Button>
            <Button
              variant="danger"
              onClick={() => { setConsent({ ads: false, analytics: false, personalizedAds: false }); setConsentOpen(false); }}
            >
              {t('common.confirm')}
            </Button>
          </>
        }
      >
        {t('privacy.p2')}
      </Dialog>

      <Dialog
        open={editOpen}
        title={t('profile.edit')}
        onClose={() => setEditOpen(false)}
        footer={<Button variant="ghost" onClick={() => setEditOpen(false)}>{t('common.close')}</Button>}
      >
        <EditProfileForm
          onDone={() => setEditOpen(false)}
          save={saveProfile}
          profile={profile}
          units={units}
          toggleIn={toggleIn}
        />
      </Dialog>
    </Page>
  );
}

function NavRow({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <li>
      <Link to={to} className="card flex items-center gap-3 p-3.5">
        <span className="text-brand-500">{icon}</span>
        <span className="flex-1 font-medium">{label}</span>
        <ChevronRight className="h-4 w-4 muted rtl:rotate-180" aria-hidden />
      </Link>
    </li>
  );
}

function EditProfileForm({
  profile, units, save, onDone, toggleIn
}: {
  profile: NonNullable<ReturnType<typeof useAppStore.getState>['profile']>;
  units: UnitSystem;
  save: (p: typeof profile) => Promise<void>;
  onDone: () => void;
  toggleIn: <T>(list: T[], v: T) => T[];
}) {
  const { t } = useTranslation();
  const [d, setD] = useState({
    name: profile.name,
    age: String(profile.age),
    gender: profile.gender as Gender,
    height: String(displayLength(profile.heightCm, units)),
    weight: String(displayWeight(profile.weightKg, units)),
    goalWeight: String(displayWeight(profile.goalWeightKg, units)),
    goal: profile.goal,
    experience: profile.experience,
    returning: profile.returningAfterBreak,
    place: profile.place,
    equipment: profile.equipment,
    daysPerWeek: profile.daysPerWeek,
    weekdays: profile.weekdays,
    sessionMinutes: profile.sessionMinutes,
    restrictions: profile.restrictions
  });

  const submit = async () => {
    const num = (v: string) => Number(v.replace(',', '.')) || 0;
    await save({
      ...profile,
      name: d.name.trim() || profile.name,
      age: Math.min(99, Math.max(14, Number(d.age) || profile.age)),
      gender: d.gender,
      heightCm: units === 'metric' ? num(d.height) : inToCm(num(d.height)),
      weightKg: toKg(num(d.weight), units),
      goalWeightKg: toKg(num(d.goalWeight), units),
      goal: d.goal,
      experience: d.experience,
      returningAfterBreak: d.returning,
      place: d.place,
      equipment: d.equipment,
      daysPerWeek: d.daysPerWeek,
      weekdays: d.weekdays,
      sessionMinutes: d.sessionMinutes,
      restrictions: d.restrictions
    });
    onDone();
  };

  return (
    <div>
      <Field label={t('onboarding.name')} htmlFor="p-name">
        <Input id="p-name" value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label={t('onboarding.age')} htmlFor="p-age">
          <Input id="p-age" inputMode="numeric" value={d.age} onChange={(e) => setD({ ...d, age: e.target.value })} />
        </Field>
        <Field label={t('onboarding.genderLabel')} htmlFor="p-gender">
          <Select id="p-gender" value={d.gender} onChange={(e) => setD({ ...d, gender: e.target.value as Gender })}>
            {(['male', 'female', 'other', 'unspecified'] as Gender[]).map((g) => (
              <option key={g} value={g}>{t(`gender.${g}`)}</option>
            ))}
          </Select>
        </Field>
        <Field label={`${t('onboarding.height')} (${lengthUnit(units)})`} htmlFor="p-height">
          <Input id="p-height" inputMode="decimal" value={d.height} onChange={(e) => setD({ ...d, height: e.target.value })} />
        </Field>
        <Field label={`${t('onboarding.weight')} (${weightUnit(units)})`} htmlFor="p-weight">
          <Input id="p-weight" inputMode="decimal" value={d.weight} onChange={(e) => setD({ ...d, weight: e.target.value })} />
        </Field>
        <Field label={`${t('onboarding.goalWeight')} (${weightUnit(units)})`} htmlFor="p-goalweight">
          <Input id="p-goalweight" inputMode="decimal" value={d.goalWeight} onChange={(e) => setD({ ...d, goalWeight: e.target.value })} />
        </Field>
        <Field label={t('onboarding.durationLabel')} htmlFor="p-duration">
          <Select id="p-duration" value={d.sessionMinutes} onChange={(e) => setD({ ...d, sessionMinutes: Number(e.target.value) })}>
            {[30, 45, 60, 75, 90].map((m) => <option key={m} value={m}>{t('common.minutes', { count: m })}</option>)}
          </Select>
        </Field>
      </div>

      <Field label={t('onboarding.goalLabel')}>
        <div className="flex flex-wrap gap-1.5">
          {GOALS.map((g) => <Chip key={g} active={d.goal === g} onClick={() => setD({ ...d, goal: g })}>{t(`goal.${g}`)}</Chip>)}
        </div>
      </Field>

      <Field label={t('onboarding.experienceLabel')}>
        <div className="flex flex-wrap gap-1.5">
          {LEVELS.map((l) => <Chip key={l} active={d.experience === l} onClick={() => setD({ ...d, experience: l })}>{t(`level.${l}`)}</Chip>)}
        </div>
      </Field>

      <Toggle
        id="p-returning"
        checked={d.returning}
        onChange={(v) => setD({ ...d, returning: v })}
        label={t('onboarding.returningLabel')}
      />

      <Field label={t('onboarding.placeLabel')}>
        <div className="flex flex-wrap gap-1.5">
          {PLACES.map((p) => <Chip key={p} active={d.place === p} onClick={() => setD({ ...d, place: p })}>{t(`place.${p}`)}</Chip>)}
        </div>
      </Field>

      <Field label={t('onboarding.equipmentLabel')}>
        <div className="flex flex-wrap gap-1.5">
          {EQUIPMENT.map((e) => (
            <Chip key={e} active={d.equipment.includes(e)} onClick={() => setD({ ...d, equipment: toggleIn<Equipment>(d.equipment, e) })}>
              {t(`equip.${e}`)}
            </Chip>
          ))}
        </div>
      </Field>

      <Field label={t('onboarding.daysLabel')}>
        <div className="flex flex-wrap gap-1.5">
          {[2, 3, 4, 5, 6].map((n) => <Chip key={n} active={d.daysPerWeek === n} onClick={() => setD({ ...d, daysPerWeek: n })}>{n}</Chip>)}
        </div>
      </Field>

      <Field label={t('onboarding.weekdaysLabel')}>
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 7 }, (_, i) => (
            <Chip key={i} active={d.weekdays.includes(i)} onClick={() => setD({ ...d, weekdays: toggleIn<number>(d.weekdays, i).sort((a, b) => a - b) })}>
              {t(`wd.${i}`)}
            </Chip>
          ))}
        </div>
      </Field>

      <Field label={t('onboarding.restrictionsLabel')} hint={t('onboarding.restrictionsHint')}>
        <div className="flex flex-wrap gap-1.5">
          {RESTRICTIONS.map((r) => (
            <Chip key={r} active={d.restrictions.includes(r)} onClick={() => setD({ ...d, restrictions: toggleIn<ContraindicationTag>(d.restrictions, r) })}>
              {t(`restriction.${r}`)}
            </Chip>
          ))}
        </div>
      </Field>

      <Button className="mt-2 w-full" onClick={() => void submit()}>{t('common.save')}</Button>
    </div>
  );
}

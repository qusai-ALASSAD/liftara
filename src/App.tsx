import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BottomNav } from '@/components/Layout';
import { useAppStore } from '@/store/appStore';
import { useSessionStore } from '@/store/sessionStore';
import { workoutRepo } from '@/db/repositories';
import OnboardingScreen from '@/screens/Onboarding';
import TodayScreen from '@/screens/Today';
import MusclesScreen from '@/screens/Muscles';
import ProgramsScreen from '@/screens/Programs';
import ProgressScreen from '@/screens/Progress';
import ProfileScreen from '@/screens/Profile';
import WorkoutScreen from '@/screens/Workout';
import SummaryScreen from '@/screens/Summary';
import ExerciseScreen from '@/screens/ExerciseDetail';
import LibraryScreen from '@/screens/Library';
import EducationScreen from '@/screens/Education';
import LegalScreen from '@/screens/Legal';

function Splash() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="h-12 w-12 animate-pulse rounded-2xl bg-royal-600" />
      <p className="text-sm muted">{t('common.loading')}</p>
    </div>
  );
}

function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="font-display text-2xl font-semibold">{t('errors.notFound')}</h1>
      <p className="mt-2 text-sm muted">{t('errors.notFoundText')}</p>
    </div>
  );
}

export default function App() {
  const ready = useAppStore((s) => s.ready);
  const profile = useAppStore((s) => s.profile);
  const resume = useSessionStore((s) => s.resume);
  const activeWorkout = useSessionStore((s) => s.workout);
  const location = useLocation();

  useEffect(() => {
    if (!ready || activeWorkout) return;
    void workoutRepo.active().then((w) => { if (w) resume(w); });
  }, [ready, activeWorkout, resume]);

  if (!ready) return <Splash />;

  const onboarding = location.pathname.startsWith('/onboarding');
  if (!profile?.onboardingComplete && !onboarding) return <Navigate to="/onboarding" replace />;
  if (profile?.onboardingComplete && onboarding) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/onboarding" element={<OnboardingScreen />} />
        <Route path="/" element={<TodayScreen />} />
        <Route path="/muscles" element={<MusclesScreen />} />
        <Route path="/library" element={<LibraryScreen />} />
        <Route path="/exercise/:id" element={<ExerciseScreen />} />
        <Route path="/programs" element={<ProgramsScreen />} />
        <Route path="/progress" element={<ProgressScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/education" element={<EducationScreen />} />
        <Route path="/legal/:page" element={<LegalScreen />} />
        <Route path="/workout" element={<WorkoutScreen />} />
        <Route path="/summary/:id" element={<SummaryScreen />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!onboarding && !location.pathname.startsWith('/workout') && <BottomNav />}
    </div>
  );
}

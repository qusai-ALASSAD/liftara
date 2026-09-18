# Ein Programm hinzufügen

Programme liegen in `src/content/programs.ts`.

```ts
P({
  id: 'kraft-ganzkoerper-3',
  name: { de: 'Kraft Ganzkörper – 3 Tage', en: 'Full Body Strength – 3 Days', ar: 'قوة الجسم كامل – 3 أيام' },
  description: {
    de: 'Drei Einheiten pro Woche mit niedrigen Wiederholungen und langen Pausen.',
    en: 'Three sessions per week with low reps and long rest periods.',
    ar: 'ثلاث حصص أسبوعياً بتكرارات منخفضة وراحات طويلة.'
  },
  level: ['intermediate', 'advanced'],
  daysPerWeek: 3,
  weeks: 8,
  place: 'gym',
  equipment: ['barbell', 'machine', 'bench'],
  premium: false,          // true blendet das Programm im Free-Tarif aus
  goal: 'strength',
  days: [
    {
      dayIndex: 0,
      workoutTitle: { de: 'Tag A', en: 'Day A', ar: 'اليوم أ' },
      focus: ['quads', 'chest', 'back'],
      exerciseIds: ['back-squat', 'bench-press-barbell', 'seated-row-cable', 'plank']
    }
    // weitere Tage …
  ]
})
```

**Wichtig**

- Jede ID in `exerciseIds` muss in `src/content/exercises.ts` existieren. Tippfehler fallen erst zur
  Laufzeit auf, deshalb nach dem Anlegen einmal die Programmvorschau öffnen.
- Sätze, Wiederholungsbereiche, Pausen und Startgewichte kommen **nicht** aus dem Programm, sondern aus
  `planFromExercises` in `src/lib/planGenerator.ts`. Sie richten sich nach Profil und Trainingshistorie.
- `premium: true` sperrt Start und Tagesstart im Free-Tarif automatisch und zeigt den Premium-Hinweis.
- Die Reihenfolge in `PROGRAMS` bestimmt die Reihenfolge in der Programmliste.

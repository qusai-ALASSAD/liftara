# Eine Übung hinzufügen

Alle Übungen liegen in `src/content/exercises.ts` als kompakte Zeilen. Eine Zeile reicht – Alternativen,
Grundübungs-Kennzeichnung und die Illustration werden automatisch abgeleitet.

## 1. Zeile ergänzen

```ts
[
  'cable-pullover',                 // id: eindeutig, klein geschrieben, mit Bindestrichen
  'Überzüge am Kabel',              // Name Deutsch
  'Cable Pullover',                 // Name Englisch
  'سحب علوي بالكيبل',                // Name Arabisch
  'verticalPull',                   // Bewegungsmuster (bestimmt Anleitung und Grafik)
  ['back'],                         // Zielmuskeln
  ['triceps', 'core'],              // Hilfsmuskeln
  ['cable'],                        // Equipment
  'beginner',                       // Schwierigkeit
  2.5,                              // kleinste sinnvolle Laststeigerung in kg (0 = Körpergewicht)
  ['shoulderPain'],                 // Kontraindikationen (leeres Array, wenn keine)
  'Arme fast gestreckt lassen.',    // Cue Deutsch
  'Keep the arms nearly straight.', // Cue Englisch
  'أبقِ الذراعين شبه ممدودتين.'      // Cue Arabisch
]
```

Optional folgt als 15. Eintrag `true` für unilaterale Übungen (eine Seite nach der anderen).

## 2. Erlaubte Werte

| Feld | Werte |
|---|---|
| Bewegungsmuster | `horizontalPress`, `inclinePress`, `verticalPress`, `horizontalPull`, `verticalPull`, `squat`, `hinge`, `lunge`, `curl`, `triceps`, `lateralRaise`, `rearDelt`, `calf`, `coreBrace`, `coreFlexion`, `hipAbduction`, `forearm`, `carryFullBody` |
| Muskelgruppen | `chest`, `back`, `shoulders`, `biceps`, `triceps`, `forearms`, `core`, `glutes`, `quads`, `hamstrings`, `calves`, `fullBody` |
| Equipment | `machine`, `cable`, `dumbbell`, `barbell`, `bodyweight`, `band`, `kettlebell`, `bench` |
| Schwierigkeit | `beginner`, `intermediate`, `advanced` |
| Kontraindikationen | `shoulderPain`, `lowerBackPain`, `kneePain`, `wristPain`, `elbowPain`, `neckPain`, `highImpact` |

## 3. Was automatisch passiert

- **Anleitung:** Aufbau, Ausführung, Atmung, typische Fehler und Sicherheit stammen aus der Vorlage des
  Bewegungsmusters in `src/content/instructions.ts`. Dein Cue wird als letzter Ausführungsschritt angehängt.
- **Illustration:** `src/components/ExerciseArt.tsx` wählt anhand des Bewegungsmusters eine Pose.
- **Alternativen:** gleicher Primärmuskel, bevorzugt anderes Equipment.
- **Grundübung:** ergibt sich aus dem Bewegungsmuster.

## 4. Prüfen

```bash
npm run typecheck
npm test
```

Die neue Übung erscheint danach automatisch in der Übungsdatenbank, in der Muskelkarte und – wenn sie
zu Equipment, Erfahrung und Einschränkungen passt – im Plan-Generator.

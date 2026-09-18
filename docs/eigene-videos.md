# Eigene Übungsvideos einbinden

Im MVP zeigt LIFTARA eigene schematische SVG-Zeichnungen. Der Wechsel auf echte Videos ist vorbereitet.

## Datenmodell

Jede Übung trägt bereits ein Medienfeld:

```ts
media: { type: 'svg' | 'video'; ref: string }
```

Aktuell wird `type: 'svg'` gesetzt und `ref` auf das Bewegungsmuster.

## Schritte

1. **Dateien ablegen:** Videos nach `public/media/exercises/<id>.mp4` legen (kurz, tonlos, als Schleife
   gedacht). Für Offline-Nutzung in `vite.config.ts` im `workbox`-Abschnitt ein Caching-Muster für
   `media/` ergänzen.
2. **Ableitung anpassen:** In `src/content/exercises.ts` in der Funktion `build()` das Medienobjekt setzen:
   ```ts
   media: { type: 'video', ref: `/media/exercises/${id}.mp4` }
   ```
   Alternativ nur für Übungen, für die tatsächlich ein Video existiert, und sonst weiter auf SVG zurückfallen.
3. **Darstellung erweitern:** In `src/components/ExerciseInfo.tsx` prüft `ExerciseIllustration` das Feld
   `media.type` und rendert entweder weiterhin `ExerciseArt` oder ein `<video muted loop playsinline>`
   mit `aria-label={t('exercise.mediaAlt')}`.
4. **Reduzierte Bewegung respektieren:** Bei `prefers-reduced-motion` das Video nicht automatisch
   abspielen, sondern ein Standbild mit Abspiel-Schaltfläche zeigen.

Alle übrigen Stellen – Übungsdatenbank, Detailseite, laufendes Training – nutzen dieselbe Komponente und
müssen nicht angefasst werden.

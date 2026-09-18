# Übersetzungen pflegen und eine Sprache ergänzen

## Bestehenden Text ändern

Alle Oberflächentexte stehen in `src/i18n/locales/de.json`, `en.json` und `ar.json`.
Die drei Dateien müssen **denselben Schlüsselstand** haben – ein Test in `src/test/policy.test.ts`
prüft das bei jedem Lauf.

Regel: Kein Text gehört fest in eine Komponente. Wenn du in JSX einen Satz schreibst, gehört er
stattdessen als Schlüssel in die drei JSON-Dateien und wird mit `t('bereich.schluessel')` geladen.

Platzhalter funktionieren so:

```json
"toGoal": "{{value}} {{unit}} bis zum Ziel"
```

```tsx
t('today.toGoal', { value: 4.5, unit: 'kg' })
```

Für Mehrzahlformen legst du `_one` und `_other` an:

```json
"minutes_one": "{{count}} Minute",
"minutes_other": "{{count}} Minuten"
```

## Inhaltliche Texte

Übungsnamen, Cues, Muskelbeschreibungen, Programme und Wissensartikel liegen nicht in den JSON-Dateien,
sondern direkt beim Inhalt in `src/content/` als Objekt `{ de, en, ar }`.

## Eine vierte Sprache ergänzen

1. `src/types/index.ts`: Sprache zu `Locale` und `LOCALES` hinzufügen.
2. Neue Datei `src/i18n/locales/<code>.json` als Kopie von `en.json` anlegen und übersetzen.
3. `src/i18n/index.ts`: Datei importieren, in `resources` eintragen und – falls die Sprache von rechts
   nach links läuft – in `RTL_LOCALES` aufnehmen.
4. Alle `LocalizedText`-Objekte in `src/content/` um den neuen Schlüssel erweitern. TypeScript zeigt
   jede fehlende Stelle an: `npm run typecheck`.
5. `npm test` ausführen – der Paritätstest deckt vergessene Schlüssel auf.

Der Fallback bleibt immer Englisch: Fehlt ein Schlüssel, zeigt die App den englischen Text statt einer
leeren Stelle.

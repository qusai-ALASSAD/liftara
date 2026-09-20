# Lizenzprüfung der Medienquellen

Stand: Phase 2 des LIFTARA-Medienimports.

## Übernommen: free-exercise-db

| | |
|---|---|
| Quelle | https://github.com/yuhonas/free-exercise-db |
| Lizenz | Unlicense (Public Domain) |
| Lizenztext | https://github.com/yuhonas/free-exercise-db/blob/main/LICENSE.md |
| Umfang | 876 Übungen mit JSON-Metadaten und je zwei Fotos (Start-/Endposition) |
| Kommerzielle Nutzung | ausdrücklich erlaubt |
| Lokale Speicherung und Weitergabe | ausdrücklich erlaubt |
| Namensnennung | nicht gefordert – LIFTARA nennt die Quelle trotzdem in der Oberfläche |

Der Lizenztext lautet wörtlich, dass jede Person die Inhalte kopieren, verändern, veröffentlichen,
nutzen und verkaufen darf, zu jedem Zweck, kommerziell wie nicht kommerziell.

**Offene Frage zur Herkunft:** Das Repository stellt die Daten als Public Domain bereit und geht auf
`wrkout/exercises.json` zurück. Wer die ursprünglichen Fotos aufgenommen hat, ist dort nicht
dokumentiert. Die Freigabe stammt also vom Betreiber des Datensatzes, nicht von einem benannten
Fotografen. Für ein Hobby- oder Portfolioprojekt ist das üblich und vertretbar; vor einer kommerziellen
Veröffentlichung im App Store sollte ein Anwalt kurz darauf schauen oder das Bildmaterial gegen eigene
Aufnahmen getauscht werden. Der Austausch kostet wenig Aufwand, weil nur `mediaManifest.json` und die
Dateien unter `public/media/exercises/` betroffen sind.

## Geprüft und bewusst NICHT übernommen: ExerciseDB / AscendAPI

| | |
|---|---|
| Quelle | https://exercisedb.dev bzw. https://oss.exercisedb.dev |
| Ergebnis der Prüfung | **nicht nutzbar** |

Der frei zugängliche V1-Datensatz ist laut eigener Dokumentation ausdrücklich auf nicht kommerzielle
Nutzung beschränkt und verlangt Namensnennung. Damit ist die Bedingung „eindeutig erlaubte kommerzielle
Nutzung, lokale Zwischenspeicherung und Weitergabe innerhalb der PWA" nicht erfüllt, also wurden weder
GIFs noch Videos heruntergeladen.

Die Lizenz `AGPL-3.0` im Repository `ExerciseDB/exercisedb-api` betrifft nur die API-Software, nicht das
Bildmaterial. Für die kostenpflichtigen Pro-Pakete werden kommerzielle Rechte angeboten
(Einmalzahlung, GIFs in 180p bis 1080p). Das ist eine Kaufentscheidung, keine technische Frage – sobald
ein solches Paket lizenziert ist, lässt sich das Manifestfeld `executionVideo` befüllen; die
Videowiedergabe in der App ist bereits implementiert.

## Nicht verwendet

Lyfta, MuscleWiki, YouTube, Instagram und Google Images wurden weder aufgerufen noch ausgelesen.
Es wurden keine Zugangsbeschränkungen umgangen und keine Vorschaubilder mit Wasserzeichen kopiert.

## Schriften

Sora, Manrope und Noto Sans Arabic stehen unter der SIL Open Font License 1.1 und sind über
`@fontsource` lokal gebündelt.

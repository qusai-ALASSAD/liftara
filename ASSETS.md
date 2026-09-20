# Bildmaterial und Lizenzen

Alle visuellen Assets in LIFTARA sind **eigens für dieses Projekt erstellt** und liegen als Vektorgrafik
(SVG) direkt im Quellcode. Es werden keine fremden Bilder geladen, nichts wird von externen Servern
nachgeladen, und die App funktioniert deshalb vollständig offline.

| Asset | Datei | Umfang | Lizenz |
|---|---|---|---|
| Anatomische Körperkarte (Vorder- und Rückansicht) | `src/content/anatomy.ts`, `src/components/AnatomyMap.tsx` | 9 Regionen vorn, 9 hinten, mit Faserzeichnung | Eigenerstellung, Teil dieses Projekts |
| Geräte- und Aufbau-Illustrationen | `src/components/EquipmentArt.tsx` | 36 Varianten (Bänke, Maschinen, Kabelzüge, Freihantel, Kettlebell, Band, Matte …) | Eigenerstellung, Teil dieses Projekts |
| Ausführungs-Illustrationen | `src/components/ExerciseArt.tsx` | 13 Posen, aus 18 Bewegungsmustern abgeleitet | Eigenerstellung, Teil dieses Projekts |
| App-Icons, Favicon | `public/icons/*`, `public/favicon.svg` | 192 px, 512 px, maskable | Eigenerstellung, Teil dieses Projekts |

## Importierte Übungsfotos

| | |
|---|---|
| Quelle | [free-exercise-db](https://github.com/yuhonas/free-exercise-db) |
| Lizenz | [Unlicense (Public Domain)](https://github.com/yuhonas/free-exercise-db/blob/main/LICENSE.md) |
| Umfang | 154 Fotos (Start- und Endposition) für 77 der 85 Übungen |
| Ablage | `public/media/exercises/<übungs-id>/{start,finish}.webp` + `source.json` |
| Format | WebP, maximal 1200 px Kantenlänge, jede Datei unter 180 kB |
| Namensnennung | nicht gefordert; LIFTARA zeigt die Quelle trotzdem unter den Medien-Reitern |

Jeder Import legt neben den Bildern eine `source.json` mit Quell-ID, Quellname, Equipment, Zielmuskeln,
Trefferart, Konfidenz, Prüfvermerken, Dateigrößen und Prüfsummen an. Der vollständige Bericht liegt unter
`media-reports/`. Die Lizenzprüfung aller geprüften Quellen – auch der abgelehnten – steht in
[`media-reports/licensing-notes.md`](./media-reports/licensing-notes.md).

Für die eigenen Zeichnungen sind **keine Namensnennungen Dritter erforderlich**.

## Schriften

| Schrift | Paket | Lizenz |
|---|---|---|
| Sora (Überschriften) | `@fontsource/sora` | SIL Open Font License 1.1 |
| Manrope (Fließtext) | `@fontsource/manrope` | SIL Open Font License 1.1 |
| Noto Sans Arabic (Arabisch) | `@fontsource-variable/noto-sans-arabic` | SIL Open Font License 1.1 |

Die Schriftdateien werden mit dem Build gebündelt und vom Service Worker vorgehalten. Die Lizenztexte
liegen in `node_modules/@fontsource*/LICENSE` und müssen bei einer Weitergabe des Builds mitgeliefert
werden (OFL verlangt die Weitergabe des Lizenztextes, keine Nennung in der Oberfläche).

## Selbst erzeugte Medien je Übung

Zusätzlich zu den importierten Fotos erzeugt `npm run media:generate` für **alle 85 Übungen**:

| Datei | Inhalt | Herkunft |
|---|---|---|
| `muscles.webp` | Zielmuskel-Darstellung: Zielmuskel orange, Hilfsmuskeln hellorange, übrige Muskulatur grau | eigene Körperkarte |
| `equipment.webp` | Gerät bzw. Aufbau der Übung | eigene Gerätezeichnung |
| `start.webp` / `finish.webp` | für die acht Übungen ohne frei lizenziertes Foto: eigene Posengrafik | eigene Figurzeichnung |
| `execution.webm` | Lehrschleife Start → Ende → Start, VP9, ohne Ton, mit eingeblendeten Phasen | aus Start- und Endbild erzeugt |

Die Lehrschleife ist ausdrücklich **keine Filmaufnahme**: sie blendet zwischen der korrekten Start- und
Endposition um und beschriftet beide Phasen. In der Oberfläche steht die Phasenbezeichnung zusätzlich
übersetzt daneben.

## Noch offen: echte Bewegungsvideos

Echte Filmaufnahmen der Übungen gibt es weiterhin nicht: keine der geprüften Quellen erlaubt
kommerzielle Nutzung, lokale Speicherung und Weitergabe eindeutig (siehe
[`media-reports/licensing-notes.md`](./media-reports/licensing-notes.md)). Bis dahin läuft die eigene
Lehrschleife. Sobald lizenziertes Videomaterial vorliegt, genügt es,

1. die Datei als `execution.webm` nach `public/media/exercises/<id>/` zu legen,
2. `executionKind` im Manifest auf `recorded` zu setzen (`npm run media:reindex` füllt die Pfade),
3. die Quelle hier und in `media-reports/licensing-notes.md` zu ergänzen.

Oberfläche, Caching, Lazy Loading und Videowiedergabe sind dafür fertig.

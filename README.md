# LIFTARA

**Trainiere smart. Werde stärker.**
EN: *Train Smart. Grow Strong.* · AR: *تمرّن بذكاء. كن أقوى.*

LIFTARA ist ein dreisprachiger (Deutsch / Englisch / Arabisch) Gym-Begleiter als **Progressive Web App**.
Die App sagt dir, was du heute trainieren sollst, zeigt jede Übung mit sauberer Ausführung, protokolliert
jeden Satz und steigert die Last nach nachvollziehbaren Regeln – vollständig **offline-first** und ohne
Server, Konto oder Cloud.

---

## Inhalt

1. [Überblick](#überblick)
2. [Funktionen](#funktionen)
3. [Architektur](#architektur)
4. [Ordnerstruktur](#ordnerstruktur)
5. [Einrichtung](#einrichtung)
6. [Befehle](#befehle)
7. [Tests](#tests)
8. [Build & Deployment](#build--deployment)
9. [PWA-Installation](#pwa-installation)
10. [Demo-Profil](#demo-profil)
11. [Free und Premium umschalten](#free-und-premium-umschalten)
12. [Mock-Werbung ersetzen](#mock-werbung-ersetzen)
13. [Übungen, Übersetzungen und Programme ergänzen](#übungen-übersetzungen-und-programme-ergänzen)
14. [Bekannte Grenzen des MVP](#bekannte-grenzen-des-mvp)
15. [Datenschutz](#datenschutz)
16. [Roadmap v2](#roadmap-v2)

---

## Überblick

| Eigenschaft | Umsetzung |
|---|---|
| Plattform | Web / PWA, installierbar auf iOS, Android und Desktop |
| Sprachen | Deutsch, Englisch, Arabisch – inklusive vollständigem RTL-Layout |
| Speicherung | IndexedDB (Dexie) auf dem Gerät, Einstellungen in `localStorage` |
| Netzwerk | Kein Backend, keine KI-Dienste, keine kostenpflichtigen APIs |
| Geschäftsmodell | Dauerhaft kostenlose, werbefinanzierte Version + optionales Premium |
| Zielgruppe | Einsteiger, Wiedereinsteiger nach längerer Pause, Fortgeschrittene |

Die App ist bewusst so gebaut, dass eine spätere Cloud-Synchronisation oder ein Capacitor-Wrapper
ohne Umbau der Fachlogik möglich ist: Datenzugriffe laufen ausschließlich über Repository-Schnittstellen.

---

## Funktionen

### Onboarding
Mehrstufiger Einstieg mit Name, Alter, Geschlecht, Körpergröße, Gewicht, Zielgewicht, Einheiten
(metrisch/imperial), Ziel, Erfahrungsstand, Wiedereinstieg nach Pause, Trainingsort, verfügbarem
Equipment, Trainingstagen, Wunschdauer, Einschränkungen und Datenschutz-Einwilligung.
Ein Klick genügt für das vorgefertigte **Demo-Profil**.

### Heute
Begrüßung, Fortschritt zum Zielgewicht, Wochenziel, Streak, Erholungsstatus je Muskelgruppe,
Wochenkalender, Tagesempfehlung mit Begründung („Warum dieser Plan?“), Start- bzw. Fortsetzen-Button,
Offline-Hinweis und PWA-Installationsaufforderung.

### Training
Fünf bis acht Übungen pro Einheit, vollständige Übungsinfos (Aufbau, Ausführung, Atmung, typische Fehler,
Sicherheit), Satzprotokoll mit Gewicht, Wiederholungen und RIR, Pausentimer, Aufwärmsätze, Übungen
ersetzen oder überspringen, Notizen je Übung, Fortsetzen nach App-Neustart, Bestätigungsdialog für
vorgeschlagene Gewichtssteigerungen.

### Zusammenfassung
Dauer, abgeschlossene Sätze, Gesamtvolumen, trainierte Muskelgruppen, geschätzter Kalorienverbrauch,
neue persönliche Rekorde, Feedback zur Intensität, Notizen, teilbarer Text und ein sicherer Werbeplatz,
der das Training niemals unterbricht.

### Übungsdatenbank
85 Übungen über 12 Muskelgruppen, dreisprachig, mit Equipment, Schwierigkeit, Bewegungsmuster,
Kontraindikationen, Alternativen und eigenen schematischen SVG-Illustrationen.

### Muskelkarte
Eigene, stilisierte Körperdarstellung (Vorder- und Rückseite). Ein Klick auf eine Region zeigt Funktion
und passende Übungen. Vollständig per Tastatur bedienbar.

### Programme
Acht Programme (Wiedereinstieg, Einsteiger-Muskelaufbau, Ganzkörper 2 Tage, Ober-/Unterkörper 4 Tage,
Push/Pull/Legs 6 Tage als Premium, Heimtraining, Kraftgrundlagen, Zielgewicht-Reise) mit Vorschau,
Start, Pause, Fortsetzen, Neustart, änderbaren Trainingstagen und einer anpassbaren Kopie.

### Fortschritt
Monatskalender, Körpergewichtsverlauf, Volumenverlauf, Leistung je Übung mit geschätztem 1RM
(Epley-Formel), Sätze je Muskelgruppe, persönliche Rekorde, Erfolge, lokale Fortschrittsfotos,
CSV-Export, vollständiger JSON-Export, Import und Komplettlöschung.

### Wissen
Neun Einsteigerthemen (Startgewicht, Sätze und Wiederholungen, Pausen, RIR, progressive Überlastung,
Aufwärmen, Gym-Etikette, Wiedereinstieg, Muskelkater vs. Schmerz) plus medizinischer Hinweis.

---

## Design und Bildmaterial

**Visuelle Identität:** Weiß und ein sehr helles Grau (`#F7F8FA`) als Fläche, kräftiges Orange
(`#FF6B00`, dunkel `#E95600`) als einzige Aktionsfarbe, Graphit (`#18202A` / `#667085`) für Text,
Grün (`#16A34A`) für Erfolg. Der Dunkelmodus ist in Graphit gehalten, nicht in Marineblau.
Die Farben liegen als CSS-Variablen in `src/index.css` und als Tailwind-Palette in `tailwind.config.js`.

**Bildebenen:** Jede Übung hat drei Darstellungen – die Ausführung, die Zielmuskeln und das Gerät.
Die Zielmuskel-Grafik wird aus der anatomischen Körperkarte erzeugt und ist deshalb immer korrekt,
auch für später ergänzte Übungen. Ein Test stellt sicher, dass jede der 85 Übungen ausdrücklich ein
Gerätebild zugeordnet bekommt. Details und Lizenzen: [`ASSETS.md`](./ASSETS.md).

**Layout:** mobil zuerst, getestet ab 360 px Breite. Ab Tablet wird der Inhalt zentriert und in der
Breite begrenzt, ab 1024 px ersetzt eine seitliche Navigation die Tab-Leiste. Bedienflächen sind
mindestens 44 px hoch, im laufenden Training deutlich größer.

**Arabisch:** vollständiges RTL über logische CSS-Eigenschaften (`start`/`end`, `ps`/`pe`) – im Quelltext
kommt keine einzige feste Links-/Rechts-Angabe vor. Fotos und anatomische Darstellungen werden nicht
gespiegelt. Arabisch nutzt alle sechs Pluralformen (`_zero`, `_one`, `_two`, `_few`, `_many`, `_other`),
Deutsch und Englisch je zwei; ein Test prüft beides.

## Übungsfotos importieren

Die Fotos stammen aus dem gemeinfreien Datensatz [free-exercise-db](https://github.com/yuhonas/free-exercise-db)
und werden vollautomatisch zugeordnet, konvertiert und dokumentiert:

```bash
npm run media:import            # klont den Datensatz und importiert alles
npm run media:import -- --dry-run   # nur rechnen, nichts schreiben
```

Der Lauf ordnet jede LIFTARA-Übung über Name, Equipment, Zielmuskel und Bewegungsmuster zu, akzeptiert
automatisch erst ab einer Konfidenz von 0,72, prüft zusätzlich Zielmuskel und Equipment und schreibt
alles Unsichere in `media-reports/unmatched-report.json`, statt eine falsche Übung stillschweigend zu
übernehmen. Für abweichende Bezeichnungen gibt es im Skript eine handgeprüfte Override-Tabelle.

Ergebnis:

```
public/media/exercises/<übungs-id>/start.webp
                                  /finish.webp
                                  /source.json     Quelle, Lizenz, Konfidenz, Prüfsummen
src/content/mediaManifest.json                     Zuordnung für die App
media-reports/unmatched-report.json                offene Fälle mit Begründung
media-reports/import-stats.json                    Zahlen des letzten Laufs
```

Für die acht Übungen ohne passende Fremdquelle erzeugt die Pipeline eigene anatomische Posengrafiken –
keine Übung bleibt ohne Bild.
Details zu Lizenzen: [`ASSETS.md`](./ASSETS.md) und [`media-reports/licensing-notes.md`](./media-reports/licensing-notes.md).

### Restliche Medien erzeugen

```bash
npm run media:generate    # Zielmuskel-, Geräte- und Posenbilder sowie Lehrschleifen
npm run media:reindex     # Manifest nach einem abgebrochenen Lauf mit der Platte abgleichen
npm run screenshots       # Bildschirmfotos der Hauptansichten nach screenshots/
```

Damit hat jede der 85 Übungen `start.webp`, `finish.webp`, `equipment.webp`, `muscles.webp`,
`execution.webm` und `source.json`. Die Lehrschleife blendet zwischen korrekter Start- und Endposition
um, beschriftet beide Phasen und enthält keine Tonspur.

**Offline und Ladezeit:** Fotos und Videos werden bewusst **nicht** beim ersten Start vorgeladen. Der
Service Worker hält nur die Oberfläche vor; Übungsbilder landen beim ersten Anzeigen im Cache
(`CacheFirst`, 180 Tage) und sind danach offline verfügbar. Bilder werden lazy geladen, Videos erst
abgespielt, wenn sie sichtbar sind – stumm, in Schleife, mit `playsInline` und Standbild.

## Architektur

```
UI (React-Screens)
   │  liest/schreibt
Zustand-Stores  ──  appStore (Profil, Einstellungen, Daten)
   │                sessionStore (laufendes Training)
   │
Fachlogik (src/lib)  planGenerator · progression · stats · recovery · premium · ads · exportImport
   │
Repositories (src/db/repositories.ts)  ← austauschbare Schnittstelle
   │
Dexie / IndexedDB
```

**Bewusste Entscheidungen**

- **Repository-Schicht statt direkter Dexie-Zugriffe im UI.** Ein späterer Cloud-Sync ersetzt nur die
  Implementierung, nicht die Aufrufe.
- **Deterministischer Plan-Generator.** Gleiche Eingaben ergeben denselben Plan – ohne Zufall und ohne KI.
  Jede Entscheidung wird als i18n-Key begründet und ist damit in allen drei Sprachen erklärbar.
- **Anleitungen aus Bewegungsmuster-Vorlagen + übungsspezifischem Cue.** So bleiben 85 Übungen in drei
  Sprachen pflegbar, statt 255 Volltexte zu duplizieren.
- **Progression schlägt vor, ändert aber nie Protokolliertes.** Jede Steigerung und jedes Deload braucht
  eine ausdrückliche Bestätigung.
- **Werbung hinter einer Abstraktion.** `AdProvider` kennt Mock, Web (AdSense-Platzhalter) und Native
  (AdMob-Platzhalter). Eine zentrale Regel (`decideAd`) entscheidet, ob überhaupt Werbung erlaubt ist.
- **Keine harten UI-Texte.** Alle Strings liegen in `src/i18n/locales/*.json`, alle drei Dateien haben
  denselben Schlüsselstand (per Test abgesichert).
- **Logische CSS-Eigenschaften** (`start`/`end` statt `left`/`right`) für echtes RTL ohne Sonderfälle.

---

## Ordnerstruktur

```
liftara/
├─ public/                 Favicon, PWA-Icons
├─ docs/                   Anleitungen zum Erweitern
├─ src/
│  ├─ components/          UI-Bausteine, Layout, Muskelkarte, Übungsgrafik, Werbeplätze
│  │  └─ ui/               Button, Card, Chip, Dialog, Input, Toggle, …
│  ├─ content/             Übungen, Muskeln, Programme, Anleitungen, Wissen, Demo-Profil
│  ├─ db/                  Dexie-Schema und Repositories
│  ├─ i18n/                i18next-Setup und Sprachdateien (de/en/ar)
│  ├─ lib/                 Fachlogik: Plan, Progression, Statistik, Einheiten, Werbung, Export
│  ├─ screens/             Onboarding, Today, Workout, Summary, Muscles, Library,
│  │                       ExerciseDetail, Programs, Progress, Profile, Education, Legal
│  ├─ store/               Zustand-Stores
│  ├─ test/                Vitest-Setup und Testsuiten
│  ├─ types/               Zentrale Typen und Schemata
│  ├─ App.tsx              Routing
│  ├─ main.tsx             Einstiegspunkt, Service-Worker-Registrierung
│  └─ index.css            Design-Tokens, Light/Dark, Basis-Styles
├─ index.html
├─ tailwind.config.js
└─ vite.config.ts          Vite, PWA-Manifest, Vitest
```

---

## Einrichtung

Voraussetzung: **Node.js 18 oder neuer** (getestet mit Node 22) und npm.

```bash
npm install
npm run dev
```

Die App läuft anschließend unter `http://localhost:5173`.

---

## Befehle

| Befehl | Wirkung |
|---|---|
| `npm run dev` | Entwicklungsserver mit Hot Reload |
| `npm run build` | Typprüfung und Produktions-Build nach `dist/` |
| `npm run preview` | Lokale Vorschau des Produktions-Builds (inkl. Service Worker) |
| `npm test` | Alle Tests einmalig ausführen |
| `npm run test:watch` | Tests im Watch-Modus |
| `npm run typecheck` | Nur TypeScript prüfen |
| `npm run build:preview` | Einzelne HTML-Datei zum Anschauen und Teilen nach `dist-preview/` |
| `npm run media:import` | Übungsfotos aus free-exercise-db importieren und optimieren |

---

## Tests

`npm test` führt 79 Tests in sechs Dateien aus:

| Datei | Abgedeckte Bereiche |
|---|---|
| `planGenerator.test.ts` | Planerzeugung, Determinismus, Equipment- und Einschränkungsfilter, Begründungen, Regeln für den Wiedereinstieg nach Pause |
| `progression.test.ts` | Doppelte Progression (Steigern, Halten, Deload), Streak-Berechnung, Volumen und Sätze, 1RM-Schätzung, Rekorde, Zielgewicht-Fortschritt |
| `policy.test.ts` | Free vs. Premium, Rewarded-Freischaltung, Werbe-Häufigkeitsgrenze, Schutz des laufenden Trainings, keine personalisierte Werbung für Minderjährige, Sprachparität und Fallback auf Englisch |
| `workout.test.ts` | Training abschließen, Rekorde und Erfolge, Übungstausch, Export-Import-Rundlauf, CSV |
| `render.test.tsx` | Startseite rendert in DE, EN und AR; `dir`-Attribut wechselt korrekt auf `rtl` |
| `media.test.ts` | Jede der 85 Übungen hat ein zugeordnetes Gerätebild und eine Zielmuskel-Ansicht, alle anatomischen Regionen sind in DE, EN und AR beschriftet; jede Übung hat eine geprüfte Foto-Zuordnung oder steht im Unmatched-Report; keine kaputten Pfade, echte WebP-Dateien unter 180 kB, Lizenzangabe je Asset, keine Mehrfachzuordnung über zwei Übungen hinaus, Zielmuskel-Abgleich |

---

## Build & Deployment

```bash
npm run build
npm run preview
```

`dist/` ist eine rein statische Auslieferung und funktioniert auf jedem Static-Host
(Netlify, Vercel, Cloudflare Pages, nginx, Apache). Wichtig ist nur ein **SPA-Fallback**:
alle Pfade müssen auf `index.html` zeigen.

---

## PWA-Installation

- **Android / Chrome:** Beim Besuch erscheint der Installationshinweis in der App; alternativ
  Browsermenü → „App installieren“.
- **iOS / Safari:** Teilen-Symbol → „Zum Home-Bildschirm“.
- **Desktop:** Installationssymbol in der Adressleiste.

Nach der Installation funktioniert die App vollständig offline: Übungen, Trainingsprotokoll,
Muskelkarte und Fortschritt sind ohne Verbindung verfügbar. Die Service-Worker-Registrierung ist
absichtlich nur im Produktions-Build aktiv.

---

## Demo-Profil

Im ersten Onboarding-Schritt lässt sich das Demo-Profil auswählen:

| Feld | Wert |
|---|---|
| Name | Qusai |
| Größe | 174 cm |
| Gewicht | 62 kg |
| Zielgewicht | 71 kg |
| Ziel | Muskelaufbau |
| Erfahrung | Wiedereinstieg nach längerer Pause |
| Trainingstage | 4 pro Woche (Mo, Mi, Fr, Sa) |
| Einheit | 60 Minuten, Gym mit Maschinen, Kabelzug, Kurz- und Langhantel |

Das Profil lässt sich danach unter *Profil → Profil bearbeiten* jederzeit anpassen.

---

## Free und Premium umschalten

Im MVP gibt es bewusst **keine Bezahlung**. Premium wird lokal geschaltet:

> **Profil → Dein Tarif → „Premium aktivieren“ bzw. „Zurück zu Free“**

Unterschiede:

| | Free | Premium |
|---|---|---|
| Training protokollieren, Übungsdatenbank, Muskelkarte, Basis-Fortschritt | ✅ | ✅ |
| Einsteigerprogramme | ✅ | ✅ |
| Werbung | Banner + Interstitial nach jedem zweiten Training | keine |
| Erweiterte Auswertung (Leistung je Übung) | über Rewarded Ad 24 Stunden freischaltbar | dauerhaft |
| Eigene Programme | 1 | unbegrenzt |
| Premium-Programme (z. B. Push/Pull/Legs 6 Tage) | gesperrt | ✅ |

Die Zugriffsregeln liegen zentral in `src/lib/premium.ts` (`hasFeature`, `canCreateCustomProgram`)
und sind getestet.

---

## Mock-Werbung ersetzen

Alle Werbeplätze laufen über die Abstraktion in `src/lib/ads/providers.ts`:

```ts
export interface AdProvider {
  readonly id: string;
  isReady(): boolean;
  show(req: AdRequest): Promise<AdResult>;
}
```

Enthalten sind drei Implementierungen – **ohne echte Werbe-IDs**:

- `MockAdProvider` – Standard in Entwicklung und Demo
- `WebAdProvider` – Platzhalter für Google AdSense
- `NativeAdProvider` – Platzhalter für AdMob über Capacitor

**Schritte zum Scharfschalten**

1. Im gewünschten Provider die markierten Platzhalter durch die echte SDK-Initialisierung und
   deine Werbe-IDs ersetzen.
2. Beim Build die Umgebungsvariable setzen, zum Beispiel in `.env.production`:
   ```
   VITE_AD_PROVIDER=web
   ```
3. Die Anzeigeregeln bleiben unverändert in `src/lib/ads/policy.ts`. Unveränderlich gilt:
   - niemals Werbung während eines laufenden Satzes, Pausentimers oder Sicherheitshinweises,
   - Interstitial höchstens nach jedem zweiten abgeschlossenen Training,
   - ohne Einwilligung keine Werbung,
   - für Nutzer unter 18 Jahren niemals personalisierte Werbung.

---

## Übungen, Übersetzungen und Programme ergänzen

Ausführliche Anleitungen liegen in [`docs/`](./docs):

- [`docs/uebung-hinzufuegen.md`](./docs/uebung-hinzufuegen.md)
- [`docs/uebersetzung-hinzufuegen.md`](./docs/uebersetzung-hinzufuegen.md)
- [`docs/programm-hinzufuegen.md`](./docs/programm-hinzufuegen.md)
- [`docs/eigene-videos.md`](./docs/eigene-videos.md)

Kurzfassung für eine neue Übung: eine Zeile in `src/content/exercises.ts` mit ID, Namen in DE/EN/AR,
Bewegungsmuster, Ziel- und Hilfsmuskeln, Equipment, Schwierigkeit, Laststufe, Kontraindikationen und
einem Cue je Sprache. Alternativen und Illustration werden automatisch abgeleitet.

---

## Bekannte Grenzen des MVP

- Kein Backend, kein Konto, keine Synchronisation zwischen Geräten.
- Premium ist ein lokaler Schalter ohne Bezahlvorgang.
- Werbung ist ein Mock ohne echte Netzwerke.
- Übungsdarstellungen sind eigene schematische SVGs, keine Videos.
- Kalorienverbrauch und 1RM sind ausdrücklich Schätzungen, keine Messwerte.
- Die Erholungsanzeige ist eine lineare Näherung über feste Zeitfenster je Muskelgruppe.
- Fortschrittsfotos bleiben lokal und werden nicht mit exportiert.
- Kein Streckenzähler, keine Wearable-Anbindung, keine Ernährungsfunktion.

---

## Datenschutz

- Profil, Trainings, Messwerte und Fotos liegen ausschließlich lokal im Browser des Geräts.
- Werbung und anonyme Statistik werden erst nach ausdrücklicher Einwilligung geladen; der Widerruf ist
  jederzeit über *Profil → Einwilligungen verwalten* oder die Datenschutzseite möglich.
- Personalisierte Werbung ist standardmäßig aus und wird für Nutzer unter 18 Jahren automatisch
  deaktiviert.
- Vollständiger Export (JSON) und vollständige Löschung sind in *Fortschritt → Deine Daten* verfügbar.
- Medizinischer Hinweis: LIFTARA ersetzt keine ärztliche oder therapeutische Beratung.

---

## Roadmap v2

1. Optionale Cloud-Synchronisation und Konto mit Ende-zu-Ende-verschlüsseltem Backup.
2. Eigene Übungsvideos statt schematischer SVGs, inklusive Zeitlupe und mehrerer Kamerawinkel.
3. Capacitor-Builds für den App Store und Google Play mit nativer AdMob-Anbindung und echtem
   In-App-Kauf für Premium.
4. Eigener Programm-Baukasten mit Wochenplanung, Deload-Wochen und Periodisierung.
5. Wearable- und Health-Anbindung (Herzfrequenz, Schritte, Schlaf) für eine bessere Erholungsanzeige.
6. Trainingspartner-Modus: geteilte Programme, Vergleich von Rekorden, Gruppen-Challenges.
7. Automatische Erkennung von Plateaus mit konkreten Vorschlägen (Volumen, Übungswechsel, Deload).
8. Ernährungsmodul mit Kalorien- und Proteinziel passend zum Zielgewicht.
9. Weitere Sprachen (Türkisch, Französisch, Spanisch) über dieselbe i18n-Struktur.
10. Barrierefreiheit auf Stufe WCAG 2.2 AA prüfen und zertifizieren lassen.

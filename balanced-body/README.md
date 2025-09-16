# BalancedBody Coach — Schüler-MVP

Lauffähige, lokale React‑Webapp (kein Login, kein Backend). Daten bleiben im Browser (`localStorage`).

## Setup

1. Node 18+ empfohlen
2. Abhängigkeiten installieren:

```bash
npm install
```

3. Entwicklung starten:

```bash
npm run dev
```

### Schnellstart (exakte Pfade)

PowerShell/Terminal öffnen und nacheinander ausführen:

```powershell
cd C:\TBZ\Modul\m426\FitnessApp_M426\balanced-body
npm install
npm run dev
```

4. Produktion bauen / preview:

```bash
npm run build
npm run preview
```

## Ordnerstruktur

```
src/
  routes/        # Dashboard, Exercises, ExerciseDetail, Log, Progress
  components/    # Layout, ExerciseCard, FilterBar
  data/          # exercises.seed.json (ca. 30+ Übungen)
  lib/           # storage.ts, csv.ts, date.ts
  logic/         # balance.ts, planner.ts
  state/         # store.tsx (Context+Reducer), selectors.ts
  App.tsx, main.tsx, index.css
```

## Datenmodell

- Exercise: `{ id, name, primary[], secondary[], equipment[], difficulty, instructions }`
- LogEntry: `{ id, dateISO, exerciseId, sets[{reps,weightKg}], credits[{muscle,sets}] }`

## Persistenz (localStorage)

- `bb_exercises`: Seed‑Übungen (beim ersten Start geladen)
- `bb_logs`: Trainingslogs

## Features (MVP)

- Übungen filtern (Muskel/Equipment/Schwierigkeit) und Details anzeigen
- Logging: Sets/Reps/Weight; Datum automatisch
- Balance: wöchentliche Sätze pro Muskel (Primär +1, Sekundär +0.5)
- Charts: Recharts (Bar „Woche“, Line „6 Wochen“)
- CSV‑Export der Logs

## Tailwind CSS

Tailwind v4 via PostCSS Plugin `@tailwindcss/postcss`. Basisklassen sind in `src/index.css` importiert.

## Hinweise zur Erweiterung

- Auth/Backend können später ergänzt werden (APIs statt localStorage)
- PWA/Offline: Workbox/Service Worker hinzufügen
- Tests: React Testing Library/Jest optional

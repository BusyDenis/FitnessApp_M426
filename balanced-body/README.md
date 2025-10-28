# BalancedBody Coach — Fitness Tracking App

Moderne React‑Webapp mit Backend-Integration. Benutzer können sich registrieren, anmelden und ihre Trainingsdaten verwalten.

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

## Backend Integration

- **API**: Alle Daten werden im Backend gespeichert
- **Authentication**: Login/Registrierung mit Benutzername und Passwort
- **Übungen**: Werden aus der Datenbank geladen
- **Logs**: Pro Benutzer in der Datenbank gespeichert

### Backend Setup

Das Backend muss separat gestartet werden:

```bash
cd backend
npm install
npm run seed  # Übungen in DB laden
npm run dev   # Server starten (Port 3001)
```

Das Frontend erwartet das Backend standardmäßig auf `http://localhost:3001`. 
Dies kann über `.env` mit `VITE_API_URL` angepasst werden.

## Features (MVP)

- Übungen filtern (Muskel/Equipment/Schwierigkeit) und Details anzeigen
- Logging: Sets/Reps/Weight; Datum automatisch
- Balance: wöchentliche Sätze pro Muskel (Primär +1, Sekundär +0.5)
- Charts: Recharts (Bar „Woche“, Line „6 Wochen“)
- CSV‑Export der Logs

## Tailwind CSS

Tailwind v4 via PostCSS Plugin `@tailwindcss/postcss`. Basisklassen sind in `src/index.css` importiert.

## Features

- ✅ **Authentifizierung**: Registrierung und Login mit Benutzername/Passwort
- ✅ **Protected Routes**: Nur eingeloggte Benutzer können die App nutzen
- ✅ **Backend-Integration**: Alle Daten werden im Backend gespeichert
- ✅ **Modern UI**: Fitness-Themed Design mit Bildern
- ✅ **Responsive**: Funktioniert auf Desktop und Mobile

## Hinweise zur Erweiterung

- PWA/Offline: Workbox/Service Worker hinzufügen
- Tests: React Testing Library/Jest optional
- Production Deploy: Backend + Frontend zusammen deployen

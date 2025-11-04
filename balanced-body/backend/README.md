# BalancedBody Backend API

REST API Backend für die BalancedBody Fitness-App.

## Technologie-Stack

- **Node.js** + **Express** - HTTP Server
- **TypeScript** - Type Safety
- **SQLite** (better-sqlite3) - Datenbank
- **CORS** - Frontend-Integration

## Setup

### 1. Dependencies installieren

```bash
cd backend
npm install
```

### 2. Datenbank seeden (Initial-Übungen laden)

```bash
npm run seed
```

Dies lädt die Übungen aus `../src/data/exercises.seed.json` in die Datenbank.

### 3. Server starten

**Development (mit Hot Reload):**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm start
```

Der Server läuft standardmäßig auf `http://localhost:3001`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Neuen Benutzer registrieren
  - Body: `{ username: string, password: string }`
  - Returns: `{ user: { id, username }, token: string, expiresAt: string }`
- `POST /api/auth/login` - Benutzer anmelden
  - Body: `{ username: string, password: string }`
  - Returns: `{ user: { id, username }, token: string, expiresAt: string }`
- `POST /api/auth/logout` - Abmelden (requires auth token)
- `GET /api/auth/me` - Aktuellen Benutzer abrufen (requires auth token)

### Exercises

- `GET /api/exercises` - Alle Übungen (öffentlich)
- `GET /api/exercises/:id` - Übung nach ID (öffentlich)
- `POST /api/exercises` - Neue Übung erstellen (Admin)
- `PUT /api/exercises/:id` - Übung aktualisieren (Admin)
- `DELETE /api/exercises/:id` - Übung löschen (Admin)

### Logs (alle Endpoints erfordern Authentication)

- `GET /api/logs` - Alle Logs des eingeloggten Benutzers
  - Query Params: `?exerciseId=...` - Filter nach Übung
  - Query Params: `?startDate=...&endDate=...` - Filter nach Datum
- `GET /api/logs/:id` - Log nach ID (nur eigene Logs)
- `POST /api/logs` - Neuen Log erstellen
- `PUT /api/logs/:id` - Log aktualisieren (nur eigene Logs)
- `DELETE /api/logs/:id` - Log löschen (nur eigene Logs)

### Health Check

- `GET /api/health` - Server Status

## Datenbank

Die SQLite-Datenbank wird automatisch in `backend/data/balanced-body.db` erstellt.

### Schema

**exercises**
- id (TEXT PRIMARY KEY)
- name
- primary_muscles (JSON)
- secondary_muscles (JSON)
- equipment (JSON)
- difficulty (easy|med|hard)
- instructions
- created_at, updated_at

**logs**
- id (TEXT PRIMARY KEY)
- date_iso
- exercise_id (FOREIGN KEY)
- sets (JSON)
- credits (JSON)
- created_at

## Frontend-Integration

Im Frontend die `src/lib/storage.ts` ersetzen durch API-Calls:

```typescript
// Statt localStorage:
const exercises = await fetch('http://localhost:3001/api/exercises').then(r => r.json())
const logs = await fetch('http://localhost:3001/api/logs').then(r => r.json())
```

## Erweiterungsmöglichkeiten

- **Authentication**: JWT Tokens
- **Multi-User**: User-Tabelle + Foreign Keys
- **PostgreSQL**: Für Production-Skalierung
- **Validation**: Zod oder Joi
- **Rate Limiting**: express-rate-limit
- **Logging**: Winston oder Pino


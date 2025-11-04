# 🚀 BalancedBody - Startanleitung

## Quick Start (Frontend + Backend zusammen)

### ⚡ Option 1: Alles auf einmal (Empfohlen)

**Einmalige Installation:**
```bash
cd balanced-body
npm install
cd backend
npm install
cd ..
```

**Backend-Datenbank seeden (nur beim ersten Start):**
```bash
npm run seed
```

**Beide Server starten:**
```bash
npm run dev:all
```

✅ Das startet automatisch:
- Backend auf http://localhost:3001
- Frontend auf http://localhost:5173

### 🔧 Option 2: Separater Start (zwei Terminal-Fenster)

**Terminal 1 - Backend:**
```bash
cd balanced-body/backend
npm install          # Nur beim ersten Mal
npm run seed         # Nur beim ersten Mal oder nach DB-Reset
npm run dev          # Läuft auf http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd balanced-body
npm install          # Nur beim ersten Mal
npm run dev          # Läuft auf http://localhost:5173
```

### 📋 Option 3: Schritt für Schritt

**1. Dependencies installieren:**
```bash
cd balanced-body
npm run install:all
```

**2. Backend-Datenbank seeden (nur beim ersten Mal):**
```bash
npm run seed
```

**3. Alles starten:**
```bash
npm run dev:all
```

## URLs nach dem Start

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/api/health

## PowerShell (Windows) Quick Commands

```powershell
# In balanced-body Ordner navigieren
cd C:\TBZ\Modul\m426\FitnessApp_M426\balanced-body

# Alles installieren
npm install
cd backend
npm install
cd ..

# Datenbank seeden (nur beim ersten Mal)
npm run seed

# Beide Server starten
npm run dev:all
```

## Troubleshooting

### ❌ Backend startet nicht
- ✅ Prüfe ob Port 3001 frei ist
- ✅ Installiere Dependencies: `cd backend && npm install`
- ✅ Prüfe ob Node.js 18+ installiert ist

### ❌ Frontend startet nicht  
- ✅ Prüfe ob Port 5173 frei ist
- ✅ Installiere Dependencies: `npm install`
- ✅ Prüfe ob Node.js 18+ installiert ist

### ❌ API-Fehler im Frontend
- ✅ Stelle sicher, dass Backend läuft
- ✅ Öffne http://localhost:3001/api/health im Browser
- ✅ Prüfe Browser-Konsole auf CORS-Fehler

### ❌ Datenbank leer / Keine Übungen
- ✅ Führe aus: `npm run seed` im `balanced-body` Verzeichnis
- ✅ Oder: `cd backend && npm run seed`

### ❌ "concurrently" nicht gefunden
- ✅ Installiere es: `npm install --save-dev concurrently`
- ✅ Oder verwende Option 2 (separater Start)

## Nützliche Commands

```bash
# Nur Backend starten
npm run dev:backend

# Nur Frontend starten  
npm run dev:frontend

# Beide zusammen starten
npm run dev:all

# Backend seeden
npm run seed

# Build für Production
npm run build

# Preview Production Build
npm run preview
```

import Database from 'better-sqlite3'
import { existsSync, mkdirSync } from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Ensure data directory exists
const dataDir = `${__dirname}/../../data`
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true })
}

const dbPath = `${dataDir}/balanced-body.db`
export const db = new Database(dbPath)

// Enable foreign keys
db.pragma('foreign_keys = ON')

export function initDatabase() {
  // Check if logs table exists without user_id (old schema)
  try {
    const result = db.prepare("PRAGMA table_info(logs)").all() as Array<{ name: string }>
    const hasUserId = result.some((col) => col.name === 'user_id')
    
    if (!hasUserId && result.length > 0) {
      // Old schema detected - drop and recreate
      console.log('🔄 Migrating database schema...')
      db.exec('DROP TABLE IF EXISTS logs')
      db.exec('DROP TABLE IF EXISTS exercises')
      db.exec('DROP TABLE IF EXISTS users')
      db.exec('DROP TABLE IF EXISTS sessions')
    }
  } catch {
    // Table doesn't exist yet, that's fine
  }

  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)

  // Exercises table (global, seeded once)
  db.exec(`
    CREATE TABLE IF NOT EXISTS exercises (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      primary_muscles TEXT NOT NULL, -- JSON array
      secondary_muscles TEXT NOT NULL, -- JSON array
      equipment TEXT NOT NULL, -- JSON array
      difficulty TEXT NOT NULL CHECK(difficulty IN ('easy', 'med', 'hard')),
      instructions TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `)

  // Logs table (per user)
  db.exec(`
    CREATE TABLE IF NOT EXISTS logs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      date_iso TEXT NOT NULL,
      exercise_id TEXT NOT NULL,
      sets TEXT NOT NULL, -- JSON array of {reps, weightKg}
      credits TEXT NOT NULL, -- JSON array of {muscle, sets}
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (exercise_id) REFERENCES exercises(id)
    )
  `)

  // Sessions table for authentication
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `)

  // Indexes for performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    CREATE INDEX IF NOT EXISTS idx_logs_user_id ON logs(user_id);
    CREATE INDEX IF NOT EXISTS idx_logs_date ON logs(date_iso);
    CREATE INDEX IF NOT EXISTS idx_logs_exercise ON logs(exercise_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
    CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
  `)

  console.log('✅ Database initialized:', dbPath)
}


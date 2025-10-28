import { db } from '../db/database.js'
import { LogEntry, logFromRow, logToRow } from '../models/log.js'

export function getAllLogs(userId: string): LogEntry[] {
  const rows = db.prepare('SELECT * FROM logs WHERE user_id = ? ORDER BY date_iso DESC, created_at DESC').all(userId) as any[]
  return rows.map(logFromRow)
}

export function getLogById(id: string): LogEntry | null {
  const row = db.prepare('SELECT * FROM logs WHERE id = ?').get(id) as any
  if (!row) return null
  return logFromRow(row)
}

export function getLogsByExerciseId(userId: string, exerciseId: string): LogEntry[] {
  const rows = db.prepare('SELECT * FROM logs WHERE user_id = ? AND exercise_id = ? ORDER BY date_iso DESC').all(userId, exerciseId) as any[]
  return rows.map(logFromRow)
}

export function getLogsByDateRange(userId: string, startDate: string, endDate: string): LogEntry[] {
  const rows = db.prepare(`
    SELECT * FROM logs 
    WHERE user_id = ? AND date_iso >= ? AND date_iso <= ?
    ORDER BY date_iso DESC
  `).all(userId, startDate, endDate) as any[]
  return rows.map(logFromRow)
}

export function createLog(userId: string, log: LogEntry): LogEntry {
  const row = logToRow(log)
  db.prepare(`
    INSERT INTO logs (id, user_id, date_iso, exercise_id, sets, credits)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    row.id,
    userId,
    row.date_iso,
    row.exercise_id,
    row.sets,
    row.credits
  )
  return log
}

export function updateLog(userId: string, id: string, log: Partial<LogEntry>): LogEntry | null {
  const existing = getLogById(id)
  if (!existing) return null
  
  // Verify ownership
  const ownerCheck = db.prepare('SELECT user_id FROM logs WHERE id = ?').get(id) as { user_id: string } | undefined
  if (!ownerCheck || ownerCheck.user_id !== userId) return null

  const updated: LogEntry = { ...existing, ...log }
  const row = logToRow(updated)
  
  db.prepare(`
    UPDATE logs 
    SET date_iso = ?, exercise_id = ?, sets = ?, credits = ?
    WHERE id = ? AND user_id = ?
  `).run(
    row.date_iso,
    row.exercise_id,
    row.sets,
    row.credits,
    id,
    userId
  )

  return updated
}

export function deleteLog(userId: string, id: string): boolean {
  const result = db.prepare('DELETE FROM logs WHERE id = ? AND user_id = ?').run(id, userId)
  return result.changes > 0
}


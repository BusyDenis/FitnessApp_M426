import { db } from '../db/database.js'
import { User, userFromRow, hashPassword, comparePassword } from '../models/user.js'
import { createSessionToken } from '../models/user.js'

export async function createUser(username: string, password: string): Promise<{ user: Omit<User, 'password_hash'>; error?: string }> {
  // Check if username already exists
  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username) as { id: string } | undefined
  if (existing) {
    return { user: {} as Omit<User, 'password_hash'>, error: 'Username already exists' }
  }

  // Validate username
  if (username.length < 3 || username.length > 20) {
    return { user: {} as Omit<User, 'password_hash'>, error: 'Username must be 3-20 characters' }
  }

  // Validate password
  if (password.length < 6) {
    return { user: {} as Omit<User, 'password_hash'>, error: 'Password must be at least 6 characters' }
  }

  const id = crypto.randomUUID()
  const passwordHash = await hashPassword(password)

  db.prepare('INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)').run(id, username, passwordHash)

  const row = db.prepare('SELECT id, username, created_at FROM users WHERE id = ?').get(id) as any
  return { user: userFromRow(row) }
}

export async function authenticateUser(username: string, password: string): Promise<{ user: Omit<User, 'password_hash'> | null; error?: string }> {
  const row = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any
  if (!row) {
    return { user: null, error: 'Invalid username or password' }
  }

  const isValid = await comparePassword(password, row.password_hash)
  if (!isValid) {
    return { user: null, error: 'Invalid username or password' }
  }

  return { user: userFromRow(row) }
}

export function getUserById(userId: string): Omit<User, 'password_hash'> | null {
  const row = db.prepare('SELECT id, username, created_at FROM users WHERE id = ?').get(userId) as any
  if (!row) return null
  return userFromRow(row)
}

export function createSession(userId: string): { token: string; expiresAt: Date } {
  const token = createSessionToken()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) // 7 days

  db.prepare(`
    INSERT INTO sessions (id, user_id, token, expires_at)
    VALUES (?, ?, ?, ?)
  `).run(crypto.randomUUID(), userId, token, expiresAt.toISOString())

  return { token, expiresAt }
}

export function getSession(token: string): { userId: string; expiresAt: Date } | null {
  const row = db.prepare(`
    SELECT user_id, expires_at FROM sessions 
    WHERE token = ? AND expires_at > datetime('now')
  `).get(token) as { user_id: string; expires_at: string } | undefined

  if (!row) return null

  return {
    userId: row.user_id,
    expiresAt: new Date(row.expires_at),
  }
}

export function deleteSession(token: string): void {
  db.prepare('DELETE FROM sessions WHERE token = ?').run(token)
}

export function deleteExpiredSessions(): void {
  db.prepare("DELETE FROM sessions WHERE expires_at <= datetime('now')").run()
}


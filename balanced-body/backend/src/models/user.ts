import bcrypt from 'bcryptjs'

export type User = {
  id: string
  username: string
  password_hash: string
  created_at?: string
}

export type UserRow = {
  id: string
  username: string
  password_hash: string
  created_at?: string
}

export function userFromRow(row: UserRow): Omit<User, 'password_hash'> {
  return {
    id: row.id,
    username: row.username,
    created_at: row.created_at,
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function createSessionToken(): string {
  return crypto.randomUUID() + '-' + Date.now().toString(36)
}


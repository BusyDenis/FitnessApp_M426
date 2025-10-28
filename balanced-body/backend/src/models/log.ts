export type SetEntry = {
  reps: number
  weightKg: number
}

export type CreditEntry = {
  muscle: string
  sets: number
}

export type LogEntry = {
  id: string
  dateISO: string
  exerciseId: string
  sets: SetEntry[]
  credits: CreditEntry[]
  created_at?: string
}

export type LogRow = {
  id: string
  date_iso: string
  exercise_id: string
  sets: string // JSON
  credits: string // JSON
  created_at?: string
}

export function logFromRow(row: LogRow): LogEntry {
  return {
    id: row.id,
    dateISO: row.date_iso,
    exerciseId: row.exercise_id,
    sets: JSON.parse(row.sets),
    credits: JSON.parse(row.credits),
    created_at: row.created_at,
  }
}

export function logToRow(log: LogEntry): Omit<LogRow, 'created_at'> {
  return {
    id: log.id,
    date_iso: log.dateISO,
    exercise_id: log.exerciseId,
    sets: JSON.stringify(log.sets),
    credits: JSON.stringify(log.credits),
  }
}


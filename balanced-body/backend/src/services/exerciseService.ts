import { db } from '../db/database.js'
import { Exercise, exerciseFromRow, exerciseToRow } from '../models/exercise.js'

export function getAllExercises(): Exercise[] {
  const rows = db.prepare('SELECT * FROM exercises ORDER BY name').all() as any[]
  return rows.map(exerciseFromRow)
}

export function getExerciseCount(): number {
  const row = db.prepare('SELECT COUNT(*) as count FROM exercises').get() as { count: number }
  return row.count
}

export function getExerciseById(id: string): Exercise | null {
  const row = db.prepare('SELECT * FROM exercises WHERE id = ?').get(id) as any
  if (!row) return null
  return exerciseFromRow(row)
}

export function createExercise(exercise: Exercise): Exercise {
  const row = exerciseToRow(exercise)
  db.prepare(`
    INSERT INTO exercises (id, name, primary_muscles, secondary_muscles, equipment, difficulty, instructions)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    row.id,
    row.name,
    row.primary_muscles,
    row.secondary_muscles,
    row.equipment,
    row.difficulty,
    row.instructions
  )
  return exercise
}

export function createExercises(exercises: Exercise[]): void {
  const insert = db.prepare(`
    INSERT INTO exercises (id, name, primary_muscles, secondary_muscles, equipment, difficulty, instructions)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)
  
  const insertMany = db.transaction((exercises: Exercise[]) => {
    for (const exercise of exercises) {
      const row = exerciseToRow(exercise)
      insert.run(
        row.id,
        row.name,
        row.primary_muscles,
        row.secondary_muscles,
        row.equipment,
        row.difficulty,
        row.instructions
      )
    }
  })

  insertMany(exercises)
}

export function updateExercise(id: string, exercise: Partial<Exercise>): Exercise | null {
  const existing = getExerciseById(id)
  if (!existing) return null

  const updated: Exercise = { ...existing, ...exercise }
  const row = exerciseToRow(updated)
  
  db.prepare(`
    UPDATE exercises 
    SET name = ?, primary_muscles = ?, secondary_muscles = ?, equipment = ?, difficulty = ?, instructions = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(
    row.name,
    row.primary_muscles,
    row.secondary_muscles,
    row.equipment,
    row.difficulty,
    row.instructions,
    id
  )

  return updated
}

export function deleteExercise(id: string): boolean {
  const result = db.prepare('DELETE FROM exercises WHERE id = ?').run(id)
  return result.changes > 0
}


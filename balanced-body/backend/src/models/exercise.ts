export type Exercise = {
  id: string
  name: string
  primary: string[]
  secondary: string[]
  equipment: string[]
  difficulty: 'easy' | 'med' | 'hard'
  instructions: string
  created_at?: string
  updated_at?: string
}

export type ExerciseRow = {
  id: string
  name: string
  primary_muscles: string
  secondary_muscles: string
  equipment: string
  difficulty: 'easy' | 'med' | 'hard'
  instructions: string
  created_at?: string
  updated_at?: string
}

export function exerciseFromRow(row: ExerciseRow): Exercise {
  return {
    id: row.id,
    name: row.name,
    primary: JSON.parse(row.primary_muscles),
    secondary: JSON.parse(row.secondary_muscles),
    equipment: JSON.parse(row.equipment),
    difficulty: row.difficulty,
    instructions: row.instructions,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

export function exerciseToRow(exercise: Exercise): Omit<ExerciseRow, 'created_at' | 'updated_at'> {
  return {
    id: exercise.id,
    name: exercise.name,
    primary_muscles: JSON.stringify(exercise.primary),
    secondary_muscles: JSON.stringify(exercise.secondary),
    equipment: JSON.stringify(exercise.equipment),
    difficulty: exercise.difficulty,
    instructions: exercise.instructions,
  }
}


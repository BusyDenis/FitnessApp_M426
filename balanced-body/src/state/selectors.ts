import type { Exercise, LogEntry } from './store'

export function indexExercisesById(exercises: Exercise[]): Record<string, Exercise> {
  return exercises.reduce<Record<string, Exercise>>((acc, ex) => {
    acc[ex.id] = ex
    return acc
  }, {})
}

export function getAllMuscles(exercises: Exercise[]): string[] {
  const set = new Set<string>()
  for (const e of exercises) {
    for (const m of e.primary) {
      set.add(m)
    }
    for (const m of e.secondary) {
      set.add(m)
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b))
}

export function logsByExercise(logs: LogEntry[]): Record<string, LogEntry[]> {
  return logs.reduce<Record<string, LogEntry[]>>((acc, l) => {
    const key = l.exerciseId
    if (!acc[key]) acc[key] = []
    acc[key].push(l)
    return acc
  }, {})
}



import type { Exercise, LogEntry } from './store'

export function indexExercisesById(exercises: Exercise[]): Record<string, Exercise> {
  return exercises.reduce<Record<string, Exercise>>((acc, ex) => {
    acc[ex.id] = ex
    return acc
  }, {})
}

export function getAllMuscles(exercises: Exercise[]): string[] {
  const set = new Set<string>()
  exercises.forEach((e) => {
    e.primary.forEach((m) => set.add(m))
    e.secondary.forEach((m) => set.add(m))
  })
  return Array.from(set).sort()
}

export function logsByExercise(logs: LogEntry[]): Record<string, LogEntry[]> {
  return logs.reduce<Record<string, LogEntry[]>>((acc, l) => {
    const key = l.exerciseId
    if (!acc[key]) acc[key] = []
    acc[key].push(l)
    return acc
  }, {})
}



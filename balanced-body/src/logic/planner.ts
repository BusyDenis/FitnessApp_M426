import type { Exercise } from '../state/store'

export function suggestExercises(
  undertrainedMuscles: string[],
  allExercises: Exercise[],
  equipmentFilter?: string
): Record<string, Exercise[]> {
  const byMuscle: Record<string, Exercise[]> = {}
  for (const m of undertrainedMuscles) {
    const candidates = allExercises.filter((ex) =>
      ex.primary.includes(m) || ex.secondary.includes(m)
    )
    const filtered = equipmentFilter
      ? candidates.filter((ex) => ex.equipment.includes(equipmentFilter))
      : candidates
    byMuscle[m] = filtered.slice(0, 2)
  }
  return byMuscle
}



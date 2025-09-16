import { useEffect, useMemo, useState } from 'react'
import seed from '../data/exercises.seed.json'
import { ExerciseCard } from '../components/ExerciseCard'
import { FilterBar, type Filter } from '../components/FilterBar'
import { useStore, type Exercise } from '../state/store'
import { getJSON, setJSON } from '../lib/storage'
import { getAllMuscles } from '../state/selectors'

export default function Exercises() {
  const { state, dispatch } = useStore()
  const [filter, setFilter] = useState<Filter>({ muscle: '', equipment: '', difficulty: '' })

  useEffect(() => {
    const existing = getJSON<Exercise[]>('bb_exercises', [])
    if (existing.length === 0) {
      const exs = seed as Exercise[]
      setJSON('bb_exercises', exs)
      dispatch({ type: 'INIT_SEED', exercises: exs })
    } else if (state.exercises.length === 0) {
      dispatch({ type: 'INIT_SEED', exercises: existing })
    }
  }, [dispatch, state.exercises.length])

  const muscles = useMemo(() => getAllMuscles(state.exercises), [state.exercises])

  const list = useMemo(() => {
    return state.exercises.filter((e) => {
      if (filter.muscle && !(e.primary.includes(filter.muscle) || e.secondary.includes(filter.muscle))) return false
      if (filter.equipment && !e.equipment.includes(filter.equipment)) return false
      if (filter.difficulty && e.difficulty !== filter.difficulty as any) return false
      return true
    })
  }, [state.exercises, filter])

  return (
    <div>
      <h1 className="text-xl font-semibold mb-3">Übungen</h1>
      <FilterBar muscles={muscles} onChange={setFilter} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {list.map((ex) => (
          <ExerciseCard key={ex.id} exercise={ex} />
        ))}
      </div>
    </div>
  )
}



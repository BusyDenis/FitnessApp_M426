import { useMemo, useState } from 'react'
import { ExerciseCard } from '../components/ExerciseCard'
import { FilterBar, type Filter } from '../components/FilterBar'
import { useStore } from '../state/store'
import { getAllMuscles } from '../state/selectors'

export default function Exercises() {
  const { state } = useStore()
  const [filter, setFilter] = useState<Filter>({ muscle: '', equipment: '', difficulty: '' })

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
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Übungsbibliothek</h1>
        <p className="text-slate-600">Finde die perfekte Übung für dein Training</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4">
        <FilterBar muscles={muscles} filter={filter} onChange={setFilter} />
      </div>

      {/* Results */}
      {list.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-slate-200">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Keine Übungen gefunden</h2>
          <p className="text-slate-600 mb-6">Versuche andere Filtereinstellungen.</p>
        </div>
      ) : (
        <>
          <div className="text-sm text-slate-600 mb-2">
            {list.length} {list.length === 1 ? 'Übung gefunden' : 'Übungen gefunden'}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((ex) => (
              <ExerciseCard key={ex.id} exercise={ex} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}



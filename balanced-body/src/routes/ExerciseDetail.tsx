import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStore } from '../state/store'
import { getExerciseImage } from '../lib/images'
import { calculate1RM } from '../lib/calculations'

const difficultyConfig = {
  easy: { label: 'Einfach', color: 'bg-green-100 text-green-700 border-green-200' },
  med: { label: 'Mittel', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  hard: { label: 'Schwer', color: 'bg-red-100 text-red-700 border-red-200' },
}

export default function ExerciseDetail() {
  const { id } = useParams()
  const { state } = useStore()
  const ex = state.exercises.find((e) => e.id === id)

  // Calculate 1RM from logs for this exercise (must be before early return)
  const exerciseLogs = useMemo(() => {
    if (!id) return []
    return state.logs.filter(log => log.exerciseId === id)
  }, [state.logs, id])

  const estimated1RM = useMemo(() => {
    if (exerciseLogs.length === 0) return null
    // Find the highest 1RM from all sets
    let max1RM = 0
    for (const log of exerciseLogs) {
      for (const set of log.sets) {
        const oneRM = calculate1RM(set.weightKg, set.reps)
        if (oneRM > max1RM) max1RM = oneRM
      }
    }
    return Math.round(max1RM * 10) / 10
  }, [exerciseLogs])

  if (!ex) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Übung nicht gefunden</h2>
        <p className="text-slate-600 mb-6">Diese Übung existiert nicht.</p>
        <Link to="/exercises" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Zur Übersicht
        </Link>
      </div>
    )
  }

  const difficulty = difficultyConfig[ex.difficulty]

  return (
    <div className="space-y-6 fade-in">
      {/* Hero Image */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl h-96">
        <img 
          src={getExerciseImage(ex.id)} 
          alt={ex.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{ex.name}</h1>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${difficulty.color} bg-white`}>
              {difficulty.label}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Instructions */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Ausführung</h2>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">{ex.instructions}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Info Cards */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Details</h2>
            <div className="space-y-4">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Primäre Muskeln</div>
                <div className="flex flex-wrap gap-2">
                  {ex.primary.map((m) => (
                    <span key={m} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md text-sm font-medium border border-blue-200">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
              {ex.secondary.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Sekundäre Muskeln</div>
                  <div className="flex flex-wrap gap-2">
                    {ex.secondary.map((m) => (
                      <span key={m} className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-md text-sm font-medium border border-purple-200">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Equipment</div>
                <div className="flex flex-wrap gap-2">
                  {ex.equipment.map((eq) => (
                    <span key={eq} className="px-3 py-1.5 bg-slate-50 text-slate-700 rounded-md text-sm font-medium border border-slate-200">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 1RM Calculator */}
          {estimated1RM && (
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
              <div className="text-sm font-medium text-green-100 mb-1">Geschätzter 1RM</div>
              <div className="text-3xl font-bold mb-2">{estimated1RM} kg</div>
              <div className="text-xs text-green-100">
                Basierend auf {exerciseLogs.length} {exerciseLogs.length === 1 ? 'Workout' : 'Workouts'}
              </div>
            </div>
          )}

          {/* Action Button */}
          <Link 
            to={`/log?exerciseId=${ex.id}`}
            className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] pulse-glow"
          >
            Diese Übung loggen
          </Link>
        </div>
      </div>
    </div>
  )
}



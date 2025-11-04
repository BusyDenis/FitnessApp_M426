import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useStore, type LogEntry } from '../state/store'
import { createLog as createLogApi } from '../lib/api'
import { Timer } from '../components/Timer'

function useQuery() {
  const { search } = useLocation()
  return useMemo(() => new URLSearchParams(search), [search])
}

export default function Log() {
  const { state, dispatch } = useStore()
  const q = useQuery()
  const preselected = q.get('exerciseId') || ''
  const [exerciseId, setExerciseId] = useState(preselected)
  const [sets, setSets] = useState<{ reps: number; weightKg: number }[]>([{ reps: 8, weightKg: 20 }])

  function addSet() {
    setSets((s) => [...s, { reps: 8, weightKg: 20 }])
  }
  function removeSet(idx: number) {
    setSets((s) => s.filter((_, i) => i !== idx))
  }

  async function save() {
    // Edge cases validation
    if (!exerciseId) {
      alert('Bitte wähle eine Übung aus.')
      return
    }
    
    if (sets.length === 0) {
      alert('Bitte füge mindestens ein Set hinzu.')
      return
    }
    
    const ex = state.exercises.find((e) => e.id === exerciseId)
    if (!ex) {
      alert('Übung nicht gefunden. Bitte wähle eine andere Übung.')
      return
    }
    
    // Validate sets have valid values
    const invalidSets = sets.filter(s => !Number.isFinite(s.reps) || s.reps < 1 || !Number.isFinite(s.weightKg) || s.weightKg < 0)
    if (invalidSets.length > 0) {
      alert('Bitte überprüfe deine Eingaben: Wiederholungen müssen >= 1 sein und Gewicht >= 0.')
      return
    }
    
    // Implementierte Credits-Regel: Primär volle Sets, Sekundär 0.5x
    const credits: { muscle: string; sets: number }[] = [
      ...ex.primary.map((m) => ({ muscle: m, sets: sets.length })),
      ...ex.secondary.map((m) => ({ muscle: m, sets: sets.length * 0.5 })),
    ]
    
    const log: LogEntry = {
      id: crypto.randomUUID(),
      dateISO: new Date().toISOString(),
      exerciseId,
      sets,
      credits,
    }
    
    // Save to API
    try {
      await createLogApi(log)
      dispatch({ type: 'ADD_LOG', log })
      
      // Reset form after successful save
      setSets([{ reps: 8, weightKg: 20 }])
      setExerciseId('')
      
      alert('Gespeichert!')
    } catch (error) {
      alert('Fehler beim Speichern: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Workout loggen</h1>
        <p className="text-slate-600">Trage deine Trainingsdaten ein</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Übung wählen</label>
          <select 
            className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            value={exerciseId} 
            onChange={(e) => setExerciseId(e.target.value)}
          >
            <option value="">Bitte wählen...</option>
            {state.exercises.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Sets</label>
          <div className="space-y-3">
          {sets.map((s, i) => (
            <div key={`${s.reps}-${s.weightKg}-${i}`} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 mb-1">Wiederholungen</label>
                <input 
                  type="number" 
                  className="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" 
                  value={s.reps} 
                  min={1} 
                  onChange={(e) => setSets((prev) => prev.map((p, idx) => idx === i ? { ...p, reps: Number(e.target.value) } : p))} 
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 mb-1">Gewicht (kg)</label>
                <input 
                  type="number" 
                  className="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" 
                  value={s.weightKg} 
                  min={0} 
                  step={0.5} 
                  onChange={(e) => setSets((prev) => prev.map((p, idx) => idx === i ? { ...p, weightKg: Number(e.target.value) } : p))} 
                />
              </div>
              <button 
                className="mt-6 text-red-600 hover:text-red-700 transition-colors"
                onClick={() => removeSet(i)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
          </div>
        </div>
        <button 
          className="w-full border-2 border-dashed border-slate-300 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
          onClick={addSet}
        >
          + Set hinzufügen
        </button>

        {/* Timer */}
        <div className="border-t border-slate-200 pt-4">
          <Timer initialSeconds={90} />
        </div>

        <div className="pt-4 border-t border-slate-200">
          <button 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-base font-semibold px-6 py-4 rounded-xl disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]" 
            onClick={save} 
            disabled={!exerciseId || sets.length === 0}
          >
            Workout speichern
          </button>
        </div>
        {state.exercises.length === 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Keine Übungen geladen. Bitte lade zuerst die Übungen auf der Exercises-Seite.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}



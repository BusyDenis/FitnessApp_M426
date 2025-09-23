import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useStore, type LogEntry } from '../state/store'
// storage utils not used here; persistence is handled in reducer

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

  function save() {
    if (!exerciseId) return
    const ex = state.exercises.find((e) => e.id === exerciseId)
    if (!ex) return
    // implementierte Credits-Regel: Primär volle Sets, Sekundär 0.5x
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
    // Persist via reducer (single source). Duplicate direct writes removed.
    dispatch({ type: 'ADD_LOG', log })
    alert('Gespeichert')
  }

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Schnell-Logging</h1>
      <div className="bg-white border rounded p-3 space-y-3">
        <div className="text-sm">Übung</div>
        <select className="border rounded px-2 py-1 text-sm w-full" value={exerciseId} onChange={(e) => setExerciseId(e.target.value)}>
          <option value="">Bitte wählen</option>
          {state.exercises.map((e) => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>

        <div className="text-sm mt-2">Sets</div>
        <div className="space-y-2">
          {sets.map((s, i) => (
            <div key={`${s.reps}-${s.weightKg}-${i}`} className="flex items-center gap-2">
              <input type="number" className="border rounded px-2 py-1 w-24" value={s.reps} min={1} onChange={(e) => setSets((prev) => prev.map((p, idx) => idx === i ? { ...p, reps: Number(e.target.value) } : p))} />
              <input type="number" className="border rounded px-2 py-1 w-28" value={s.weightKg} min={0} step={0.5} onChange={(e) => setSets((prev) => prev.map((p, idx) => idx === i ? { ...p, weightKg: Number(e.target.value) } : p))} />
              <button className="text-xs text-red-600" onClick={() => removeSet(i)}>Entfernen</button>
            </div>
          ))}
        </div>
        <button className="text-sm text-blue-600" onClick={addSet}>+ Set hinzufügen</button>

        <div className="pt-3">
          <button className="bg-blue-600 text-white text-sm px-3 py-2 rounded" onClick={save} disabled={!exerciseId}>Speichern</button>
        </div>
      </div>
    </div>
  )
}



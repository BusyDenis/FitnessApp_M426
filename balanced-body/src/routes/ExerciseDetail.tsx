import { Link, useParams } from 'react-router-dom'
import { useStore } from '../state/store'

export default function ExerciseDetail() {
  const { id } = useParams()
  const { state } = useStore()
  const ex = state.exercises.find((e) => e.id === id)

  if (!ex) return <div>Übung nicht gefunden.</div>
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">{ex.name}</h1>
      <div className="text-sm">Primary: {ex.primary.join(', ')}</div>
      {ex.secondary.length > 0 && <div className="text-sm">Secondary: {ex.secondary.join(', ')}</div>}
      <div className="text-sm">Equipment: {ex.equipment.join(', ')}</div>
      <div className="text-sm">Schwierigkeit: {ex.difficulty}</div>
      <p className="text-sm bg-white border rounded p-3">{ex.instructions}</p>
      <Link to={`/log?exerciseId=${ex.id}`} className="inline-block bg-blue-600 text-white text-sm px-3 py-2 rounded">Diese Übung loggen</Link>
    </div>
  )
}



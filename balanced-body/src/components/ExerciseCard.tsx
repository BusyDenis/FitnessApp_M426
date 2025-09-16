import { Link } from 'react-router-dom'
import type { Exercise } from '../state/store'

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  return (
    <Link to={`/exercises/${exercise.id}`} className="block border rounded-md p-3 hover:shadow-sm bg-white">
      <div className="font-medium">{exercise.name}</div>
      <div className="text-xs text-slate-600 mt-1">Primary: {exercise.primary.join(', ')}</div>
      {exercise.secondary.length > 0 && (
        <div className="text-xs text-slate-600">Secondary: {exercise.secondary.join(', ')}</div>
      )}
      <div className="flex flex-wrap gap-1 mt-2">
        {exercise.equipment.map((eq) => (
          <span key={eq} className="text-[10px] px-2 py-0.5 bg-slate-100 rounded-full">{eq}</span>
        ))}
      </div>
    </Link>
  )
}



import { Link } from 'react-router-dom'
import type { Exercise } from '../state/store'
import { getExerciseImage } from '../lib/images'

const difficultyColors = {
  easy: 'bg-green-100 text-green-700',
  med: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-red-100 text-red-700',
}

export function ExerciseCard({ exercise }: Readonly<{ exercise: Exercise }>) {
  return (
    <Link 
      to={`/exercises/${exercise.id}`} 
      className="block group card-hover bg-white rounded-xl overflow-hidden shadow-md border border-slate-200 fade-in"
    >
      <div className="relative h-48 overflow-hidden bg-slate-200">
        <img 
          src={getExerciseImage(exercise.id)} 
          alt={exercise.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${difficultyColors[exercise.difficulty]}`}>
            {exercise.difficulty}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
          {exercise.name}
        </h3>
        <div className="space-y-1 mb-3">
          <div className="text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Primary:</span> {exercise.primary.join(', ')}
          </div>
          {exercise.secondary.length > 0 && (
            <div className="text-xs text-slate-600">
              <span className="font-semibold text-slate-700">Secondary:</span> {exercise.secondary.join(', ')}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {exercise.equipment.map((eq) => (
            <span 
              key={eq} 
              className="text-[10px] px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-medium border border-blue-100"
            >
              {eq}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}



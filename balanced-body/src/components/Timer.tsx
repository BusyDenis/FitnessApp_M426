import { useState, useEffect, useRef } from 'react'

interface TimerProps {
  initialSeconds?: number
  onComplete?: () => void
  autoStart?: boolean
}

export function Timer({ initialSeconds = 60, onComplete, autoStart = false }: TimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(autoStart)
  const [isCompleted, setIsCompleted] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRunning && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            setIsCompleted(true)
            if (onComplete) onComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, seconds, onComplete])

  function reset() {
    setSeconds(initialSeconds)
    setIsRunning(false)
    setIsCompleted(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  function toggle() {
    if (seconds === 0) {
      reset()
      return
    }
    setIsRunning(!isRunning)
  }

  const minutes = Math.floor(seconds / 60)
  const displaySeconds = seconds % 60
  const progress = ((initialSeconds - seconds) / initialSeconds) * 100

  return (
    <div className="bg-white rounded-lg border-2 border-slate-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-slate-700">Pausen-Timer</span>
        <button
          onClick={reset}
          className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
        >
          Zurücksetzen
        </button>
      </div>
      
      <div className="relative mb-3">
        <div className="flex items-center justify-center">
          <div className="text-4xl font-bold text-slate-900">
            {String(minutes).padStart(2, '0')}:{String(displaySeconds).padStart(2, '0')}
          </div>
        </div>
        <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={toggle}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
            isRunning
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isRunning ? 'Pause' : (isCompleted ? 'Neustart' : 'Start')}
        </button>
        
        <select
          value={initialSeconds}
          onChange={(e) => {
            const newSeconds = Number(e.target.value)
            setSeconds(newSeconds)
            reset()
          }}
          className="border-2 border-slate-200 rounded-lg px-2 py-2 text-sm focus:border-blue-500 outline-none"
          disabled={isRunning}
        >
          <option value={30}>30s</option>
          <option value={45}>45s</option>
          <option value={60}>1min</option>
          <option value={90}>1.5min</option>
          <option value={120}>2min</option>
          <option value={180}>3min</option>
        </select>
      </div>

      {isCompleted && (
        <div className="mt-3 text-center">
          <div className="text-green-600 font-semibold text-sm animate-pulse">
            ⏰ Zeit abgelaufen!
          </div>
        </div>
      )}
    </div>
  )
}


import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { getExercises as fetchExercises, getLogs as fetchLogs } from '../lib/api'

export type Exercise = {
  id: string
  name: string
  primary: string[]
  secondary: string[]
  equipment: string[]
  difficulty: 'easy' | 'med' | 'hard'
  instructions: string
}

export type SetEntry = { reps: number; weightKg: number }

export type LogEntry = {
  id: string
  dateISO: string
  exerciseId: string
  sets: SetEntry[]
  credits: { muscle: string; sets: number }[]
}

type State = {
  exercises: Exercise[]
  logs: LogEntry[]
}

type Action =
  | { type: 'INIT_SEED'; exercises: Exercise[] }
  | { type: 'SET_LOGS'; logs: LogEntry[] }
  | { type: 'ADD_LOG'; log: LogEntry }

const initialState: State = {
  exercises: [],
  logs: [],
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INIT_SEED': {
      return { ...state, exercises: action.exercises }
    }
    case 'SET_LOGS': {
      return { ...state, logs: action.logs }
    }
    case 'ADD_LOG': {
      return { ...state, logs: [...state.logs, action.log] }
    }
    default:
      return state
  }
}

type StoreContextValue = {
  state: State
  dispatch: React.Dispatch<Action>
  loading: boolean
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined)

export function StoreProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [loading, setLoading] = useState(true)

  // Load exercises from API (always available)
  useEffect(() => {
    async function loadExercises() {
      try {
        const exercises = await fetchExercises()
        dispatch({ type: 'INIT_SEED', exercises })
      } catch (error) {
        console.error('Failed to load exercises:', error)
      }
    }
    
    loadExercises()
  }, [])

  // Load logs when user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('bb_token')
    if (!token) {
      setLoading(false)
      return
    }

    async function loadLogs() {
      try {
        const logs = await fetchLogs()
        dispatch({ type: 'SET_LOGS', logs })
      } catch {
        // User might not be logged in yet or has no logs
      } finally {
        setLoading(false)
      }
    }
    
    loadLogs()
  }, [])

  const value = useMemo(() => ({ state, dispatch, loading }), [state, loading])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}




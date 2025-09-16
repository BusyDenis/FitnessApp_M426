import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { getJSON, setJSON } from '../lib/storage'

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
      const logs = [...state.logs, action.log]
      setJSON('bb_logs', logs)
      return { ...state, logs }
    }
    default:
      return state
  }
}

type StoreContextValue = {
  state: State
  dispatch: React.Dispatch<Action>
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Load persisted logs once
  useEffect(() => {
    const logs = getJSON<LogEntry[]>('bb_logs', [])
    if (logs.length) dispatch({ type: 'SET_LOGS', logs })
  }, [])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}




import { useMemo, useState } from 'react'
import { getJSON, setJSON } from '../lib/storage'
import type { Exercise } from '../state/store'
import { getAllMuscles } from '../state/selectors'
import { getExerciseImage } from '../lib/images'
import { FilterBar, type Filter } from '../components/FilterBar'
import { useStore } from '../state/store'

type RoutineExercise = {
    exerciseId: string
    name: string
    sets: number
    reps: number
}

type Routine = {
    id: string
    name: string
    notes?: string
    items: RoutineExercise[]
    createdAt: string
}

const difficultyColors = {
    easy: 'bg-green-100 text-green-700 border-green-200',
    med: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    hard: 'bg-red-100 text-red-700 border-red-200',
}

function getDifficultyLabel(difficulty: 'easy' | 'med' | 'hard'): string {
    if (difficulty === 'easy') return 'Einfach'
    if (difficulty === 'hard') return 'Schwer'
    return 'Mittel'
}

export default function CreateRoutine() {
    const { state } = useStore()
    const [query, setQuery] = useState('')
    const [filter, setFilter] = useState<Filter>({ muscle: '', equipment: '', difficulty: '' })
    const [name, setName] = useState('')
    const [notes, setNotes] = useState('')
    const [items, setItems] = useState<RoutineExercise[]>([])

    const muscles = useMemo(() => getAllMuscles(state.exercises), [state.exercises])

    const filtered = useMemo(() => {
        return state.exercises.filter((e) => {
            const q = query.trim().toLowerCase()
            const matchQ =
                q.length === 0 ||
                e.name.toLowerCase().includes(q) ||
                e.primary.some((m) => m.toLowerCase().includes(q)) ||
                e.secondary.some((m) => m.toLowerCase().includes(q))
            const matchMuscle =
                filter.muscle === '' || e.primary.includes(filter.muscle) || e.secondary.includes(filter.muscle)
            const matchDiff = filter.difficulty === '' || e.difficulty === filter.difficulty
            const matchEquipment = filter.equipment === '' || e.equipment.includes(filter.equipment)
            return matchQ && matchMuscle && matchDiff && matchEquipment
        })
    }, [state.exercises, query, filter])

    function addExercise(ex: Exercise) {
        // Edge case: Prevent duplicate additions
        if (items.some((i) => i.exerciseId === ex.id)) return
        setItems((prev) => [...prev, { exerciseId: ex.id, name: ex.name, sets: 3, reps: 10 }])
    }

    function removeExercise(id: string) {
        setItems((prev) => prev.filter((i) => i.exerciseId !== id))
    }

    function updateItem(id: string, patch: Partial<RoutineExercise>) {
        setItems((prev) => prev.map((i) => (i.exerciseId === id ? { ...i, ...patch } : i)))
    }

    function move(id: string, dir: -1 | 1) {
        setItems((prev) => {
            const idx = prev.findIndex((i) => i.exerciseId === id)
            if (idx < 0) return prev
            const next = [...prev]
            const swap = idx + dir
            if (swap < 0 || swap >= next.length) return prev
            const temp = next[idx]
            next[idx] = next[swap]
            next[swap] = temp
            return next
        })
    }

    function saveRoutine() {
        // Edge case validation: Empty name
        const trimmed = name.trim()
        if (!trimmed) {
            alert('Bitte einen Routinenamen eingeben.')
            return
        }
        
        // Edge case validation: Name too long
        if (trimmed.length > 100) {
            alert('Der Routinename ist zu lang (max. 100 Zeichen).')
            return
        }
        
        // Edge case validation: No exercises
        if (items.length === 0) {
            alert('Bitte mindestens eine Übung hinzufügen.')
            return
        }
        
        // Edge case validation: Too many exercises
        if (items.length > 50) {
            alert('Eine Routine kann maximal 50 Übungen enthalten.')
            return
        }
        
        // Edge case validation: Validate all items have valid sets/reps
        const invalidItems = items.filter((i) => !Number.isFinite(i.sets) || i.sets < 1 || i.sets > 100 || !Number.isFinite(i.reps) || i.reps < 1 || i.reps > 1000)
        if (invalidItems.length > 0) {
            alert('Bitte überprüfe deine Eingaben: Sätze und Wiederholungen müssen gültige Zahlen sein.')
            return
        }
        
        try {
            // Edge case: Handle localStorage errors
            const routines = getJSON<Routine[]>('bb_routines', [])
            const routine: Routine = {
                id: crypto.randomUUID(),
                name: trimmed,
                notes: notes.trim() || undefined,
                items,
                createdAt: new Date().toISOString(),
            }
            setJSON('bb_routines', [routine, ...routines])
            
            // Reset form after successful save
            setName('')
            setNotes('')
            setItems([])
            alert('Routine gespeichert!')
        } catch (error) {
            // Edge case: Handle storage errors
            alert('Fehler beim Speichern: ' + (error instanceof Error ? error.message : 'Unbekannter Fehler'))
        }
    }

    const addedIds = new Set(items.map((i) => i.exerciseId))

    return (
        <div className="space-y-6 fade-in">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Routine erstellen</h1>
                <p className="text-slate-600">Baue dein persönliches Trainingsprogramm</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Linke Spalte: Routine Builder */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Routine-Details</h2>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label htmlFor="routine-name" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Routinename *
                                </label>
                                <input
                                    id="routine-name"
                                    className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="z.B. Push Day (Oberkörper)"
                                    maxLength={100}
                                />
                            </div>

                            <div>
                                <label htmlFor="routine-notes" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Notizen (optional)
                                </label>
                                <textarea
                                    id="routine-notes"
                                    className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                                    rows={4}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Aufwärmen, Tempo, Pausen…"
                                    maxLength={500}
                                />
                            </div>
                        </div>

                        <div className="border-t border-slate-200 pt-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-slate-900">Ausgewählte Übungen</h3>
                                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                    {items.length}
                                </span>
                            </div>

                            {items.length === 0 ? (
                                <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                                    <div className="text-4xl mb-2">📋</div>
                                    <p className="text-sm">Noch keine Übung hinzugefügt</p>
                                    <p className="text-xs mt-1">Wähle Übungen aus der Liste rechts</p>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                    {items.map((i, idx) => {
                                        const ex = state.exercises.find((e) => e.id === i.exerciseId)
                                        return (
                                            <div
                                                key={i.exerciseId}
                                                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200 p-4"
                                            >
                                                <div className="flex items-start justify-between gap-2 mb-3">
                                                    <div className="flex items-center gap-2 flex-1">
                                                        <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                                            {idx + 1}
                                                        </span>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-semibold text-slate-900 text-sm truncate">
                                                                {i.name}
                                                            </div>
                                                            {ex && (
                                                                <div className="text-xs text-slate-600 mt-0.5">
                                                                    {ex.primary.join(', ')}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 flex-shrink-0">
                                                        <button
                                                            type="button"
                                                            className="p-1.5 hover:bg-blue-200 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                            onClick={() => move(i.exerciseId, -1)}
                                                            disabled={idx === 0}
                                                            title="Nach oben"
                                                            aria-label="Übung nach oben verschieben"
                                                        >
                                                            <svg className="w-4 h-4 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="p-1.5 hover:bg-blue-200 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                            onClick={() => move(i.exerciseId, 1)}
                                                            disabled={idx === items.length - 1}
                                                            title="Nach unten"
                                                            aria-label="Übung nach unten verschieben"
                                                        >
                                                            <svg className="w-4 h-4 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="p-1.5 hover:bg-red-200 rounded transition-colors"
                                                            onClick={() => removeExercise(i.exerciseId)}
                                                            title="Entfernen"
                                                            aria-label="Übung entfernen"
                                                        >
                                                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label htmlFor={`sets-${i.exerciseId}`} className="block text-xs font-semibold text-slate-600 mb-1">
                                                            Sätze
                                                        </label>
                                                        <input
                                                            id={`sets-${i.exerciseId}`}
                                                            type="number"
                                                            min={1}
                                                            max={100}
                                                            className="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                                            value={i.sets}
                                                            onChange={(e) => {
                                                                const val = Number(e.target.value)
                                                                if (!isNaN(val) && val >= 1 && val <= 100) {
                                                                    updateItem(i.exerciseId, { sets: val })
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor={`reps-${i.exerciseId}`} className="block text-xs font-semibold text-slate-600 mb-1">
                                                            Wiederholungen
                                                        </label>
                                                        <input
                                                            id={`reps-${i.exerciseId}`}
                                                            type="number"
                                                            min={1}
                                                            max={1000}
                                                            className="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                                            value={i.reps}
                                                            onChange={(e) => {
                                                                const val = Number(e.target.value)
                                                                if (!isNaN(val) && val >= 1 && val <= 1000) {
                                                                    updateItem(i.exerciseId, { reps: val })
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-4 rounded-xl disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
                            onClick={saveRoutine}
                            disabled={!name.trim() || items.length === 0}
                        >
                            Routine speichern
                        </button>
                    </div>
                </div>

                {/* Rechte Spalten: Exercise-Auswahl */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Such- und Filter-Bar */}
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4">
                        <div className="mb-4">
                            <input
                                className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                placeholder="Suche nach Übung, Muskel…"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <FilterBar muscles={muscles} filter={filter} onChange={setFilter} />
                    </div>

                    {/* Übungs-Grid */}
                    <div>
                        {filtered.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-slate-200">
                                <div className="text-6xl mb-4">🔍</div>
                                <h2 className="text-xl font-bold text-slate-900 mb-2">Keine Übungen gefunden</h2>
                                <p className="text-slate-600 mb-6">Versuche andere Filtereinstellungen.</p>
                            </div>
                        ) : (
                            <>
                                <div className="text-sm text-slate-600 mb-4">
                                    {filtered.length} {filtered.length === 1 ? 'Übung gefunden' : 'Übungen gefunden'}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filtered.map((ex) => {
                                        const isAdded = addedIds.has(ex.id)
                                        const difficultyLabel = getDifficultyLabel(ex.difficulty)

                                        if (isAdded) {
                                            return (
                                                <div
                                                    key={ex.id}
                                                    className="group relative bg-white rounded-xl overflow-hidden shadow-md border-2 border-green-500 opacity-60 cursor-not-allowed"
                                                >
                                                    <ExerciseCardContent ex={ex} difficultyLabel={difficultyLabel} isAdded={true} />
                                                </div>
                                            )
                                        }

                                        return (
                                            <button
                                                key={ex.id}
                                                type="button"
                                                className="group relative bg-white rounded-xl overflow-hidden shadow-md border-2 border-slate-200 hover:border-blue-400 hover:shadow-xl card-hover text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                onClick={() => addExercise(ex)}
                                            >
                                                <ExerciseCardContent ex={ex} difficultyLabel={difficultyLabel} isAdded={false} />
                                            </button>
                                        )
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

// Separate component for exercise card content to improve code organization
function ExerciseCardContent({
    ex,
    difficultyLabel,
    isAdded,
}: {
    ex: Exercise
    difficultyLabel: string
    isAdded: boolean
}) {
    return (
        <>
            {/* Bild */}
            <div className="relative h-40 overflow-hidden bg-slate-200">
                <img
                    src={getExerciseImage(ex.id)}
                    alt={ex.name}
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                        !isAdded && 'group-hover:scale-110'
                    }`}
                    loading="lazy"
                />
                <div className="absolute top-3 right-3">
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold border ${difficultyColors[ex.difficulty]}`}
                    >
                        {difficultyLabel}
                    </span>
                </div>
                {isAdded && (
                    <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center">
                        <div className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Bereits hinzugefügt
                        </div>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
            </div>

            {/* Content */}
            <div className="p-4">
                <h3
                    className={`font-bold text-lg mb-2 transition-colors ${
                        isAdded ? 'text-slate-500 line-through' : 'text-slate-900 group-hover:text-blue-600'
                    }`}
                >
                    {ex.name}
                </h3>
                <div className="space-y-1 mb-3">
                    <div className="text-xs text-slate-600">
                        <span className="font-semibold text-slate-700">Primary:</span> {ex.primary.join(', ')}
                    </div>
                    {ex.secondary.length > 0 && (
                        <div className="text-xs text-slate-600">
                            <span className="font-semibold text-slate-700">Secondary:</span> {ex.secondary.join(', ')}
                        </div>
                    )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {ex.equipment.map((eq) => (
                        <span
                            key={eq}
                            className="text-[10px] px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-medium border border-blue-100"
                        >
                            {eq}
                        </span>
                    ))}
                </div>
            </div>
        </>
    )
}

import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getJSON, setJSON } from '../lib/storage'
import type { Exercise } from '../state/store'
import { getAllMuscles } from '../state/selectors'

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

export default function CreateRoutine() {
    const [allExercises, setAllExercises] = useState<Exercise[]>([])
    const [query, setQuery] = useState('')
    const [muscle, setMuscle] = useState('')
    const [difficulty, setDifficulty] = useState<'easy' | 'med' | 'hard' | ''>('')
    const [name, setName] = useState('')
    const [notes, setNotes] = useState('')
    const [items, setItems] = useState<RoutineExercise[]>([])

    // Exercises aus LocalStorage holen (werden im Projekt beim ersten Aufruf aus seed befüllt)
    useEffect(() => {
        const exs = getJSON<Exercise[]>('bb_exercises', [])
        setAllExercises(exs)
    }, [])

    const muscles = useMemo(() => getAllMuscles(allExercises), [allExercises])

    const filtered = useMemo(() => {
        return allExercises.filter((e) => {
            const q = query.trim().toLowerCase()
            const matchQ =
                q.length === 0 ||
                e.name.toLowerCase().includes(q) ||
                e.primary.some((m) => m.toLowerCase().includes(q)) ||
                e.secondary.some((m) => m.toLowerCase().includes(q))
            const matchMuscle =
                muscle === '' || e.primary.includes(muscle) || e.secondary.includes(muscle)
            const matchDiff = difficulty === '' || e.difficulty === difficulty
            return matchQ && matchMuscle && matchDiff
        })
    }, [allExercises, query, muscle, difficulty])

    function addExercise(ex: Exercise) {
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
                ;[next[idx], next[swap]] = [next[swap], next[idx]]
            return next
        })
    }

    function saveRoutine() {
        const trimmed = name.trim()
        if (!trimmed) {
            alert('Bitte einen Routinenamen eingeben.')
            return
        }
        if (items.length === 0) {
            alert('Bitte mindestens eine Übung hinzufügen.')
            return
        }
        const routines = getJSON<Routine[]>('bb_routines', [])
        const routine: Routine = {
            id: crypto.randomUUID(),
            name: trimmed,
            notes: notes.trim() || undefined,
            items,
            createdAt: new Date().toISOString(),
        }
        setJSON('bb_routines', [routine, ...routines])
        // simple UX: felder leeren
        setName('')
        setNotes('')
        setItems([])
        alert('Routine gespeichert!')
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Linke Spalte: Routine Builder */}
            <div className="lg:col-span-1 border rounded-md p-4 bg-white">
                <h1 className="text-xl font-semibold mb-3">Routine erstellen</h1>

                <label className="block text-sm font-medium">Name</label>
                <input
                    className="w-full border rounded px-2 py-1 mb-2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="z.B. Push Day (Oberkörper)"
                />

                <label className="block text-sm font-medium">Notizen (optional)</label>
                <textarea
                    className="w-full border rounded px-2 py-1 mb-3"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Aufwärmen, Tempo, Pausen…"
                />

                <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Ausgewählte Übungen</div>
                    <div className="text-xs text-slate-600">{items.length} Einträge</div>
                </div>

                {items.length === 0 ? (
                    <div className="text-sm text-slate-500">Noch keine Übung hinzugefügt.</div>
                ) : (
                    <ul className="space-y-2">
                        {items.map((i, idx) => (
                            <li key={i.exerciseId} className="border rounded p-2">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="font-medium text-sm">
                                        {idx + 1}. {i.name}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button className="text-xs px-2 py-1 border rounded" onClick={() => move(i.exerciseId, -1)}>↑</button>
                                        <button className="text-xs px-2 py-1 border rounded" onClick={() => move(i.exerciseId, 1)}>↓</button>
                                        <button className="text-xs px-2 py-1 border rounded" onClick={() => removeExercise(i.exerciseId)}>Entfernen</button>
                                    </div>
                                </div>
                                <div className="mt-2 grid grid-cols-2 gap-2">
                                    <label className="text-xs">
                                        Sets
                                        <input
                                            type="number"
                                            min={1}
                                            className="w-full border rounded px-2 py-1"
                                            value={i.sets}
                                            onChange={(e) => updateItem(i.exerciseId, { sets: Math.max(1, Number(e.target.value || 0)) })}
                                        />
                                    </label>
                                    <label className="text-xs">
                                        Reps
                                        <input
                                            type="number"
                                            min={1}
                                            className="w-full border rounded px-2 py-1"
                                            value={i.reps}
                                            onChange={(e) => updateItem(i.exerciseId, { reps: Math.max(1, Number(e.target.value || 0)) })}
                                        />
                                    </label>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                <button
                    className="mt-4 w-full bg-blue-600 text-white rounded px-3 py-2 disabled:opacity-50"
                    onClick={saveRoutine}
                    disabled={!name.trim() || items.length === 0}
                >
                    Routine speichern
                </button>

                <div className="mt-3 text-xs">
                    <Link className="text-blue-600 underline" to="/exercises">Zu den Übungen</Link>
                </div>
            </div>

            {/* Rechte Spalten: Exercise-Auswahl */}
            <div className="lg:col-span-2">
                <div className="mb-3 grid grid-cols-1 md:grid-cols-4 gap-2">
                    <input
                        className="md:col-span-2 border rounded px-2 py-1"
                        placeholder="Suche nach Name/Muskel…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <select className="border rounded px-2 py-1" value={muscle} onChange={(e) => setMuscle(e.target.value)}>
                        <option value="">Muskel (alle)</option>
                        {muscles.map((m) => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                    <select
                        className="border rounded px-2 py-1"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as any)}
                    >
                        <option value="">Schwierigkeit (alle)</option>
                        <option value="easy">easy</option>
                        <option value="med">med</option>
                        <option value="hard">hard</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filtered.map((ex) => (
                        <div key={ex.id} className="border rounded-md p-3 bg-white">
                            <div className="font-medium">{ex.name}</div>
                            <div className="text-xs text-slate-600 mt-1">
                                Primary: {ex.primary.join(', ')}
                            </div>
                            {ex.secondary.length > 0 && (
                                <div className="text-xs text-slate-600">
                                    Secondary: {ex.secondary.join(', ')}
                                </div>
                            )}
                            <div className="flex flex-wrap gap-1 mt-2">
                                {ex.equipment.map((eq) => (
                                    <span key={eq} className="text-[10px] px-2 py-0.5 bg-slate-100 rounded-full">
                    {eq}
                  </span>
                                ))}
                            </div>
                            <button
                                className="mt-3 w-full border rounded px-3 py-1"
                                onClick={() => addExercise(ex)}
                                disabled={items.some((i) => i.exerciseId === ex.id)}
                            >
                                Zur Routine hinzufügen
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
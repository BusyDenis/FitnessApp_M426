import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useStore } from '../state/store'
import { aggregateWeeklySets, findUndertrained } from '../logic/balance'
import { getWeekStart } from '../lib/date'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { state } = useStore()
  const weekStart = getWeekStart(new Date())
  const agg = useMemo(() => aggregateWeeklySets(state.logs, weekStart), [state.logs, weekStart])
  const data = Object.entries(agg).map(([muscle, sets]) => ({ muscle, sets }))
  const under = findUndertrained(agg)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Willkommen zurück</h1>
        <p className="text-sm text-slate-600">Dein Wochenüberblick der Sätze pro Muskel.</p>
      </div>

      <div className="border bg-white rounded-md p-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="muscle" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="sets" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <div className="text-sm font-medium mb-2">Untertrainierte Muskeln</div>
        {under.length === 0 ? (
          <div className="text-sm text-slate-600">Alles im grünen Bereich.</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {under.map((m) => (
              <span key={m} className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">{m}</span>
            ))}
          </div>
        )}
        <div className="mt-3">
          <Link to="/exercises" className="text-sm text-blue-600 underline">Übungen anzeigen</Link>
        </div>
      </div>
    </div>
  )
}



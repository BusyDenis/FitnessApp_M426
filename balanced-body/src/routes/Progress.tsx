import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { useStore } from '../state/store'
import { aggregateWeeklySets } from '../logic/balance'
import { getWeekStart, lastNWeeksStartDates, weekLabel } from '../lib/date'
import { indexExercisesById } from '../state/selectors'
import { downloadCsv, logsToCsv } from '../lib/csv'

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="border bg-white rounded-md p-4 shadow-sm">
      {title && <h2 className="text-lg font-medium mb-2">{title}</h2>}
      {children}
    </div>
  )
}

export default function Progress() {
  const { state } = useStore()
  const weekStart = getWeekStart(new Date())

  const weekly = useMemo(() => aggregateWeeklySets(state.logs, weekStart), [state.logs, weekStart])
  const barData = Object.entries(weekly).map(([muscle, sets]) => ({ muscle, sets }))

  const weeks = lastNWeeksStartDates(6)
  const lineData = weeks.map((ws) => {
    const agg = aggregateWeeklySets(state.logs, ws)
    const total = Object.values(agg).reduce((a, b) => a + b, 0)
    return { label: weekLabel(ws), total }
  })

  function exportCsv() {
    if (!state.logs.length) {
      alert('Keine Daten zum Exportieren.')
      return
    }
    const exIndex = indexExercisesById(state.exercises)
    const csv = logsToCsv(state.logs, exIndex)
    downloadCsv('balanced-body-logs.csv', csv)
  }

  if (!state.logs.length) {
    return (
      <div className="p-6 text-center text-gray-600">
        <p>Keine Trainingsdaten vorhanden.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Fortschritt</h1>

      <Card title="Sets pro Muskelgruppe (diese Woche)">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="muscle" />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(v) => [`${v} Sets`, 'Anzahl']} />
              <Bar dataKey="sets" fill="#34d399" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Gesamtzahl Sets (letzte 6 Wochen)">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(v) => [`${v} Sets`, 'Gesamt']} />
              <Line type="monotone" dataKey="total" stroke="#60a5fa" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <button
        onClick={exportCsv}
        disabled={!state.logs.length}
        className={`bg-slate-800 text-white text-sm px-3 py-2 rounded transition ${
          !state.logs.length ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-700'
        }`}
      >
        CSV exportieren
      </button>
    </div>
  )
}

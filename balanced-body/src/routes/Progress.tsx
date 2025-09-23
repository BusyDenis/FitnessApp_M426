import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { useStore } from '../state/store'
import { aggregateWeeklySets } from '../logic/balance'
import { getWeekStart, lastNWeeksStartDates, weekLabel } from '../lib/date'
import { indexExercisesById } from '../state/selectors'
import { downloadCsv, logsToCsv } from '../lib/csv'

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

  // CSV export — In Arbeit: keep handler but disable UI to reflect status
  function exportCsv() {
    const exIndex = indexExercisesById(state.exercises)
    const csv = logsToCsv(state.logs, exIndex)
    downloadCsv('balanced-body-logs.csv', csv)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Fortschritt</h1>
      <div className="border bg-white rounded-md p-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="muscle" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="sets" fill="#34d399" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="border bg-white rounded-md p-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#60a5fa" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <button className="bg-slate-800 text-white text-sm px-3 py-2 rounded" onClick={exportCsv}>CSV exportieren</button>
    </div>
  )
}



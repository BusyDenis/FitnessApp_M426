import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { useStore } from '../state/store'
import { aggregateWeeklySets } from '../logic/balance'
import { getWeekStart, lastNWeeksStartDates, weekLabel } from '../lib/date'
import { indexExercisesById } from '../state/selectors'
import { downloadCsv, logsToCsv } from '../lib/csv'

export default function Progress() {
  const { state, loading } = useStore()
  const weekStart = getWeekStart(new Date())
  const weekly = useMemo(() => aggregateWeeklySets(state.logs, weekStart), [state.logs, weekStart])
  const barData = Object.entries(weekly).map(([muscle, sets]) => ({ muscle, sets }))

  const weeks = lastNWeeksStartDates(6)
  const lineData = useMemo(() => weeks.map((ws) => {
    const agg = aggregateWeeklySets(state.logs, ws)
    const total = Object.values(agg).reduce((a, b) => a + b, 0)
    return { label: weekLabel(ws), total }
  }), [weeks, state.logs])
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Lädt...</div>
      </div>
    )
  }

  function exportCsv() {
    const exIndex = indexExercisesById(state.exercises)
    const csv = logsToCsv(state.logs, exIndex)
    downloadCsv('balanced-body-logs.csv', csv)
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl h-48">
        <img 
          src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&h=400&fit=crop&q=80" 
          alt="Progress" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-blue-900/80 to-indigo-900/90" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Fortschritt</h1>
            <p className="text-blue-100">Verfolge deine Trainingsentwicklung</p>
          </div>
        </div>
      </div>
      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Aktuelle Woche</h2>
          <div className="h-80">
            {barData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-400">
                <p>Keine Daten</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis 
                    dataKey="muscle" 
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="sets" radius={[8, 8, 0, 0]}>
                    <defs>
                      <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#34d399" />
                      </linearGradient>
                    </defs>
                    <Bar fill="url(#greenGradient)" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">6-Wochen Trend</h2>
          <div className="h-80">
            {lineData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-400">
                <p>Keine Daten</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <XAxis 
                    dataKey="label" 
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
        <button 
          className="w-full bg-gradient-to-r from-slate-700 to-slate-900 text-white text-base font-semibold px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
          onClick={exportCsv}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          CSV exportieren
        </button>
      </div>
    </div>
  )
}



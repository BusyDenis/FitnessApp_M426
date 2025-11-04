import { useMemo, useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useStore } from '../state/store'
import { aggregateWeeklySets, findUndertrained } from '../logic/balance'
import { suggestExercises } from '../logic/planner'
import { getWeekStart } from '../lib/date'
import { Link } from 'react-router-dom'
import { heroImage } from '../lib/images'
import { calculateBMI, classifyBMI, calculateTDEE } from '../lib/calculations'

export default function Dashboard() {
  const { state, loading } = useStore()
  const weekStart = getWeekStart(new Date())
  const agg = useMemo(() => aggregateWeeklySets(state.logs, weekStart), [state.logs, weekStart])
  const data = Object.entries(agg).map(([muscle, sets]) => ({ muscle, sets }))
  const under = findUndertrained(agg)
  const suggestions = useMemo(() => {
    if (under.length === 0 || state.exercises.length === 0) return {}
    return suggestExercises(under, state.exercises)
  }, [under, state.exercises])

  // Load user stats from localStorage (if available)
  const [bmiData, setBmiData] = useState<{ height: number; weight: number } | null>(null)
  const [tdeeData, setTdeeData] = useState<{ height: number; weight: number; age: number; gender: 'male' | 'female'; activity: number } | null>(null)

  useEffect(() => {
    // Try to load BMI data
    const bmiStr = localStorage.getItem('bb_bmi_current')
    if (bmiStr) {
      try {
        setBmiData(JSON.parse(bmiStr))
      } catch {
        // Ignore parse errors
      }
    }
    // Try to load TDEE data
    const tdeeStr = localStorage.getItem('bb_tdee_current')
    if (tdeeStr) {
      try {
        setTdeeData(JSON.parse(tdeeStr))
      } catch {
        // Ignore parse errors
      }
    }
  }, [])
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Lädt...</div>
      </div>
    )
  }

  const totalSets = Object.values(agg).reduce((sum, sets) => sum + sets, 0)
  const bmi = bmiData ? calculateBMI(bmiData.weight, bmiData.height) : null
  const bmiClassification = bmi ? classifyBMI(bmi) : null
  const tdee = tdeeData ? calculateTDEE(tdeeData.weight, tdeeData.height, tdeeData.age, tdeeData.gender, tdeeData.activity) : null

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl h-64 fade-in">
        <img 
          src={heroImage} 
          alt="Fitness Hero" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/80 to-purple-900/90" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Willkommen zurück!</h1>
            <p className="text-blue-100 text-lg">Dein Fitness-Dashboard</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg fade-in">
          <div className="text-3xl font-bold mb-1">{totalSets}</div>
          <div className="text-blue-100 text-sm">Sätze diese Woche</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg fade-in">
          <div className="text-3xl font-bold mb-1">{state.logs.length}</div>
          <div className="text-purple-100 text-sm">Gesamt Workouts</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg fade-in">
          <div className="text-3xl font-bold mb-1">{data.length}</div>
          <div className="text-green-100 text-sm">Trainierte Muskeln</div>
        </div>
        
        {/* BMI Card */}
        <Link to="/bmi" className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg fade-in hover:shadow-xl transition-all">
          {bmi ? (
            <>
              <div className="text-3xl font-bold mb-1">{bmi.toFixed(1)}</div>
              <div className="text-orange-100 text-sm">BMI</div>
              <div className="text-xs text-orange-200 mt-1">{bmiClassification?.category}</div>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold mb-1">BMI</div>
              <div className="text-orange-100 text-xs">Berechnen</div>
            </>
          )}
        </Link>

        {/* TDEE Card */}
        <Link to="/tdee" className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white shadow-lg fade-in hover:shadow-xl transition-all">
          {tdee ? (
            <>
              <div className="text-3xl font-bold mb-1">{tdee}</div>
              <div className="text-pink-100 text-sm">kcal/Tag</div>
              <div className="text-xs text-pink-200 mt-1">TDEE</div>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold mb-1">Kalorien</div>
              <div className="text-pink-100 text-xs">Berechnen</div>
            </>
          )}
        </Link>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 fade-in">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Wöchentliche Übersicht</h2>
        <div className="h-80">
          {data.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <svg className="w-16 h-16 mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-lg font-medium">Noch keine Trainingsdaten</p>
              <p className="text-sm">Starte dein erstes Workout!</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis 
                  dataKey="muscle" 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  allowDecimals={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="sets" 
                  fill="url(#colorGradient)"
                  radius={[8, 8, 0, 0]}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 fade-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Trainings-Empfehlungen</h2>
          <Link 
            to="/exercises" 
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Alle Übungen →
          </Link>
        </div>
        {under.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-medium text-slate-700 mb-1">Perfekt ausbalanciert! 🎉</p>
            <p className="text-sm text-slate-500">Alle Muskeln sind ausreichend trainiert.</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-slate-600 mb-3">Diese Muskeln benötigen mehr Training:</p>
              <div className="flex flex-wrap gap-2">
                {under.map((m) => (
                  <span 
                    key={m} 
                    className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-medium border border-amber-200"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
            {Object.keys(suggestions).length > 0 && (
              <div className="border-t border-slate-200 pt-4">
                <div className="text-sm font-semibold mb-3 text-slate-700">Empfohlene Übungen:</div>
                <div className="space-y-3">
                  {Object.entries(suggestions).map(([muscle, exercises]) => (
                    <div key={muscle} className="bg-slate-50 rounded-lg p-3">
                      <div className="text-sm font-semibold text-slate-900 mb-2">{muscle}</div>
                      <div className="flex flex-wrap gap-2">
                        {exercises.map((ex) => (
                          <Link 
                            key={ex.id}
                            to={`/exercises/${ex.id}`} 
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors border border-blue-200"
                          >
                            {ex.name}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}



import { useState, useEffect } from 'react'
import { calculateTDEE, activityLevels } from '../lib/calculations'

export default function TDEE() {
  const [height, setHeight] = useState<number>(175)
  const [weight, setWeight] = useState<number>(70)
  const [age, setAge] = useState<number>(30)
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [activityLevel, setActivityLevel] = useState<number>(1.55)

  const tdee = calculateTDEE(weight, height, age, gender, activityLevel)
  const selectedActivity = activityLevels.find((a) => a.value === activityLevel)

  // Recommendations
  const maintenanceCalories = tdee
  const bulkingCalories = tdee + 300
  const cuttingCalories = Math.max(1200, tdee - 400)

  // Load current TDEE data from localStorage on mount
  useEffect(() => {
    const current = localStorage.getItem('bb_tdee_current')
    if (current) {
      try {
        const data = JSON.parse(current)
        if (data.height) setHeight(data.height)
        if (data.weight) setWeight(data.weight)
        if (data.age) setAge(data.age)
        if (data.gender) setGender(data.gender)
        if (data.activity) setActivityLevel(data.activity)
      } catch {
        // Ignore parse errors
      }
    }
  }, [])

  function saveCurrent() {
    localStorage.setItem('bb_tdee_current', JSON.stringify({
      height,
      weight,
      age,
      gender,
      activity: activityLevel
    }))
    alert('TDEE-Daten gespeichert!')
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">TDEE & Kalorien-Rechner</h1>
        <p className="text-slate-600">Berechne deinen täglichen Energiebedarf</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Größe (cm)
            </label>
            <input
              type="number"
              className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              value={height}
              min={50}
              max={250}
              onChange={(e) => setHeight(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Gewicht (kg)
            </label>
            <input
              type="number"
              className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              value={weight}
              min={20}
              max={200}
              step={0.1}
              onChange={(e) => setWeight(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Alter
            </label>
            <input
              type="number"
              className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              value={age}
              min={10}
              max={120}
              onChange={(e) => setAge(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Geschlecht
            </label>
            <select
              className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              value={gender}
              onChange={(e) => setGender(e.target.value as 'male' | 'female')}
            >
              <option value="male">Männlich</option>
              <option value="female">Weiblich</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Aktivitätslevel
          </label>
          <select
            className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            value={activityLevel}
            onChange={(e) => setActivityLevel(Number(e.target.value))}
          >
            {activityLevels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label} - {level.description}
              </option>
            ))}
          </select>
        </div>

        {/* TDEE Result */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-8 text-center text-white mb-6">
          <div className="text-sm font-medium text-blue-100 mb-2">Dein täglicher Energiebedarf</div>
          <div className="text-5xl font-bold mb-2">{tdee} kcal</div>
          <div className="text-sm text-blue-100">
            Basierend auf: {selectedActivity?.label}
          </div>
        </div>

        {/* Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <div className="text-sm font-semibold text-green-700 mb-1">Muskelaufbau</div>
            <div className="text-2xl font-bold text-green-900">+{bulkingCalories}</div>
            <div className="text-xs text-green-600 mt-1">+300 kcal/Tag</div>
            <div className="text-xs text-green-700 mt-2">Für kontrollierten Muskelaufbau</div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <div className="text-sm font-semibold text-blue-700 mb-1">Erhaltung</div>
            <div className="text-2xl font-bold text-blue-900">{maintenanceCalories}</div>
            <div className="text-xs text-blue-600 mt-1">kcal/Tag</div>
            <div className="text-xs text-blue-700 mt-2">Gewicht halten</div>
          </div>

          <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
            <div className="text-sm font-semibold text-orange-700 mb-1">Fettabbau</div>
            <div className="text-2xl font-bold text-orange-900">{cuttingCalories}</div>
            <div className="text-xs text-orange-600 mt-1">-400 kcal/Tag</div>
            <div className="text-xs text-orange-700 mt-2">Gesunde Gewichtsreduktion</div>
          </div>
        </div>

        <button
          onClick={saveCurrent}
          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-all"
        >
          Daten speichern (für Dashboard)
        </button>
      </div>
    </div>
  )
}


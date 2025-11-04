import { useState, useEffect } from 'react'
import { calculateBMI, classifyBMI } from '../lib/calculations'

export default function BMI() {
  const [height, setHeight] = useState<number>(175)
  const [weight, setWeight] = useState<number>(70)
  const [history, setHistory] = useState<{ date: string; bmi: number }[]>([])

  const bmi = calculateBMI(weight, height)
  const classification = classifyBMI(bmi)

  function saveToHistory() {
    const newEntry = {
      date: new Date().toLocaleDateString('de-DE'),
      bmi: Math.round(bmi * 10) / 10
    }
    setHistory([newEntry, ...history].slice(0, 10)) // Keep last 10 entries
    // Save to localStorage
    const key = 'bb_bmi_history'
    const stored = JSON.parse(localStorage.getItem(key) || '[]')
    localStorage.setItem(key, JSON.stringify([newEntry, ...stored].slice(0, 10)))
  }

  // Load history and current values from localStorage on mount
  useEffect(() => {
    const key = 'bb_bmi_history'
    const stored = JSON.parse(localStorage.getItem(key) || '[]')
    setHistory(stored)
    
    // Load current BMI data if available
    const current = localStorage.getItem('bb_bmi_current')
    if (current) {
      try {
        const data = JSON.parse(current)
        if (data.height) setHeight(data.height)
        if (data.weight) setWeight(data.weight)
      } catch {
        // Ignore parse errors
      }
    }
  }, [])

  function saveCurrent() {
    localStorage.setItem('bb_bmi_current', JSON.stringify({ height, weight }))
    alert('BMI-Daten gespeichert!')
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">BMI-Rechner</h1>
        <p className="text-slate-600">Berechne deinen Body-Mass-Index</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Größe (cm)
            </label>
            <input
              type="number"
              className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              value={height}
              min={50}
              max={250}
              onChange={(e) => setHeight(Number(e.target.value))}
            />
            <input
              type="range"
              min="50"
              max="250"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full mt-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Gewicht (kg)
            </label>
            <input
              type="number"
              className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              value={weight}
              min={20}
              max={200}
              step={0.1}
              onChange={(e) => setWeight(Number(e.target.value))}
            />
            <input
              type="range"
              min="20"
              max="200"
              step="0.5"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full mt-2"
            />
          </div>
        </div>

        {/* BMI Result */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-8 text-center text-white mb-6">
          <div className="text-sm font-medium text-blue-100 mb-2">Dein BMI</div>
          <div className="text-6xl font-bold mb-2">{bmi.toFixed(1)}</div>
          <div className={`text-xl font-semibold mb-2 ${classification.color.replace('text-', 'text-white ')}`}>
            {classification.category}
          </div>
          <div className="text-sm text-blue-100">{classification.description}</div>
        </div>

        {/* BMI Scale */}
        <div className="mb-6">
          <div className="text-sm font-medium text-slate-700 mb-2">BMI-Skala</div>
          <div className="relative h-8 bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-500 rounded-full overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-around text-xs font-semibold text-white">
              <span>18.5</span>
              <span>25</span>
              <span>30</span>
            </div>
            {bmi > 0 && (
              <div
                className="absolute top-0 bottom-0 w-1 bg-slate-900 shadow-lg"
                style={{ left: `${Math.min(100, Math.max(0, ((bmi - 15) / 25) * 100))}%` }}
              />
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={saveCurrent}
            className="flex-1 bg-slate-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-slate-700 transition-all"
          >
            Aktuelle Werte speichern
          </button>
          <button
            onClick={saveToHistory}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-all"
          >
            In Verlauf speichern
          </button>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Verlauf</h2>
          <div className="space-y-2">
            {history.map((entry) => (
              <div key={`${entry.date}-${entry.bmi}`} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">{entry.date}</span>
                <span className="font-semibold text-slate-900">BMI: {entry.bmi}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


export type Filter = { muscle: string; equipment: string; difficulty: string }

export function FilterBar({
  muscles,
  filter,
  onChange,
}: Readonly<{
  muscles: string[]
  filter: Filter
  onChange: (f: Filter) => void
}>) {
  const handleMuscleChange = (value: string) => {
    onChange({ ...filter, muscle: value })
  }
  
  const handleEquipmentChange = (value: string) => {
    onChange({ ...filter, equipment: value })
  }
  
  const handleDifficultyChange = (value: string) => {
    onChange({ ...filter, difficulty: value })
  }

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div className="flex flex-col">
        <label htmlFor="filter-muscle" className="text-xs font-semibold text-slate-700 mb-1.5">Muskel</label>
        <select 
          id="filter-muscle"
          className="border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all min-w-[140px]" 
          value={filter.muscle}
          onChange={(e) => handleMuscleChange(e.target.value)}
        >
          <option value="">All</option>
          {muscles.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col">
        <label htmlFor="filter-equipment" className="text-xs font-semibold text-slate-700 mb-1.5">Equipment</label>
        <select 
          id="filter-equipment"
          className="border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all min-w-[140px]" 
          value={filter.equipment}
          onChange={(e) => handleEquipmentChange(e.target.value)}
        >
          <option value="">All</option>
          {['bodyweight','dumbbell','barbell','machine','cable','bench','bar','bars'].map((eq) => (
            <option key={eq} value={eq}>{eq}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col">
        <label htmlFor="filter-difficulty" className="text-xs font-semibold text-slate-700 mb-1.5">Schwierigkeit</label>
        <select 
          id="filter-difficulty"
          className="border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all min-w-[140px]" 
          value={filter.difficulty}
          onChange={(e) => handleDifficultyChange(e.target.value)}
        >
          <option value="">All</option>
          {['easy','med','hard'].map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
      {(filter.muscle || filter.equipment || filter.difficulty) && (
        <button 
          className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
          onClick={() => onChange({ muscle: '', equipment: '', difficulty: '' })}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Zurücksetzen
        </button>
      )}
    </div>
  )
}



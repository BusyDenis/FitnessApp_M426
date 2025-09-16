export type Filter = { muscle: string; equipment: string; difficulty: string }

export function FilterBar({
  muscles,
  onChange,
}: {
  muscles: string[]
  onChange: (f: Filter) => void
}) {
  return (
    <div className="flex flex-wrap gap-2 items-end bg-white border rounded-md p-3 mb-3">
      <div className="flex flex-col text-xs">
        <label className="mb-1">Muscle</label>
        <select className="border rounded px-2 py-1 text-sm" onChange={(e) => onChange({ muscle: e.target.value, equipment: '', difficulty: '' })}>
          <option value="">All</option>
          {muscles.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col text-xs">
        <label className="mb-1">Equipment</label>
        <select className="border rounded px-2 py-1 text-sm" onChange={(e) => onChange({ muscle: '', equipment: e.target.value, difficulty: '' })}>
          <option value="">All</option>
          {['bodyweight','dumbbell','barbell','machine','cable','bench','bar','bars'].map((eq) => (
            <option key={eq} value={eq}>{eq}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col text-xs">
        <label className="mb-1">Difficulty</label>
        <select className="border rounded px-2 py-1 text-sm" onChange={(e) => onChange({ muscle: '', equipment: '', difficulty: e.target.value })}>
          <option value="">All</option>
          {['easy','med','hard'].map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
    </div>
  )
}



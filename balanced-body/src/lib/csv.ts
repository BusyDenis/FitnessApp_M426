import type { Exercise, LogEntry } from '../state/store'

function escapeCsv(value: string | number): string {
  const s = String(value)
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replaceAll('"', '""') + '"'
  }
  return s
}

export function logsToCsv(logs: LogEntry[], exercises: Record<string, Exercise>): string {
  const header = ['date', 'exercise', 'sets_total', 'reps_total', 'avg_weight', 'credits_json']
  const rows: string[] = [header.join(',')]
  for (const log of logs) {
    const exercise = exercises[log.exerciseId]
    const setsTotal = log.sets.length
    const repsTotal = log.sets.reduce((sum, s) => sum + s.reps, 0)
    const avgWeight = log.sets.length
      ? (log.sets.reduce((sum, s) => sum + (s.weightKg ?? 0), 0) / log.sets.length).toFixed(1)
      : '0'
    const creditsJson = JSON.stringify(log.credits)
    const row = [
      escapeCsv(log.dateISO),
      escapeCsv(exercise ? exercise.name : log.exerciseId),
      setsTotal,
      repsTotal,
      avgWeight,
      escapeCsv(creditsJson),
    ]
    rows.push(row.join(','))
  }
  return rows.join('\n')
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}



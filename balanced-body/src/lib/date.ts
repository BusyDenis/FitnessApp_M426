export function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay() // 0 Sunday - 6 Saturday
  const diff = (day === 0 ? -6 : 1) - day // Monday as start
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export function isSameWeek(a: Date, b: Date): boolean {
  return getWeekStart(a).getTime() === getWeekStart(b).getTime()
}

export function toISODate(date: Date): string {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

export function lastNWeeksStartDates(n: number, from: Date = new Date()): Date[] {
  const result: Date[] = []
  let start = getWeekStart(from)
  for (let i = 0; i < n; i++) {
    result.unshift(new Date(start))
    start = new Date(start)
    start.setDate(start.getDate() - 7)
  }
  return result
}

export function weekLabel(d: Date): string {
  const start = getWeekStart(d)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  return `${start.toLocaleDateString()} – ${end.toLocaleDateString()}`
}



import type { LogEntry } from '../state/store'
import { getWeekStart, isSameWeek } from '../lib/date'

export function aggregateWeeklySets(logs: LogEntry[], weekStart?: Date): Record<string, number> {
  const week = weekStart ? getWeekStart(weekStart) : getWeekStart(new Date())
  const agg: Record<string, number> = {}
  for (const log of logs) {
    const d = new Date(log.dateISO)
    if (!isSameWeek(d, week)) continue
    for (const credit of log.credits) {
      agg[credit.muscle] = (agg[credit.muscle] || 0) + credit.sets
    }
  }
  return agg
}

export function getWeeklyTrainingDays(logs: LogEntry[], weekStart?: Date): number {
  const week = weekStart ? getWeekStart(weekStart) : getWeekStart(new Date())
  const uniqueDays = new Set<string>()
  for (const log of logs) {
    const d = new Date(log.dateISO)
    if (isSameWeek(d, week)) {
      uniqueDays.add(log.dateISO.split('T')[0])
    }
  }
  return uniqueDays.size
}

export function findUndertrained(agg: Record<string, number>, min = 8): string[] {
  return Object.entries(agg)
    .filter(([, count]) => count < min)
    .map(([muscle]) => muscle)
}

export function findOveremphasized(agg: Record<string, number>, max = 22): string[] {
  return Object.entries(agg)
    .filter(([, count]) => count > max)
    .map(([muscle]) => muscle)
}



export type StorageKey =
    | 'bb_exercises'
    | 'bb_logs'
    | 'bb_user_prefs'
    | 'bb_routines'

export function getJSON<T>(key: StorageKey, fallback: T): T {
    try {
        const raw = localStorage.getItem(key) // string | null
        if (raw == null) return fallback
        return JSON.parse(raw) as T
    } catch {
        return fallback
    }
}

export function setJSON<T>(key: StorageKey, value: T): void {
    try {
        localStorage.setItem(key, JSON.stringify(value))
    } catch {
        // write errors
    }
}

export function remove(key: StorageKey): void {
    try {
        localStorage.removeItem(key)
    } catch {
        // ignore
    }
}
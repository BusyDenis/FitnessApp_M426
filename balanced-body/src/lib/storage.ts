export type StorageKey =
    | 'bb_exercises'
    | 'bb_logs'
    | 'bb_user_prefs'
    | 'bb_routines'   // <-- NEU

export function getJSON<T>(key: StorageKey, fallback: T): T {
    try {
        const raw = localStorage.getItem(key)
        if (!raw) return fallback
        return JSON.parse(raw) as T
    } catch (_err) {
        return fallback
    }
}

export function setJSON<T>(key: StorageKey, value: T): void {
    try {
        localStorage.setItem(key, JSON.stringify(value))
    } catch (_err) {
        // ignore write errors
    }
}

export function remove(key: StorageKey): void {
    try {
        localStorage.removeItem(key)
    } catch (_err) {
        // ignore
    }
}

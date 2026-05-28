export function storageGet<T>(key: string): T | null {
  const raw = localStorage.getItem(key)
  if (!raw) return null
  
  try {
    return JSON.parse(raw) as T
  } catch (error) {
    console.error(`[storageGet] Data korup untuk key "${key}":`, error)
    return [] as unknown as T
  }
}

export function storageSet<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function storageGetOrSeed<T>(key: string, seed: T): T {
  const existing = storageGet<T>(key)
  if (existing) return existing
  storageSet(key, seed)
  return seed
}

export function storageRemove(key: string): void {
  localStorage.removeItem(key)
}

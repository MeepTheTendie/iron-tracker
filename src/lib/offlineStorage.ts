const DB_NAME = 'iron-tracker-db'
const DB_VERSION = 1
const HABIT_STORE = 'pending-habits'

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(HABIT_STORE)) {
        db.createObjectStore(HABIT_STORE, { keyPath: 'id', autoIncrement: true })
      }
    }
  })
}

export interface PendingHabit {
  id?: number
  date: string
  field: string
  value: boolean
  createdAt: number
}

export async function savePendingHabit(habit: Omit<PendingHabit, 'id' | 'createdAt'>): Promise<number> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(HABIT_STORE, 'readwrite')
    const store = transaction.objectStore(HABIT_STORE)
    const request = store.add({ ...habit, createdAt: Date.now() })

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result as number)
  })
}

export async function getPendingHabits(): Promise<Array<PendingHabit>> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(HABIT_STORE, 'readonly')
    const store = transaction.objectStore(HABIT_STORE)
    const request = store.getAll()

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

export async function deletePendingHabit(id: number): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(HABIT_STORE, 'readwrite')
    const store = transaction.objectStore(HABIT_STORE)
    const request = store.delete(id)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

export async function clearOldPendingHabits(olderThan: number): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(HABIT_STORE, 'readwrite')
    const store = transaction.objectStore(HABIT_STORE)
    const request = store.index('createdAt').openCursor(IDBKeyRange.upperBound(olderThan))

    request.onerror = () => reject(request.error)
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result
      if (cursor) {
        cursor.delete()
        cursor.continue()
      } else {
        resolve()
      }
    }
  })
}

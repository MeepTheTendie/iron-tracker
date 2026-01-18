import { useCallback, useEffect, useState } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastCompletedDate: string | null
}

const STREAK_CACHE_KEY = 'iron-tracker-streak'

export function useStreak(habits: Record<string, boolean | null> | null) {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastCompletedDate: null,
  })

  const calculateStreak = useCallback(() => {
    const stored = localStorage.getItem(STREAK_CACHE_KEY)
    if (!stored) {
      const today = new Date().toISOString().split('T')[0]
      setStreakData({
        currentStreak: isTodayComplete(habits) ? 1 : 0,
        longestStreak: 0,
        lastCompletedDate: isTodayComplete(habits) ? today : null,
      })
      return
    }

    const data: StreakData = JSON.parse(stored)
    const today = new Date()
    const lastCompleted = data.lastCompletedDate
      ? new Date(data.lastCompletedDate)
      : null

    const daysSinceLastComplete = lastCompleted
      ? Math.floor(
          (today.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60 * 24),
        )
      : -1

    if (isTodayComplete(habits)) {
      if (daysSinceLastComplete === 0) {
        setStreakData(data)
      } else if (daysSinceLastComplete === 1) {
        const newStreak = data.currentStreak + 1
        const newLongest = Math.max(newStreak, data.longestStreak)
        const updated = {
          currentStreak: newStreak,
          longestStreak: newLongest,
          lastCompletedDate: today.toISOString().split('T')[0],
        }
        setStreakData(updated)
        localStorage.setItem(STREAK_CACHE_KEY, JSON.stringify(updated))
      } else {
        const updated = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastCompletedDate: today.toISOString().split('T')[0],
        }
        setStreakData(updated)
        localStorage.setItem(STREAK_CACHE_KEY, JSON.stringify(updated))
      }
    } else {
      if (daysSinceLastComplete > 1) {
        const updated = {
          currentStreak: 0,
          longestStreak: data.longestStreak,
          lastCompletedDate: data.lastCompletedDate,
        }
        setStreakData(updated)
        localStorage.setItem(STREAK_CACHE_KEY, JSON.stringify(updated))
      }
    }
  }, [habits])

  useEffect(() => {
    calculateStreak()
  }, [calculateStreak])

  return streakData
}

function isTodayComplete(
  habits: Record<string, boolean | null> | null,
): boolean {
  if (!habits) return false
  return (
    habits.am_squats === true &&
    habits.steps_7k === true &&
    habits.bike_1hr === true &&
    habits.pm_squats === true
  )
}

export function StreakDisplay({ streakData }: { streakData: StreakData }) {
  return (
    <div className="flex gap-4 mb-4">
      <div className="bg-orange-100 px-4 py-2 rounded-lg">
        <span className="text-2xl font-bold text-orange-600">
          {streakData.currentStreak}
        </span>
        <span className="text-xs text-orange-500 ml-1">day streak</span>
      </div>
      <div className="bg-amber-100 px-4 py-2 rounded-lg">
        <span className="text-2xl font-bold text-amber-600">
          {streakData.longestStreak}
        </span>
        <span className="text-xs text-amber-500 ml-1">best</span>
      </div>
    </div>
  )
}

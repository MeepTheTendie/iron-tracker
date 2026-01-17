import { useEffect, useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { Check, Flame, Loader2, Trophy, Wifi, WifiOff } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { deletePendingHabit, getPendingHabits, savePendingHabit } from '../lib/offlineStorage'

type HabitField = 'am_squats' | 'steps_7k' | 'bike_1hr' | 'pm_squats'

interface HabitProps {
  label: string
  field: HabitField
  checked: boolean
  isLoading: boolean
}

function HabitRow({ label, field, checked, isLoading }: HabitProps) {
  const handleClick = () => {
    if (!isLoading) {
      document.dispatchEvent(new CustomEvent('toggle-habit', { detail: { field } }))
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200
        ${
          checked
            ? 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 shadow-sm'
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700 active:scale-[0.99]'
        }
        ${isLoading ? 'opacity-60 cursor-wait' : ''}
      `}
      aria-pressed={checked}
      aria-label={`${label}, ${checked ? 'completed' : 'not completed'}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`
          w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors
          ${checked ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 dark:border-gray-600'}
        `}
          role="presentation"
          aria-hidden="true"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-gray-400 dark:text-gray-500 animate-spin" />
          ) : checked ? (
            <Check className="w-4 h-4 text-white" />
          ) : null}
        </div>
        <span
          className={`font-semibold ${checked ? 'text-emerald-900 dark:text-emerald-300' : 'text-gray-700 dark:text-gray-300'}`}
        >
          {label}
        </span>
      </div>
      {checked && (
        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Done</span>
      )}
    </button>
  )
}

interface Habits {
  am_squats: boolean | null
  steps_7k: boolean | null
  bike_1hr: boolean | null
  pm_squats: boolean | null
}

type HabitsOrNull = Habits | null

function areAllHabitsCompleted(habits: HabitsOrNull): boolean {
  if (!habits) return false
  return (
    habits.am_squats === true &&
    habits.steps_7k === true &&
    habits.bike_1hr === true &&
    habits.pm_squats === true
  )
}

function getCompletedCount(habits: HabitsOrNull): number {
  if (!habits) return 0
  let count = 0
  if (habits.am_squats === true) count++
  if (habits.steps_7k === true) count++
  if (habits.bike_1hr === true) count++
  if (habits.pm_squats === true) count++
  return count
}

export function HabitTracker({ habits, date }: { habits: any; date: string }) {
  const router = useRouter()
  const [pendingFields, setPendingFields] = useState<Set<HabitField>>(new Set())
  const [error, setError] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    setIsOnline(navigator.onLine)
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    getPendingHabits().then((pending) => {
      setPendingCount(pending.length)
    })
  }, [pendingFields])

  const allCompleted = areAllHabitsCompleted(habits)
  const completedCount = getCompletedCount(habits)
  const totalHabits = 4

  const toggleHabit = async (field: HabitField) => {
    if (pendingFields.has(field)) return

    const currentValue = habits?.[field] ?? false
    setPendingFields(prev => new Set(prev).add(field))
    setError(null)

    if ('vibrate' in navigator) navigator.vibrate(15)

    const newValue = !currentValue

    if (!navigator.onLine) {
      await savePendingHabit({ date, field, value: newValue })
      setPendingFields(prev => {
        const next = new Set(prev)
        next.delete(field)
        return next
      })
      setPendingCount(prev => prev + 1)
      if ('vibrate' in navigator) navigator.vibrate(30)
      return
    }

    const { error: saveError } = await supabase
      .from('daily_habits')
      .upsert({ date, [field]: newValue }, { onConflict: 'date' })

    setPendingFields(prev => {
      const next = new Set(prev)
      next.delete(field)
      return next
    })

    if (saveError) {
      setError('Failed to save. Tap to retry.')
      console.error('Habit toggle error:', saveError)
    } else {
      router.invalidate()
      if ('vibrate' in navigator) navigator.vibrate(30)
    }
  }

  const syncOfflineHabits = async () => {
    const pending = await getPendingHabits()
    for (const habit of pending) {
      if (!habit.id) continue
      const { error: saveError } = await supabase
        .from('daily_habits')
        .upsert({ date: habit.date, [habit.field]: habit.value }, { onConflict: 'date' })

      if (!saveError) {
        await deletePendingHabit(habit.id)
        setPendingCount(prev => Math.max(0, prev - 1))
      }
    }
    router.invalidate()
  }

  useEffect(() => {
    const handleSync = async () => {
      if (navigator.onLine) {
        await syncOfflineHabits()
      }
    }
    document.addEventListener('sync-habits', handleSync)
    return () => document.removeEventListener('sync-habits', handleSync)
  }, [])

  document.addEventListener('toggle-habit', ((e: CustomEvent<{ field: HabitField }>) => {
    toggleHabit(e.detail.field)
  }) as EventListener)

  if (allCompleted) {
    return (
      <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-6 rounded-2xl shadow-lg mb-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Trophy className="w-8 h-8 text-yellow-300" aria-hidden="true" />
          <h2 className="text-xl font-bold">All Rituals Complete!</h2>
        </div>
        <p className="text-emerald-100">
          Great job! You've completed all your daily habits. See you tomorrow!
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500 fill-orange-500" aria-hidden="true" />
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Daily Rituals</h2>
        </div>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {completedCount}/{totalHabits}
        </span>
      </div>

      {error && (
        <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm" role="alert">
          {error}
        </div>
      )}

      {!isOnline && (
        <div className="mb-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-700 dark:text-amber-300 text-sm flex items-center gap-2" role="alert">
          <WifiOff size={16} aria-hidden="true" />
          <span>You're offline. Changes will sync when connected.</span>
          {pendingCount > 0 && (
            <span className="font-medium">({pendingCount} pending)</span>
          )}
        </div>
      )}

      {isOnline && pendingCount > 0 && (
        <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-700 dark:text-blue-300 text-sm flex items-center gap-2">
          <Wifi size={16} aria-hidden="true" />
          <span>{pendingCount} offline changes pending sync</span>
        </div>
      )}

      <div
        className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full mb-4 overflow-hidden"
        role="progressbar"
        aria-valuenow={completedCount}
        aria-valuemin={0}
        aria-valuemax={totalHabits}
        aria-label="Habit completion progress"
      >
        <div
          className="bg-gradient-to-r from-orange-400 to-emerald-500 h-full transition-all duration-300"
          style={{ width: `${(completedCount / totalHabits) * 100}%` }}
        />
      </div>

      <div className="grid grid-cols-1 gap-3" role="list" aria-label="Habit checklist">
        <HabitRow
          field="am_squats"
          label="15x AM Squats"
          checked={habits?.am_squats || false}
          isLoading={pendingFields.has('am_squats')}
        />
        <HabitRow
          field="steps_7k"
          label="7k Steps"
          checked={habits?.steps_7k || false}
          isLoading={pendingFields.has('steps_7k')}
        />
        <HabitRow
          field="bike_1hr"
          label="1 Hour Bike"
          checked={habits?.bike_1hr || false}
          isLoading={pendingFields.has('bike_1hr')}
        />
        <HabitRow
          field="pm_squats"
          label="15x PM Squats"
          checked={habits?.pm_squats || false}
          isLoading={pendingFields.has('pm_squats')}
        />
      </div>
    </div>
  )
}

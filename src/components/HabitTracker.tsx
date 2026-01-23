import { useEffect, useState } from 'react'
import { Check, Flame, Loader2, Trophy, WifiOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTodayHabits, useToggleHabit, useHabitsCompletion } from '../hooks/useHabits'

type HabitField = 'amSquats' | 'steps7k' | 'bike1hr' | 'pmSquats'

interface HabitProps {
  label: string
  field: HabitField
  checked: boolean
  isLoading: boolean
  onToggle: (field: HabitField) => void
  index: number
}

function HabitRow({ label, field, checked, isLoading, onToggle, index }: HabitProps) {
  const handleClick = () => {
    if (!isLoading) {
      onToggle(field)
    }
  }

  return (
    <motion.button
      onClick={handleClick}
      disabled={isLoading}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`
        w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200
        ${
          checked
            ? 'bg-rose-100 border-rose-300'
            : 'bg-white border-gray-200 hover:border-rose-200'
        }
        ${isLoading ? 'opacity-60 cursor-wait' : ''}
      `}
      aria-pressed={checked}
      aria-label={`${label}, ${checked ? 'completed' : 'not completed'}`}
    >
      <div className="flex items-center gap-3">
        <motion.div
          className={`
          w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-colors
          ${checked ? 'bg-rose-400 border-rose-400' : 'border-gray-300'}
        `}
          role="presentation"
          aria-hidden="true"
          animate={{ scale: checked ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 0.3 }}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
          ) : checked ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <Check className="w-4 h-4 text-white" />
            </motion.div>
          ) : null}
        </motion.div>
        <span
          className={`font-semibold ${checked ? 'text-rose-800' : 'text-gray-700'}`}
        >
          {label}
        </span>
      </div>
      <AnimatePresence>
        {checked && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-xs text-rose-600 font-medium bg-rose-50 px-2 py-1 rounded"
          >
            Done
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

export function HabitTracker({ habits: _habits, date }: { habits?: any; date: string }) {
  const [isOnline, setIsOnline] = useState(true)
  const { data: habits, isPending } = useTodayHabits(date)
  const toggleHabit = useToggleHabit()
  const { completed, count, total } = useHabitsCompletion(habits || null)

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

  const handleToggle = (field: HabitField) => {
    const currentValue = habits?.[field] ?? false
    const newValue = !currentValue

    if ('vibrate' in navigator) navigator.vibrate(15)

    toggleHabit.mutate({ date, field, value: newValue })

    if ('vibrate' in navigator) navigator.vibrate(30)
  }

  const habitsList = [
    { field: 'amSquats' as HabitField, label: '15x AM Squats' },
    { field: 'steps7k' as HabitField, label: '7k Steps' },
    { field: 'bike1hr' as HabitField, label: '1 Hour Bike' },
    { field: 'pmSquats' as HabitField, label: '15x PM Squats' },
  ]

  if (isPending) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 mb-6"
      >
        <div className="bg-rose-50 p-4 rounded-t-2xl border-b border-rose-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                className="w-5 h-5 bg-rose-200 rounded"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="h-6 w-32 bg-rose-200 rounded"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <motion.div
              className="h-6 w-12 bg-rose-200 rounded-full"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </div>
        <div className="p-4 space-y-3">
          <div className="w-full h-2 bg-gray-200 rounded-full" />
          {habitsList.map((i) => (
            <motion.div
              key={i.field}
              className="h-12 bg-gray-100 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            />
          ))}
        </div>
      </motion.div>
    )
  }

  if (completed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-rose-200 p-5 rounded-2xl border-2 border-rose-300 mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Trophy className="w-8 h-8 text-rose-600" aria-hidden="true" />
          </motion.div>
          <h2 className="text-xl font-bold text-rose-800">All Rituals Complete!</h2>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-rose-600 text-sm"
        >
          Great job! See you tomorrow!
        </motion.p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 mb-6"
    >
      <div className="bg-rose-50 p-4 rounded-t-2xl border-b border-rose-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Flame
                className="w-5 h-5 text-rose-500 fill-rose-400"
                aria-hidden="true"
              />
            </motion.div>
            <h2 className="text-lg font-bold text-gray-800">
              Daily Rituals
            </h2>
          </div>
          <motion.span
            key={count}
            initial={{ scale: 1.2, color: '#db2777' }}
            animate={{ scale: 1, color: '#be185d' }}
            className="text-sm font-bold bg-rose-100 px-3 py-1 rounded-full"
          >
            {count}/{total}
          </motion.span>
        </div>
      </div>

      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="px-4 pt-2"
        >
          <div className="mb-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm flex items-center gap-2" role="alert">
            <WifiOff size={16} aria-hidden="true" />
            <span>Offline - changes will sync when connected</span>
          </div>
        </motion.div>
      )}

      <div className="p-4">
        <motion.div
          className="w-full bg-gray-100 h-2 rounded-full mb-4 overflow-hidden"
          role="progressbar"
          aria-valuenow={count}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label="Habit completion progress"
        >
          <motion.div
            data-testid="progress-fill"
            className="bg-rose-400 h-full"
            initial={{ width: 0 }}
            animate={{ width: `${(count / total) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </motion.div>

        <div className="grid grid-cols-1 gap-2" role="list" aria-label="Habit checklist">
          {habitsList.map((item, index) => (
            <HabitRow
              key={item.field}
              field={item.field}
              label={item.label}
              checked={habits?.[item.field] || false}
              isLoading={toggleHabit.isPending && habits?.[item.field] !== (habits?.[item.field] ?? false)}
              onToggle={handleToggle}
              index={index}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

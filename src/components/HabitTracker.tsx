import { useRouter } from '@tanstack/react-router'
import { supabase } from '../lib/supabase'
import { Check, Flame, Trophy } from 'lucide-react'

// This defines what a Habit row looks like
type HabitProps = {
  label: string
  field: 'am_squats' | 'steps_10k' | 'bike_1hr' | 'pm_squats'
  checked: boolean
  date: string
}

function HabitRow({ label, field, checked, date }: HabitProps) {
  const router = useRouter()

  const toggleHabit = async () => {
    const { error } = await supabase
      .from('daily_habits')
      .upsert({ date: date, [field]: !checked }, { onConflict: 'date' })

    if (error) {
      alert('Failed to save habit!')
      console.error(error)
    } else {
      router.invalidate()
    }
  }

  return (
    <button
      onClick={toggleHabit}
      className={`
        w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200
        ${
          checked
            ? 'bg-emerald-100 border-emerald-300 shadow-sm'
            : 'bg-white border-gray-200 hover:border-emerald-200'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <div
          className={`
          w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors
          ${checked ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'}
        `}
        >
          {checked && <Check className="w-4 h-4 text-white" />}
        </div>
        <span
          className={`font-semibold ${checked ? 'text-emerald-900' : 'text-gray-700'}`}
        >
          {label}
        </span>
      </div>
    </button>
  )
}

type Habits = {
  am_squats: boolean | null
  steps_10k: boolean | null
  bike_1hr: boolean | null
  pm_squats: boolean | null
} | null

function areAllHabitsCompleted(habits: Habits): boolean {
  if (!habits) return false
  return (
    habits.am_squats === true &&
    habits.steps_10k === true &&
    habits.bike_1hr === true &&
    habits.pm_squats === true
  )
}

export function HabitTracker({ habits, date }: { habits: any; date: string }) {
  const allCompleted = areAllHabitsCompleted(habits)

  if (allCompleted) {
    return (
      <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-6 rounded-2xl shadow-lg mb-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Trophy className="w-8 h-8 text-yellow-300" />
          <h2 className="text-xl font-bold">All Rituals Complete!</h2>
        </div>
        <p className="text-emerald-100">
          Great job! You've completed all your daily habits. See you tomorrow!
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
        <h2 className="text-lg font-bold text-gray-800">Daily Rituals</h2>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <HabitRow
          date={date}
          field="am_squats"
          label="15x AM Squats"
          checked={habits?.am_squats || false}
        />
        <HabitRow
          date={date}
          field="steps_10k"
          label="7k Steps"
          checked={habits?.steps_10k || false}
        />
        <HabitRow
          date={date}
          field="bike_1hr"
          label="1 Hour Bike"
          checked={habits?.bike_1hr || false}
        />
        <HabitRow
          date={date}
          field="pm_squats"
          label="15x PM Squats"
          checked={habits?.pm_squats || false}
        />
      </div>
    </div>
  )
}

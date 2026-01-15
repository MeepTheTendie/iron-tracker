import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { supabase } from '../lib/supabase'
import { HabitTracker } from '../components/HabitTracker'
import { WorkoutCard } from '../components/WorkoutCard'
import { TrendingUp } from 'lucide-react'

export const Route = createFileRoute('/')({
  loader: async () => {
    const today = new Date()
    const dateStr = today.toISOString().split('T')[0]
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' })

    const { data: habits } = await supabase
      .from('daily_habits')
      .select('*')
      .eq('date', dateStr)
      .single()

    const { data: workout, error } = await supabase
      .from('workouts')
      .select(
        `
        *,
        workout_exercises (
          id,
          sets,
          reps,
          rest_seconds,
          sort_order,
          exercises (
            name,
            notes,
            muscle_group
          )
        )
      `,
      )
      .eq('day_of_week', dayName)
      .single()

    if (workout && workout.workout_exercises) {
      workout.workout_exercises.sort(
        (a: any, b: any) => a.sort_order - b.sort_order,
      )
    }

    if (error && error.code !== 'PGRST116') {
      console.error(error)
    }

    return { habits, workout, dateStr, dayName }
  },
  component: Dashboard,
})

function Dashboard() {
  const { habits, workout, dateStr, dayName } = Route.useLoaderData()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-sans pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <header>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Iron Tracker
          </h1>
          <p className="text-gray-500 font-medium">
            {dayName}, {dateStr}
          </p>
        </header>

        {/* Habit Tracker */}
        <HabitTracker habits={habits} date={dateStr} />

        {/* NEW: History Button */}
        <button
          onClick={() => navigate({ to: '/history' })}
          className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200 shadow-sm hover:border-emerald-200 active:scale-[0.98] transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2.5 rounded-xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="font-bold text-gray-800 text-lg">
                Training History
              </div>
              <div className="text-xs text-gray-500 font-medium">
                View your strength gains
              </div>
            </div>
          </div>
          <div className="text-gray-300 font-bold text-xl pr-2">→</div>
        </button>

        {/* Dynamic Workout Card */}
        <WorkoutCard workout={workout} />
      </div>
    </div>
  )
}

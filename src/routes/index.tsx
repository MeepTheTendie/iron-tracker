import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Dumbbell, TrendingUp } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { HabitTracker } from '../components/HabitTracker'
import { WorkoutCard } from '../components/WorkoutCard'

export const Route = createFileRoute('/')({
  loader: async () => {
    const today = new Date()
    const dateStr = today.toISOString().split('T')[0]
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' })

    const [habitsResult, workoutResult] = await Promise.all([
      supabase.from('daily_habits').select('*').eq('date', dateStr).single(),
      supabase
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
        .single(),
    ])

    const { data: habits } = habitsResult
    const { data: workout, error } = workoutResult

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
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8 font-sans pb-24 flex justify-center">
      <div className="max-w-2xl w-full space-y-6">
        {/* Date - Title is in the header */}
        <p className="text-gray-500 font-medium text-lg">
          {dayName}, {dateStr}
        </p>

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

        {/* Exercise Library Button */}
        <button
          onClick={() => navigate({ to: '/exercises' })}
          className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200 shadow-sm hover:border-emerald-200 active:scale-[0.98] transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="font-bold text-gray-800 text-lg">
                Exercise Library
              </div>
              <div className="text-xs text-gray-500 font-medium">
                View and manage exercises
              </div>
            </div>
          </div>
          <div className="text-gray-300 font-bold text-xl pr-2">→</div>
        </button>
      </div>
    </div>
  )
}

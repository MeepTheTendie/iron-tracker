import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Dumbbell, TrendingUp } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { HabitTracker } from '../components/HabitTracker'
import { WorkoutCard } from '../components/WorkoutCard'
import { HabitsEmptyState, WorkoutEmptyState } from '../components/EmptyState'
import { useState } from 'react'

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
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8 font-sans pb-24 flex justify-center">
      <div className="max-w-2xl w-full space-y-6">
        {/* Date */}
        <p className="text-gray-400 font-medium text-lg text-center">
          {dayName}, {dateStr}
        </p>

        {/* Habit Tracker with Loading State */}
        {habits ? (
          <HabitTracker habits={habits} date={dateStr} />
        ) : isLoading ? (
          <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-5">
            <div className="h-6 w-32 bg-gray-100 rounded animate-pulse mb-4" />
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-lg bg-gray-100 animate-pulse" />
              ))}
            </div>
          </div>
        ) : (
          <HabitsEmptyState onAdd={() => setIsLoading(true)} />
        )}

        {/* History Button - Wes Anderson Style */}
        <button
          onClick={() => navigate({ to: '/history' })}
          className="w-full flex items-center justify-between p-4 bg-violet-100 rounded-2xl border-2 border-violet-200 hover:bg-violet-200 active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-violet-200 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-violet-700" />
            </div>
            <div className="text-left">
              <div className="font-bold text-gray-800 text-lg">
                Training History
              </div>
              <div className="text-xs text-violet-600 font-medium">
                View your strength gains
              </div>
            </div>
          </div>
          <div className="text-violet-300 font-bold text-xl">→</div>
        </button>

        {/* Dynamic Workout Card */}
        {workout ? (
          <WorkoutCard workout={workout} />
        ) : (
          <WorkoutEmptyState onStart={() => navigate({ to: '/workout' })} />
        )}

        {/* Exercise Library Button - Wes Anderson Style */}
        <button
          onClick={() => navigate({ to: '/exercises' })}
          className="w-full flex items-center justify-between p-4 bg-emerald-100 rounded-2xl border-2 border-emerald-200 hover:bg-emerald-200 active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-200 rounded-xl flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-emerald-700" />
            </div>
            <div className="text-left">
              <div className="font-bold text-gray-800 text-lg">
                Exercise Library
              </div>
              <div className="text-xs text-emerald-600 font-medium">
                View and manage exercises
              </div>
            </div>
          </div>
          <div className="text-emerald-300 font-bold text-xl">→</div>
        </button>
      </div>
    </div>
  )
}

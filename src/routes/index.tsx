import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Dumbbell, TrendingUp } from 'lucide-react'
import { useTodayHabits } from '../hooks/useHabits'
import { HabitTracker } from '../components/HabitTracker'
import { WorkoutCard } from '../components/WorkoutCard'

export const Route = createFileRoute('/')({
  loader: async () => {
    const today = new Date()
    const dateStr = today.toISOString().split('T')[0]
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' })

    return { dateStr, dayName }
  },
  component: Dashboard,
})

function Dashboard() {
  const { dateStr, dayName } = Route.useLoaderData()
  const navigate = useNavigate()
  const { data: habits } = useTodayHabits(dateStr)

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8 font-sans pb-24 flex justify-center">
      <div className="max-w-2xl w-full space-y-6">
        <p className="text-gray-400 font-medium text-lg text-center">
          {dayName}, {dateStr}
        </p>

        <HabitTracker habits={habits} date={dateStr} />

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

        <WorkoutCard dateStr={dateStr} dayName={dayName} />

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

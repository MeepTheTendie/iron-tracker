import { createFileRoute } from '@tanstack/react-router'
import { supabase } from '../lib/supabase'
import { HabitTracker } from '../components/HabitTracker'
import { WorkoutCard } from '../components/WorkoutCard'

export const Route = createFileRoute('/')({
  loader: async () => {
    const today = new Date()
    const dateStr = today.toISOString().split('T')[0] // '2026-01-13'
    // Get 'Monday', 'Tuesday', etc.
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' }) 
    
    // 1. Fetch Habits
    const { data: habits } = await supabase
      .from('daily_habits')
      .select('*')
      .eq('date', dateStr)
      .single()

    // 2. Fetch The Program + Exercises (Nested Join)
    const { data: program, error } = await supabase
      .from('programs')
      .select(`
        *,
        program_exercises (
          id,
          sets,
          reps,
          sort_order,
          exercises (
            name,
            notes
          )
        )
      `)
      .eq('day_of_week', dayName)
      .single()

    // Sort the exercises by the 'sort_order' column so they appear in the right sequence
    if (program && program.program_exercises) {
      program.program_exercises.sort((a, b) => a.sort_order - b.sort_order)
    }

    if (error && error.code !== 'PGRST116') { // PGRST116 just means "no rows found", which is fine for rest days
       console.error(error)
    }

    return { habits, program, dateStr, dayName }
  },
  component: Dashboard,
})

function Dashboard() {
  const { habits, program, dateStr, dayName } = Route.useLoaderData()

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-sans pb-20">
      <div className="max-w-md mx-auto space-y-6">
        
        {/* Header */}
        <header>
           <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Iron Tracker</h1>
           <p className="text-gray-500 font-medium">{dayName}, {dateStr}</p>
        </header>
        
        {/* Habit Tracker */}
        <HabitTracker habits={habits} date={dateStr} />

        {/* Dynamic Workout Card */}
        <WorkoutCard program={program} />

      </div>
    </div>
  )
}
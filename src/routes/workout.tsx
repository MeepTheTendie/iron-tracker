import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, CheckCircle2, Save } from 'lucide-react'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

type WorkoutSearch = {
  workoutId?: number
  workoutName?: string
}

export const Route = createFileRoute('/workout')({
  validateSearch: (
    search: Record<string, unknown> | undefined,
  ): WorkoutSearch => {
    return {
      workoutId: (search?.workoutId as number) || undefined,
      workoutName: (search?.workoutName as string) || 'Freestyle',
    }
  },

  loaderDeps: ({ search: { workoutId, workoutName } }) => ({
    workoutId,
    workoutName,
  }),

  loader: async ({ deps }) => {
    if (deps.workoutId) {
      const { data: workout } = await supabase
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
        .eq('id', deps.workoutId)
        .single()

      if (workout?.workout_exercises) {
        workout.workout_exercises.sort(
          (a: any, b: any) => a.sort_order - b.sort_order,
        )
      }

      return { workout }
    }

    return { workout: null }
  },
  component: WorkoutSession,
})

function ExerciseLogger({ item }: { item: any }) {
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState(item.reps.toString())
  const [setsDone, setSetsDone] = useState(0)

  const logSet = async () => {
    if (!weight || !reps) return

    const today = new Date().toISOString().split('T')[0]
    const { error } = await supabase.from('workout_logs').insert({
      date: today,
      exercise_name: item.exercises.name,
      weight: parseFloat(weight),
      reps: parseInt(reps),
    })

    if (!error) {
      setSetsDone((prev) => prev + 1)
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (navigator.vibrate) navigator.vibrate(50)
    }
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-gray-800 text-lg">
            {item.exercises.name}
          </h3>
          {item.exercises.notes && (
            <p className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded inline-block mt-1">
              {item.exercises.notes}
            </p>
          )}
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Target
          </span>
          <div className="font-mono text-sm font-bold text-gray-600">
            {item.sets} x {item.reps}
          </div>
        </div>
      </div>

      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="text-xs text-gray-500 font-bold ml-1">LBS</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="0"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-lg font-bold text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-500 font-bold ml-1">REPS</label>
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-lg font-bold text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        <button
          onClick={logSet}
          className="h-[54px] w-[54px] flex items-center justify-center bg-emerald-600 active:bg-emerald-700 text-white rounded-lg shadow-sm transition-all"
        >
          <Save className="w-6 h-6" />
        </button>
      </div>

      {setsDone > 0 && (
        <div className="mt-3 flex gap-1">
          {Array.from({ length: setsDone }).map((_, i) => (
            <div key={i} className="h-2 flex-1 bg-emerald-500 rounded-full" />
          ))}
          <div className="flex items-center gap-1 text-xs text-emerald-700 font-medium ml-2">
            <CheckCircle2 className="w-3 h-3" /> {setsDone} Sets
          </div>
        </div>
      )}
    </div>
  )
}

function WorkoutSession() {
  const { workout } = Route.useLoaderData()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <div className="bg-gray-900 text-white p-4 sticky top-0 z-10 shadow-md flex items-center gap-4">
        <button
          onClick={() => navigate({ to: '/' })}
          className="p-2 -ml-2 hover:bg-gray-800 rounded-full"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="font-bold text-lg leading-tight">
            {workout?.name || 'Freestyle Session'}
          </h1>
          <p className="text-xs text-gray-400">Focus Mode</p>
        </div>
      </div>

      <div className="p-4">
        {workout?.workout_exercises?.map((item: any) => (
          <ExerciseLogger key={item.id} item={item} />
        ))}

        {!workout && (
          <div className="text-center p-8 text-gray-500">
            <p>No program loaded. You are in freestyle mode.</p>
          </div>
        )}
      </div>

      <div className="p-4">
        <button
          onClick={() => navigate({ to: '/' })}
          className="w-full py-4 bg-gray-800 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform"
        >
          Finish Workout
        </button>
      </div>
    </div>
  )
}

import { Dumbbell, Clock, Info } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

// These types match what Supabase returns from our complicated join query
type ExerciseNode = {
  name: string
  muscle_group: string | null
  notes: string | null
}

type WorkoutExercise = {
  id: number
  sets: number
  reps: number
  rest_seconds: number | null
  exercises: ExerciseNode
}

type WorkoutData = {
  id: number
  name: string
  workout_type: string
  description: string | null
  workout_exercises: WorkoutExercise[]
}

export function WorkoutCard({ workout }: { workout: WorkoutData | null }) {
  const navigate = useNavigate()
  if (!workout) {
    return (
      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-center">
        <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
          <Clock className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-blue-900">Active Recovery Day</h3>
        <p className="text-blue-700 mt-1">
          Focus on your 7k steps and the Bike.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900 p-5 text-white">
        <div className="flex items-center gap-2 mb-1 opacity-80 text-sm font-medium uppercase tracking-wider">
          <Dumbbell className="w-4 h-4" />
          Today's Session
        </div>
        <h2 className="text-2xl font-bold">{workout.name}</h2>
        {workout.description && (
          <p className="text-gray-400 text-sm mt-1">{workout.description}</p>
        )}
      </div>

      {/* Exercise List */}
      <div className="divide-y divide-gray-100">
        {workout.workout_exercises.map((item, index) => (
          <div
            key={item.id}
            className="p-4 flex flex-col gap-2 hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-gray-800 text-lg">
                {index + 1}. {item.exercises.name}
              </h3>
              <div className="text-right">
                <span className="block font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded text-sm">
                  {item.sets} x {item.reps}
                </span>
              </div>
            </div>

            {/* Muscle Group */}
            {item.exercises.muscle_group && (
              <span className="text-xs text-gray-500 uppercase tracking-wide">
                {item.exercises.muscle_group}
              </span>
            )}

            {/* Notes Section */}
            {item.exercises.notes && (
              <div className="flex items-start gap-1.5 text-xs text-amber-700 bg-amber-50 p-2 rounded w-fit">
                <Info className="w-3 h-3 mt-0.5" />
                {item.exercises.notes}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Action */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <button
          onClick={() =>
            navigate({
              to: '/workout',
              search: { workoutId: workout.id, workoutName: workout.name },
            })
          }
          className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 active:scale-[0.98] transition-all"
        >
          Start Workout
        </button>
      </div>
    </div>
  )
}

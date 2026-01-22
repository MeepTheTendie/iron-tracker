import { Clock, Dumbbell, Info, Sparkles } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

type ExerciseNode = {
  name: string
  muscleGroup?: string | null
  notes?: string | null
}

type WorkoutExercise = {
  _id: any
  sets: number
  reps: number
  restSeconds?: number | null
  sortOrder?: number | null
  exercises?: ExerciseNode | null
}

type WorkoutData = {
  _id: any
  name: string
  workoutType: string
  description?: string | null
  workout_exercises: Array<WorkoutExercise>
}

export function WorkoutCard({ workout }: { workout: WorkoutData | null }) {
  const navigate = useNavigate()

  if (!workout) {
    return (
      <div className="bg-sky-100 rounded-2xl p-6 border-2 border-sky-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-sky-200 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-sky-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-sky-800">
              Active Recovery Day
            </h3>
            <p className="text-sky-600 text-sm">Light movement, big gains</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 mb-4">
          <p className="text-gray-700">
            Focus on your 7k steps and the Bike today. Recovery is when muscles
            grow.
          </p>
        </div>
        <button
          onClick={() => navigate({ to: '/workout' })}
          className="w-full flex items-center justify-center gap-2 bg-sky-500 text-white font-bold py-3 rounded-xl hover:bg-sky-600 active:scale-[0.98] transition-all"
        >
          <Sparkles size={20} />
          Start Custom Workout
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 overflow-hidden">
      <div className="bg-amber-100 p-5">
        <div className="flex items-center gap-2 mb-2 text-amber-700 text-sm font-medium uppercase tracking-wider">
          <Dumbbell className="w-4 h-4" />
          Today's Session
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{workout.name}</h2>
        {workout.description && (
          <p className="text-amber-600 text-sm mt-1">{workout.description}</p>
        )}
      </div>

      <div className="divide-y divide-gray-50">
        {workout.workout_exercises?.map((item, index) => (
          <div key={item._id} className="p-4 flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-rose-300 rounded-lg flex items-center justify-center text-rose-800 font-bold text-sm">
                  {index + 1}
                </span>
                <h3 className="font-bold text-gray-800 text-lg">
                  {item.exercises?.name}
                </h3>
              </div>
              <div className="bg-gray-100 px-3 py-1.5 rounded-lg">
                <span className="font-bold text-gray-700">{item.sets}</span>
                <span className="text-gray-400 mx-1">×</span>
                <span className="font-bold text-gray-700">{item.reps}</span>
              </div>
            </div>

            {item.exercises?.muscleGroup && (
              <div className="flex items-center gap-2 ml-11">
                <span className="text-xs px-2.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full uppercase tracking-wide">
                  {item.exercises.muscleGroup}
                </span>
                {item.restSeconds && (
                  <span className="text-xs text-gray-400">
                    {item.restSeconds}s rest
                  </span>
                )}
              </div>
            )}

            {item.exercises?.notes && (
              <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg ml-11 mt-1">
                <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span>{item.exercises.notes}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-50">
        <button
          onClick={() =>
            navigate({
              to: '/workout',
              search: { workoutId: workout._id, workoutName: workout.name },
            })
          }
          className="w-full bg-emerald-400 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-500 active:scale-[0.98] transition-all"
        >
          Start Workout
        </button>
      </div>
    </div>
  )
}

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { supabase } from '../lib/supabase'
import { ArrowLeft, Save, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

// 1. Validation Logic (Updated with Safety Check)
type WorkoutSearch = {
  programName: string
}

export const Route = createFileRoute('/workout')({
  // THE FIX: We allow search to be undefined, and use ?. to access it safely
  validateSearch: (search: Record<string, unknown> | undefined): WorkoutSearch => {
    return {
      programName: (search?.programName as string) || 'Freestyle',
    }
  },
  loader: async ({ search }) => {
    // Fetch the specific exercises for this program
    const { data: program } = await supabase
      .from('programs')
      .select(`
        *,
        program_exercises (
          sets,
          reps,
          sort_order,
          exercises (
            name,
            notes
          )
        )
      `)
      .eq('name', search.programName)
      .single()

    // Sort them
    if (program?.program_exercises) {
        program.program_exercises.sort((a: any, b: any) => a.sort_order - b.sort_order)
    }

    return { program }
  },
  component: WorkoutSession,
})

// 2. The Input Component
function ExerciseLogger({ item }: { item: any }) {
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState(item.reps.toString())
  const [setsDone, setSetsDone] = useState(0)

  const logSet = async () => {
    if (!weight || !reps) return

    const { error } = await supabase.from('workout_logs').insert({
      exercise_name: item.exercises.name,
      weight: parseFloat(weight),
      reps: parseInt(reps),
      set_number: setsDone + 1
    })

    if (!error) {
      setSetsDone(prev => prev + 1)
      if (navigator.vibrate) navigator.vibrate(50) 
    }
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-gray-800 text-lg">{item.exercises.name}</h3>
          {item.exercises.notes && (
            <p className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded inline-block mt-1">
              ⚠️ {item.exercises.notes}
            </p>
          )}
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Target</span>
          <div className="font-mono text-sm font-bold text-gray-600">{item.sets} x {item.reps}</div>
        </div>
      </div>

      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="text-xs text-gray-500 font-bold ml-1">LBS</label>
          <input 
            type="number" 
            value={weight}
            onChange={e => setWeight(e.target.value)}
            placeholder="0"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-lg font-bold text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-500 font-bold ml-1">REPS</label>
          <input 
            type="number" 
            value={reps}
            onChange={e => setReps(e.target.value)}
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

// 3. The Main Page
function WorkoutSession() {
  const { program } = Route.useLoaderData()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <div className="bg-gray-900 text-white p-4 sticky top-0 z-10 shadow-md flex items-center gap-4">
        <button onClick={() => navigate({ to: '/' })} className="p-2 -ml-2 hover:bg-gray-800 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
           <h1 className="font-bold text-lg leading-tight">{program?.name || 'Freestyle Session'}</h1>
           <p className="text-xs text-gray-400">Focus Mode</p>
        </div>
      </div>

      <div className="p-4">
        {program?.program_exercises?.map((item: any) => (
          <ExerciseLogger key={item.id} item={item} />
        ))}

        {!program && (
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
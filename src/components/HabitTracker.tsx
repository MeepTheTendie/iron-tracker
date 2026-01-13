import { useRouter } from '@tanstack/react-router'
import { supabase } from '../lib/supabase'
import { Check, Flame } from 'lucide-react'

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
    // 1. Optimistic Update (Make it feel instant)
    // In a real app we'd use TanStack Mutation, but let's keep it simple for now:
    // We just fire the database request and reload the page data.
    
    const { error } = await supabase
      .from('daily_habits')
      .upsert(
        { date: date, [field]: !checked }, 
        { onConflict: 'date' }
      )

    if (error) {
      alert('Failed to save habit!')
      console.error(error)
    } else {
      // Refresh the data on screen
      router.invalidate()
    }
  }

  return (
    <button 
      onClick={toggleHabit}
      className={`
        w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200
        ${checked 
          ? 'bg-emerald-100 border-emerald-300 shadow-sm' 
          : 'bg-white border-gray-200 hover:border-emerald-200'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`
          w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors
          ${checked ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'}
        `}>
          {checked && <Check className="w-4 h-4 text-white" />}
        </div>
        <span className={`font-semibold ${checked ? 'text-emerald-900' : 'text-gray-700'}`}>
          {label}
        </span>
      </div>
    </button>
  )
}

export function HabitTracker({ habits, date }: { habits: any, date: string }) {
  // If no habits exist yet for today, habits will be null. We treat null as false.
  
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
          label="10k Steps" 
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
import { Plus } from 'lucide-react'

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  color?: 'pink' | 'blue' | 'yellow' | 'green' | 'purple'
}

const colorMap = {
  pink: { bg: 'bg-rose-200', text: 'text-rose-800', light: 'bg-rose-100', accent: 'bg-rose-300' },
  blue: { bg: 'bg-sky-200', text: 'text-sky-800', light: 'bg-sky-100', accent: 'bg-sky-300' },
  yellow: { bg: 'bg-amber-200', text: 'text-amber-800', light: 'bg-amber-100', accent: 'bg-amber-300' },
  green: { bg: 'bg-emerald-200', text: 'text-emerald-800', light: 'bg-emerald-100', accent: 'bg-emerald-300' },
  purple: { bg: 'bg-violet-200', text: 'text-violet-800', light: 'bg-violet-100', accent: 'bg-violet-300' },
}

export function EmptyState({ icon, title, description, action, color = 'blue' }: EmptyStateProps) {
  const colors = colorMap[color]

  return (
    <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 overflow-hidden">
      <div className={`${colors.bg} p-8 text-center`}>
        <div className={`w-16 h-16 ${colors.light} rounded-xl flex items-center justify-center mx-auto mb-4`}>
          {icon}
        </div>
        <h3 className={`text-xl font-bold ${colors.text} mb-2`}>{title}</h3>
        <p className={`${colors.text} opacity-70 text-sm`}>{description}</p>
      </div>
      {action && (
        <div className="p-4">
          <button
            onClick={action.onClick}
            className={`w-full flex items-center justify-center gap-2 ${colors.bg} ${colors.text} font-semibold py-3 px-4 rounded-xl hover:brightness-95 active:scale-[0.98] transition-all`}
          >
            <Plus size={20} />
            {action.label}
          </button>
        </div>
      )}
    </div>
  )
}

export function WorkoutEmptyState({ onStart }: { onStart: () => void }) {
  return (
    <EmptyState
      icon={
        <svg className="w-8 h-8 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      }
      title="No Workout Today"
      description="Take a rest day or start a custom workout"
      action={{ label: 'Start Custom Workout', onClick: onStart }}
      color="blue"
    />
  )
}

export function HabitsEmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <EmptyState
      icon={
        <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      }
      title="No Habits Yet"
      description="Build daily rituals to track your progress"
      action={{ label: 'Add Your First Habit', onClick: onAdd }}
      color="green"
    />
  )
}

export function HistoryEmptyState() {
  return (
    <EmptyState
      icon={
        <svg className="w-8 h-8 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      }
      title="No History Yet"
      description="Complete your first workout to see your progress"
      color="pink"
    />
  )
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { convex } from './convex'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'

// Query Keys
export const queryKeys = {
  habits: {
    all: ['habits'] as const,
    today: (date: string) => ['habits', 'today', date] as const,
  },
  workouts: {
    all: ['workouts'] as const,
    today: (dayOfWeek: string) => ['workouts', 'today', dayOfWeek] as const,
    byId: (id: Id<'workouts'>) => ['workouts', 'id', id] as const,
  },
  exercises: {
    all: ['exercises'] as const,
    byId: (id: Id<'exercises'>) => ['exercises', 'id', id] as const,
  },
  logs: {
    all: ['logs'] as const,
    byDate: (date: string) => ['logs', 'date', date] as const,
    history: (startDate: string, endDate: string) => ['logs', 'history', startDate, endDate] as const,
  },
}

// Habits Hooks
export function useTodayHabits(date: string) {
  return useQuery({
    queryKey: queryKeys.habits.today(date),
    queryFn: async () => {
      if (!convex) throw new Error('Convex not connected')
      return convex.query(api.dailyHabits.getTodayHabits, { date })
    },
    enabled: !!convex && !!date,
  })
}

interface ToggleHabitParams {
  date: string
  field: string
  value: boolean
}

export function useToggleHabit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ date, field, value }: ToggleHabitParams) => {
      if (!convex) throw new Error('Convex not connected')
      return convex.mutation(api.dailyHabits.toggleHabit, { date, field, value })
    },
    onSuccess: (_, { date }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.habits.today(date) })
    },
    onError: (error) => {
      console.error('Failed to toggle habit:', error)
    },
  })
}

// Workouts Hooks
export function useTodayWorkout(dayOfWeek: string) {
  return useQuery({
    queryKey: queryKeys.workouts.today(dayOfWeek),
    queryFn: async () => {
      if (!convex) throw new Error('Convex not connected')
      return convex.query(api.workouts.getTodayWorkout, { dayOfWeek })
    },
    enabled: !!convex && !!dayOfWeek,
  })
}

export function useWorkouts() {
  return useQuery({
    queryKey: queryKeys.workouts.all,
    queryFn: async () => {
      if (!convex) throw new Error('Convex not connected')
      return convex.query(api.workouts.getAll)
    },
    enabled: !!convex,
  })
}

// Exercises Hooks
export function useExercises() {
  return useQuery({
    queryKey: queryKeys.exercises.all,
    queryFn: async () => {
      if (!convex) throw new Error('Convex not connected')
      return convex.query(api.exercises.getAll)
    },
    enabled: !!convex,
  })
}

// Workout Logs Hooks
export function useWorkoutLogs(date: string) {
  return useQuery({
    queryKey: queryKeys.logs.byDate(date),
    queryFn: async () => {
      if (!convex) throw new Error('Convex not connected')
      return convex.query(api.workoutLogs.getByDate, { date })
    },
    enabled: !!convex && !!date,
  })
}

interface LogWorkoutParams {
  date: string
  exerciseName: string
  weight: number
  reps: number
}

export function useLogWorkout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ date, exerciseName, weight, reps }: LogWorkoutParams) => {
      if (!convex) throw new Error('Convex not connected')
      return convex.mutation(api.workoutLogs.logWorkout, { date, exerciseName, weight, reps })
    },
    onSuccess: (_, { date }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.logs.byDate(date) })
      queryClient.invalidateQueries({ queryKey: queryKeys.logs.all })
    },
    onError: (error) => {
      console.error('Failed to log workout:', error)
    },
  })
}

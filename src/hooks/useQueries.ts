import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/query-client'

// Generic Supabase query hook
export function useSupabaseQuery<T>(
  key: Array<string>,
  queryFn: () => Promise<{ data: T | null; error: any }>,
  options?: any,
) {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await queryFn()
      if (error) throw error
      return data
    },
    ...options,
  })
}

// Generic Supabase mutation hook
export function useSupabaseMutation<T>(
  mutationFn: (variables: T) => Promise<{ data: any; error: any }>,
  invalidateQueries?: Array<Array<string>>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (variables: T) => {
      const { data, error } = await mutationFn(variables)
      if (error) throw error
      return data
    },
    onSuccess: () => {
      if (invalidateQueries) {
        invalidateQueries.forEach((keys) => {
          queryClient.invalidateQueries({ queryKey: keys })
        })
      }
    },
  })
}

// Example workout hooks for iron-tracker
export function useWorkouts() {
  return useSupabaseQuery(['workouts'], async () => {
    const { data, error } = await supabase.from('workouts').select('*')
    return { data, error }
  })
}

export function useCreateWorkout() {
  return useSupabaseMutation(
    async (workout: any) => {
      const { data, error } = await supabase.from('workouts').insert(workout)
      return { data, error }
    },
    [['workouts']],
  )
}

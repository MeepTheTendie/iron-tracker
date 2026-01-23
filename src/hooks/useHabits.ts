import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { convex } from '../lib/convex';
import { api } from '../../convex/_generated/api';

type HabitField = 'amSquats' | 'steps7k' | 'bike1hr' | 'pmSquats';

interface HabitsData {
  _id: string;
  _creationTime: number;
  date: string;
  amSquats: boolean;
  steps7k: boolean;
  bike1hr: boolean;
  pmSquats: boolean;
}

type ExerciseNode = {
  name: string;
  muscleGroup?: string | null;
  notes?: string | null;
};

type WorkoutExercise = {
  _id: any;
  sets: number;
  reps: number;
  restSeconds?: number | null;
  sortOrder?: number | null;
  exercises?: ExerciseNode | null;
};

type WorkoutData = {
  _id: any;
  name: string;
  workoutType: string;
  description?: string | null;
  workout_exercises: Array<WorkoutExercise>;
};

export function useTodayHabits(date: string) {
  return useQuery({
    queryKey: ['habits', date],
    queryFn: async () => {
      if (!convex) {
        throw new Error('Convex not connected');
      }
      return await convex.query(api.dailyHabits.getTodayHabits, { date }) as HabitsData | null;
    },
    enabled: !!convex && !!date,
  });
}

export function useTodayWorkout(dayOfWeek: string) {
  return useQuery({
    queryKey: ['workout', dayOfWeek],
    queryFn: async () => {
      if (!convex) {
        throw new Error('Convex not connected');
      }
      return await convex.query(api.workouts.getTodayWorkout, { dayOfWeek }) as WorkoutData | null;
    },
    enabled: !!convex && !!dayOfWeek,
  });
}

export function useToggleHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ date, field, value }: { date: string; field: HabitField; value: boolean }) => {
      if (!convex) {
        throw new Error('Convex not connected');
      }
      return await convex.mutation(api.dailyHabits.toggleHabit, { date, field, value });
    },
    onMutate: async ({ date, field, value }) => {
      await queryClient.cancelQueries({ queryKey: ['habits', date] });
      const previousHabits = queryClient.getQueryData<HabitsData>(['habits', date]);

      queryClient.setQueryData(['habits', date], (old: HabitsData | undefined) => {
        if (!old) {
          return {
            _id: 'temp',
            _creationTime: Date.now(),
            date,
            amSquats: field === 'amSquats' ? value : false,
            steps7k: field === 'steps7k' ? value : false,
            bike1hr: field === 'bike1hr' ? value : false,
            pmSquats: field === 'pmSquats' ? value : false,
          };
        }
        return {
          ...old,
          [field]: value,
        };
      });

      return { previousHabits };
    },
    onError: async (_error, { date }, context) => {
      if (context?.previousHabits) {
        queryClient.setQueryData(['habits', date], context.previousHabits);
      }
    },
    onSettled: async (_data, _error, { date }) => {
      await queryClient.invalidateQueries({ queryKey: ['habits', date] });
    },
  });
}

export function useHabitsCompletion(habits: HabitsData | null) {
  if (!habits) return { completed: false, count: 0, total: 4 };

  const count = [
    habits.amSquats,
    habits.steps7k,
    habits.bike1hr,
    habits.pmSquats,
  ].filter(Boolean).length;

  return {
    completed: count === 4,
    count,
    total: 4,
  };
}

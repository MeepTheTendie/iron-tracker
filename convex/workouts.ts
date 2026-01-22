import { query } from './_generated/server'
import { v } from 'convex/values'

export const getTodayWorkout = query({
  args: { dayOfWeek: v.string() },
  handler: async (ctx, args) => {
    const workout = await ctx.db
      .query('workouts')
      .withIndex('by_day', (q) => q.eq('dayOfWeek', args.dayOfWeek))
      .first()

    if (!workout) return null

    // Get exercises for this workout
    const workoutExercises = await ctx.db
      .query('workoutExercises')
      .withIndex('by_workout', (q) => q.eq('workoutId', workout._id))
      .collect()

    // Get exercise details
    const exercisesWithDetails = await Promise.all(
      workoutExercises.map(async (we) => {
        const exercise = await ctx.db.get(we.exerciseId)
        return {
          _id: we._id,
          sets: we.sets,
          reps: we.reps,
          restSeconds: we.restSeconds,
          sortOrder: we.sortOrder,
          exercises: exercise,
        }
      }),
    )

    return {
      ...workout,
      workout_exercises: exercisesWithDetails,
    }
  },
})

export const getAllWorkouts = query({
  handler: async (ctx) => {
    return await ctx.db.query('workouts').collect()
  },
})

export const getAllExercises = query({
  handler: async (ctx) => {
    return await ctx.db.query('exercises').collect()
  },
})

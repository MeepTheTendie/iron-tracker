import { query } from "./_generated/server";
import { v } from "convex/values";

export const getWorkoutByDay = query({
  args: { dayOfWeek: v.string() },
  handler: async (ctx, args) => {
    const workout = await ctx.db
      .query("workouts")
      .withIndex("by_day", (q) => q.eq("dayOfWeek", args.dayOfWeek))
      .first();

    if (!workout) return null;

    const exercises = await ctx.db
      .query("workoutExercises")
      .withIndex("by_workout_order", (q) => q.eq("workoutId", workout._id))
      .order("asc")
      .collect();

    const fullExercises = await Promise.all(
      exercises.map(async (we) => ({
        ...we,
        exercise: await ctx.db.get(we.exerciseId),
      }))
    );

    return { ...workout, exercises: fullExercises };
  },
});

export const getAllWorkouts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("workouts").collect();
  },
});

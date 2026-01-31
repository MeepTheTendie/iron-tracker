import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const logWorkout = mutation({
  args: {
    date: v.string(),
    exerciseName: v.string(),
    weight: v.number(),
    reps: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = ctx.auth?.userId;
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("workoutLogs", {
      userId,
      ...args,
    });
  },
});

export const getWorkoutLogs = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = ctx.auth?.userId;
    if (!userId) return [];

    return await ctx.db
      .query("workoutLogs")
      .withIndex("by_user_date", (q) => q.eq("userId", userId))
      .filter((q) => q.and(
        q.gte(q.field("date"), args.startDate),
        q.lte(q.field("date"), args.endDate)
      ))
      .order("desc")
      .collect();
  },
});

export const getProgressData = query({
  args: { exerciseName: v.string() },
  handler: async (ctx, args) => {
    const userId = ctx.auth?.userId;
    if (!userId) return [];

    return await ctx.db
      .query("workoutLogs")
      .withIndex("by_user_exercise", (q) => 
        q.eq("userId", userId).eq("exerciseName", args.exerciseName)
      )
      .order("asc")
      .collect();
  },
});

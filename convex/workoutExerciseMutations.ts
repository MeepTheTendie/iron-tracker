import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const insert = internalMutation({
  args: {
    workoutId: v.id("workouts"),
    exerciseId: v.id("exercises"),
    sets: v.number(),
    reps: v.number(),
    restSeconds: v.optional(v.number()),
    sortOrder: v.optional(v.number()),
    phase: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("workoutExercises", args);
  },
});

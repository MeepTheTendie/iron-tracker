import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const insert = internalMutation({
  args: {
    name: v.string(),
    dayOfWeek: v.string(),
    workoutType: v.string(),
    description: v.optional(v.string()),
    phase: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("workouts", args);
  },
});

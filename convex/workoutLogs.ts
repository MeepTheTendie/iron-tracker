import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const insert = mutation({
  args: {
    date: v.string(),
    exerciseName: v.string(),
    weight: v.number(),
    reps: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("workout_logs", args);
  },
});

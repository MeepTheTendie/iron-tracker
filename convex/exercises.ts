import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getExercises = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("exercises").order("asc").collect();
  },
});

export const createExercise = mutation({
  args: {
    name: v.string(),
    muscleGroup: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("exercises", args);
  },
});

export const deleteExercise = mutation({
  args: { id: v.id("exercises") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

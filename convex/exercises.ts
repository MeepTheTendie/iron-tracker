import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("exercises").collect();
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    muscleGroup: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("exercises", args);
  },
});

export const remove = mutation({
  args: {
    id: v.id("exercises"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

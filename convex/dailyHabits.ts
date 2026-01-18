import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getTodayHabits = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const habits = await ctx.db
      .query("dailyHabits")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .first();
    return habits;
  },
});

export const toggleHabit = mutation({
  args: {
    date: v.string(),
    field: v.string(),
    value: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("dailyHabits")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        [args.field]: args.value,
      });
    } else {
      await ctx.db.insert("dailyHabits", {
        date: args.date,
        amSquats: args.field === "amSquats" ? args.value : false,
        steps7k: args.field === "steps7k" ? args.value : false,
        bike1hr: args.field === "bike1hr" ? args.value : false,
        pmSquats: args.field === "pmSquats" ? args.value : false,
      });
    }
    return true;
  },
});

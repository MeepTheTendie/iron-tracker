import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getTodayHabits = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const userId = ctx.auth?.userId;
    if (!userId) return null;

    return await ctx.db
      .query("dailyHabits")
      .withIndex("by_user_date", (q) => q.eq("userId", userId).eq("date", args.date))
      .first();
  },
});

export const toggleHabit = mutation({
  args: {
    date: v.string(),
    field: v.union(
      v.literal("amSquats"),
      v.literal("steps7k"),
      v.literal("bike1hr"),
      v.literal("pmSquats")
    ),
    value: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = ctx.auth?.userId;
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("dailyHabits")
      .withIndex("by_user_date", (q) => q.eq("userId", userId).eq("date", args.date))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { [args.field]: args.value });
      return existing._id;
    } else {
      return await ctx.db.insert("dailyHabits", {
        userId,
        date: args.date,
        amSquats: args.field === "amSquats" ? args.value : false,
        steps7k: args.field === "steps7k" ? args.value : false,
        bike1hr: args.field === "bike1hr" ? args.value : false,
        pmSquats: args.field === "pmSquats" ? args.value : false,
      });
    }
  },
});

export const getHabitHistory = query({
  args: { startDate: v.string(), endDate: v.string() },
  handler: async (ctx, args) => {
    const userId = ctx.auth?.userId;
    if (!userId) return [];

    return await ctx.db
      .query("dailyHabits")
      .withIndex("by_user_date", (q) => q.eq("userId", userId))
      .filter((q) => q.and(
        q.gte(q.field("date"), args.startDate),
        q.lte(q.field("date"), args.endDate)
      ))
      .order("desc")
      .collect();
  },
});

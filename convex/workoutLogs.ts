import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const getWorkoutLogs = query({
  args: { date: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.date) {
      return await ctx.db
        .query('workout_logs')
        .withIndex('by_date', (q) => q.eq('date', args.date!))
        .collect()
    }
    return await ctx.db.query('workout_logs').collect()
  },
})

export const insert = mutation({
  args: {
    date: v.string(),
    exerciseName: v.string(),
    weight: v.number(),
    reps: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('workout_logs', args)
  },
})

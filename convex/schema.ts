import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  
  dailyHabits: defineTable({
    userId: v.id("users"),
    date: v.string(),
    amSquats: v.boolean(),
    steps7k: v.boolean(),
    bike1hr: v.boolean(),
    pmSquats: v.boolean(),
  })
    .index("by_user_date", ["userId", "date"])
    .index("by_date", ["date"]),

  workouts: defineTable({
    name: v.string(),
    dayOfWeek: v.string(),
    description: v.optional(v.string()),
    workoutType: v.optional(v.string()),
  }).index("by_day", ["dayOfWeek"]),

  exercises: defineTable({
    name: v.string(),
    muscleGroup: v.optional(v.string()),
    notes: v.optional(v.string()),
  }),

  workoutExercises: defineTable({
    workoutId: v.id("workouts"),
    exerciseId: v.id("exercises"),
    sets: v.number(),
    reps: v.number(),
    restSeconds: v.optional(v.number()),
    sortOrder: v.number(),
  }).index("by_workout", ["workoutId"])
    .index("by_workout_order", ["workoutId", "sortOrder"]),

  workoutLogs: defineTable({
    userId: v.id("users"),
    date: v.string(),
    exerciseName: v.string(),
    weight: v.number(),
    reps: v.number(),
  })
    .index("by_user_date", ["userId", "date"])
    .index("by_user_exercise", ["userId", "exerciseName"]),
});

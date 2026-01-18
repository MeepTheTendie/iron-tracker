import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  dailyHabits: defineTable({
    date: v.string(), // "YYYY-MM-DD"
    amSquats: v.boolean(),
    steps7k: v.boolean(),
    bike1hr: v.boolean(),
    pmSquats: v.boolean(),
  }).index("by_date", ["date"]),

  workouts: defineTable({
    name: v.string(),
    dayOfWeek: v.string(),
    workoutType: v.string(),
    description: v.optional(v.string()),
    phase: v.optional(v.number()),
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
    sortOrder: v.optional(v.number()),
    phase: v.optional(v.number()),
  }).index("by_workout", ["workoutId"]),

  workout_logs: defineTable({
    date: v.string(),
    exerciseName: v.string(),
    weight: v.number(),
    reps: v.number(),
  }).index("by_date", ["date"]),
});

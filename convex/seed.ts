import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

const workouts = [
  { name: "Upper Body A", dayOfWeek: "Monday", description: "Chest, Shoulders, Triceps focus" },
  { name: "Lower Body A", dayOfWeek: "Wednesday", description: "Legs, Back, Biceps focus" },
  { name: "Upper Body B", dayOfWeek: "Friday", description: "Back, Chest, Shoulders focus" },
  { name: "Lower Body B", dayOfWeek: "Saturday", description: "Legs, Core, Accessories" },
];

const exercises = [
  { name: "Bench Press", muscleGroup: "Chest", notes: "Compound push movement" },
  { name: "Overhead Press", muscleGroup: "Shoulders", notes: "Standing shoulder press" },
  { name: "Incline Dumbbell Press", muscleGroup: "Chest", notes: "Upper chest focus" },
  { name: "Lateral Raises", muscleGroup: "Shoulders", notes: "Isolation for side delts" },
  { name: "Tricep Pushdowns", muscleGroup: "Arms", notes: "Cable tricep isolation" },
  { name: "Dips", muscleGroup: "Chest/Arms", notes: "Bodyweight or weighted" },
  { name: "Deadlift", muscleGroup: "Back/Legs", notes: "The king of lifts" },
  { name: "Barbell Squat", muscleGroup: "Legs", notes: "Core lower body movement" },
  { name: "Pull-Ups", muscleGroup: "Back", notes: "Bodyweight vertical pull" },
  { name: "Barbell Row", muscleGroup: "Back", notes: "Horizontal pulling" },
  { name: "Romanian Deadlift", muscleGroup: "Legs/Back", notes: "Posterior chain focus" },
  { name: "Bicep Curls", muscleGroup: "Arms", notes: "Classic arm builder" },
  { name: "Lat Pulldown", muscleGroup: "Back", notes: "Cable vertical pull" },
  { name: "Cable Row", muscleGroup: "Back", notes: "Seated horizontal pull" },
  { name: "Chest Fly", muscleGroup: "Chest", notes: "Isolation chest stretch" },
  { name: "Face Pulls", muscleGroup: "Shoulders", notes: "Rear delt and posture" },
  { name: "Leg Press", muscleGroup: "Legs", notes: "Machine lower body push" },
  { name: "Leg Curl", muscleGroup: "Legs", notes: "Hamstring isolation" },
  { name: "Leg Extension", muscleGroup: "Legs", notes: "Quad isolation" },
  { name: "Calf Raises", muscleGroup: "Legs", notes: "Standing or seated" },
  { name: "Plank", muscleGroup: "Core", notes: "Static core hold" },
  { name: "Hanging Leg Raises", muscleGroup: "Core", notes: "Abdominal flexion" },
  { name: "Hammer Curls", muscleGroup: "Arms", notes: "Brachialis focus" },
  { name: "Skull Crushers", muscleGroup: "Arms", notes: "Lying tricep extension" },
];

// Workout exercise assignments
const workoutAssignments = {
  "Upper Body A": [
    { exercise: "Bench Press", sets: 4, reps: 8, sortOrder: 1 },
    { exercise: "Overhead Press", sets: 3, reps: 10, sortOrder: 2 },
    { exercise: "Incline Dumbbell Press", sets: 3, reps: 10, sortOrder: 3 },
    { exercise: "Lateral Raises", sets: 3, reps: 15, sortOrder: 4 },
    { exercise: "Tricep Pushdowns", sets: 3, reps: 12, sortOrder: 5 },
    { exercise: "Dips", sets: 3, reps: 10, sortOrder: 6 },
  ],
  "Lower Body A": [
    { exercise: "Deadlift", sets: 3, reps: 5, sortOrder: 1 },
    { exercise: "Barbell Squat", sets: 4, reps: 8, sortOrder: 2 },
    { exercise: "Pull-Ups", sets: 3, reps: 8, sortOrder: 3 },
    { exercise: "Barbell Row", sets: 3, reps: 10, sortOrder: 4 },
    { exercise: "Romanian Deadlift", sets: 3, reps: 10, sortOrder: 5 },
    { exercise: "Bicep Curls", sets: 3, reps: 12, sortOrder: 6 },
  ],
  "Upper Body B": [
    { exercise: "Lat Pulldown", sets: 4, reps: 10, sortOrder: 1 },
    { exercise: "Cable Row", sets: 3, reps: 12, sortOrder: 2 },
    { exercise: "Chest Fly", sets: 3, reps: 12, sortOrder: 3 },
    { exercise: "Face Pulls", sets: 3, reps: 15, sortOrder: 4 },
    { exercise: "Hammer Curls", sets: 3, reps: 12, sortOrder: 5 },
    { exercise: "Skull Crushers", sets: 3, reps: 10, sortOrder: 6 },
  ],
  "Lower Body B": [
    { exercise: "Leg Press", sets: 4, reps: 12, sortOrder: 1 },
    { exercise: "Leg Curl", sets: 3, reps: 12, sortOrder: 2 },
    { exercise: "Leg Extension", sets: 3, reps: 15, sortOrder: 3 },
    { exercise: "Calf Raises", sets: 4, reps: 15, sortOrder: 4 },
    { exercise: "Plank", sets: 3, reps: 60, sortOrder: 5 },
    { exercise: "Hanging Leg Raises", sets: 3, reps: 12, sortOrder: 6 },
  ],
};

export const run = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Clear existing data
    const existingWorkouts = await ctx.db.query("workouts").collect();
    const existingExercises = await ctx.db.query("exercises").collect();
    const existingWorkoutExercises = await ctx.db.query("workoutExercises").collect();
    
    for (const we of existingWorkoutExercises) {
      await ctx.db.delete(we._id);
    }
    for (const w of existingWorkouts) {
      await ctx.db.delete(w._id);
    }
    for (const e of existingExercises) {
      await ctx.db.delete(e._id);
    }

    // Insert exercises
    const exerciseIds = new Map<string, string>();
    for (const ex of exercises) {
      const id = await ctx.db.insert("exercises", ex);
      exerciseIds.set(ex.name, id);
    }

    // Insert workouts and link exercises
    for (const workout of workouts) {
      const workoutId = await ctx.db.insert("workouts", {
        name: workout.name,
        dayOfWeek: workout.dayOfWeek,
        description: workout.description,
      });

      const assignments = workoutAssignments[workout.name as keyof typeof workoutAssignments];
      for (const assignment of assignments) {
        const exerciseId = exerciseIds.get(assignment.exercise);
        if (exerciseId) {
          await ctx.db.insert("workoutExercises", {
            workoutId,
            exerciseId,
            sets: assignment.sets,
            reps: assignment.reps,
            sortOrder: assignment.sortOrder,
          });
        }
      }
    }

    return { workouts: workouts.length, exercises: exercises.length };
  },
});

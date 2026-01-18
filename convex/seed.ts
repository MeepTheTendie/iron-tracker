import { internalMutation } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

export const seed = internalMutation({
  handler: async (ctx) => {
    const exercises = [
      { name: "Push-Ups", muscleGroup: "Chest", notes: "Standard or knee push-ups" },
      { name: "Dumbbell Chest Press", muscleGroup: "Chest", notes: "Use heavy dumbbells" },
      { name: "Dumbbell Shoulder Press", muscleGroup: "Shoulders", notes: "Seated or standing" },
      { name: "Tricep Dumbbell Extension", muscleGroup: "Arms", notes: "Overhead or lying" },
      { name: "Dumbbell Bicep Curl", muscleGroup: "Arms", notes: "Alternating arms" },
      { name: "Goblet Squats", muscleGroup: "Legs", notes: "Hold dumbbell at chest" },
      { name: "Dumbbell Lunges", muscleGroup: "Legs", notes: "Walking lunges" },
      { name: "Romanian Deadlift", muscleGroup: "Hamstrings", notes: "Hinge at hips" },
      { name: "Dumbbell RDL", muscleGroup: "Hamstrings", notes: "Light weight" },
      { name: "Face Pulls", muscleGroup: "Back", notes: "With light dumbbells" },
      { name: "Dumbbell Rows", muscleGroup: "Back", notes: "One arm at a time" },
      { name: "Lat Pulldowns", muscleGroup: "Back", notes: "Use bands if no machine" },
      { name: "Plank", muscleGroup: "Core", notes: "Hold for time" },
      { name: "Crunches", muscleGroup: "Core", notes: "Controlled movement" },
      { name: "Russian Twists", muscleGroup: "Core", notes: "With light weight" },
      { name: "Calf Raises", muscleGroup: "Calves", notes: "Straight and bent knee" },
      { name: "Dead Bug", muscleGroup: "Core", notes: "Slow and controlled" },
      { name: "Bent Over Fly", muscleGroup: "Back", notes: "Light weight, squeeze shoulder blades" },
      { name: "Front Raises", muscleGroup: "Shoulders", notes: "Light weight" },
      { name: "Lateral Raises", muscleGroup: "Shoulders", notes: "Pinkies up" },
      { name: "Bench Press", muscleGroup: "Chest", notes: "If bench available" },
      { name: "Pull-Ups", muscleGroup: "Back", notes: "Assisted if needed" },
      { name: "Dips", muscleGroup: "Chest/Arms", notes: "Bench or bar" },
      { name: "Squats", muscleGroup: "Legs", notes: "Bodyweight or dumbbell" },
    ];

    const exerciseIds: Record<number, Id<"exercises">> = {};
    for (const exercise of exercises) {
      const id = await ctx.db.insert("exercises", exercise);
      const index = Object.keys(exerciseIds).length;
      exerciseIds[index + 1] = id;
    }

    const workoutIds: Record<number, Id<"workouts">> = {};
    const workouts = [
      { name: "Upper Body A", dayOfWeek: "Monday", workoutType: "Strength", description: "Chest, Shoulders, Arms" },
      { name: "Lower Body A", dayOfWeek: "Wednesday", workoutType: "Strength", description: "Quads, Glutes, Hamstrings" },
      { name: "Upper Body B", dayOfWeek: "Friday", workoutType: "Strength", description: "Back, Rear Delts, Core" },
      { name: "Lower Body B", dayOfWeek: "Saturday", workoutType: "Strength", description: "Glutes, Calves" },
    ];

    for (const workout of workouts) {
      const id = await ctx.db.insert("workouts", workout);
      const index = Object.keys(workoutIds).length;
      workoutIds[index + 1] = id;
    }

    const workoutExercises = [
      { workoutId: 1, exerciseId: 1, sets: 3, reps: 10, sortOrder: 0 },
      { workoutId: 1, exerciseId: 2, sets: 3, reps: 10, sortOrder: 1 },
      { workoutId: 1, exerciseId: 3, sets: 3, reps: 10, sortOrder: 2 },
      { workoutId: 1, exerciseId: 4, sets: 3, reps: 10, sortOrder: 3 },
      { workoutId: 1, exerciseId: 5, sets: 3, reps: 10, sortOrder: 4 },
      { workoutId: 1, exerciseId: 13, sets: 3, reps: 30, sortOrder: 5 },
      { workoutId: 2, exerciseId: 24, sets: 4, reps: 12, sortOrder: 0 },
      { workoutId: 2, exerciseId: 7, sets: 3, reps: 10, sortOrder: 1 },
      { workoutId: 2, exerciseId: 8, sets: 3, reps: 10, sortOrder: 2 },
      { workoutId: 2, exerciseId: 16, sets: 3, reps: 15, sortOrder: 3 },
      { workoutId: 2, exerciseId: 17, sets: 3, reps: 10, sortOrder: 4 },
      { workoutId: 2, exerciseId: 14, sets: 3, reps: 15, sortOrder: 5 },
      { workoutId: 3, exerciseId: 10, sets: 3, reps: 12, sortOrder: 0 },
      { workoutId: 3, exerciseId: 11, sets: 3, reps: 10, sortOrder: 1 },
      { workoutId: 3, exerciseId: 12, sets: 3, reps: 10, sortOrder: 2 },
      { workoutId: 3, exerciseId: 18, sets: 3, reps: 12, sortOrder: 3 },
      { workoutId: 3, exerciseId: 20, sets: 3, reps: 12, sortOrder: 4 },
      { workoutId: 3, exerciseId: 19, sets: 3, reps: 12, sortOrder: 5 },
      { workoutId: 4, exerciseId: 6, sets: 4, reps: 12, sortOrder: 0 },
      { workoutId: 4, exerciseId: 7, sets: 3, reps: 12, sortOrder: 1 },
      { workoutId: 4, exerciseId: 8, sets: 3, reps: 12, sortOrder: 2 },
      { workoutId: 4, exerciseId: 16, sets: 4, reps: 15, sortOrder: 3 },
      { workoutId: 4, exerciseId: 9, sets: 3, reps: 12, sortOrder: 4 },
      { workoutId: 4, exerciseId: 15, sets: 3, reps: 20, sortOrder: 5 },
    ];

    for (const we of workoutExercises) {
      await ctx.db.insert("workoutExercises", {
        workoutId: workoutIds[we.workoutId],
        exerciseId: exerciseIds[we.exerciseId],
        sets: we.sets,
        reps: we.reps,
        sortOrder: we.sortOrder,
      });
    }
  },
});

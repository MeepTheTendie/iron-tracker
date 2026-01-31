import type { PageServerLoad } from "./$types";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

const convexUrl = process.env.VITE_CONVEX_URL || "";

export const load: PageServerLoad = async ({ locals, url }) => {
  let convex: ConvexHttpClient | null = null;
  if (convexUrl) {
    convex = new ConvexHttpClient(convexUrl);
  }

  let exercises: any[] = [];
  let progressData: any[] = [];

  const exerciseName = url.searchParams.get("exercise");

  if (convex) {
    try {
      exercises = await convex.query(api.exercises.getExercises, {}) || [];
    } catch (e) {
      console.error("Failed to fetch exercises:", e);
    }

    if (exerciseName) {
      try {
        progressData = await convex.query(api.workoutLogs.getProgressData, { exerciseName }) || [];
      } catch (e) {
        console.error("Failed to fetch progress:", e);
      }
    }
  }

  return {
    exercises,
    progressData,
    selectedExercise: exerciseName || "",
  };
};

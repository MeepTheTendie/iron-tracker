import type { PageServerLoad, Actions } from "./$types";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

const convexUrl = process.env.VITE_CONVEX_URL || "";

export const load: PageServerLoad = async ({ locals }) => {
  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });

  let convex: ConvexHttpClient | null = null;
  if (convexUrl) {
    convex = new ConvexHttpClient(convexUrl);
  }

  let workout = null;

  if (convex) {
    try {
      workout = await convex.query(api.workouts.getWorkoutByDay, { dayOfWeek: dayName });
    } catch (e) {
      console.error("Failed to fetch workout:", e);
    }
  }

  return {
    workout,
    dayName,
  };
};

export const actions: Actions = {
  logSet: async ({ request }) => {
    const data = await request.formData();
    const date = data.get("date") as string;
    const exerciseName = data.get("exerciseName") as string;
    const weight = parseFloat(data.get("weight") as string);
    const reps = parseInt(data.get("reps") as string);

    if (!convexUrl) {
      return { success: false, error: "Convex not configured" };
    }

    const convex = new ConvexHttpClient(convexUrl);

    try {
      await convex.mutation(api.workoutLogs.logWorkout, {
        date,
        exerciseName,
        weight,
        reps,
      });
      return { success: true };
    } catch (e) {
      console.error("Failed to log workout:", e);
      return { success: false, error: "Failed to log workout" };
    }
  },
};

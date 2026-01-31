import type { PageServerLoad, Actions } from "./$types";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

const convexUrl = process.env.VITE_CONVEX_URL || "";

export const load: PageServerLoad = async ({ locals }) => {
  let convex: ConvexHttpClient | null = null;
  if (convexUrl) {
    convex = new ConvexHttpClient(convexUrl);
  }

  let exercises: any[] = [];

  if (convex) {
    try {
      exercises = (await convex.query(api.exercises.getExercises, {})) || [];
    } catch (e) {
      console.error("Failed to fetch exercises:", e);
    }
  }

  return {
    exercises,
  };
};

export const actions: Actions = {
  create: async ({ request }) => {
    const data = await request.formData();
    const name = data.get("name") as string;
    const muscleGroup = data.get("muscleGroup") as string;

    if (!convexUrl) {
      return { success: false, error: "Convex not configured" };
    }

    const convex = new ConvexHttpClient(convexUrl);

    try {
      await convex.mutation(api.exercises.createExercise, {
        name,
        muscleGroup: muscleGroup || undefined,
      });
      return { success: true };
    } catch (e) {
      console.error("Failed to create exercise:", e);
      return { success: false, error: "Failed to create exercise" };
    }
  },

  delete: async ({ request }) => {
    const data = await request.formData();
    const id = data.get("id") as string;

    if (!convexUrl) {
      return { success: false, error: "Convex not configured" };
    }

    const convex = new ConvexHttpClient(convexUrl);

    try {
      await convex.mutation(api.exercises.deleteExercise, { id: id as any });
      return { success: true };
    } catch (e) {
      console.error("Failed to delete exercise:", e);
      return { success: false, error: "Failed to delete exercise" };
    }
  },
};

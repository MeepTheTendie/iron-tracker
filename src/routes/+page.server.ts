import type { PageServerLoad, Actions } from "./$types";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

const convexUrl = process.env.CONVEX_URL || process.env.VITE_CONVEX_URL || "";

export const load: PageServerLoad = async ({ locals }) => {
  const today = new Date();
  const dateStr = today.toISOString().split("T")[0];
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });

  let convex: ConvexHttpClient | null = null;
  if (convexUrl) {
    convex = new ConvexHttpClient(convexUrl);
  }

  let habits = null;
  let workout = null;

  if (convex) {
    try {
      habits = await convex.query(api.dailyHabits.getTodayHabits, { date: dateStr, userId: "demo-user" });
      // Auto-create habits if they don't exist
      if (!habits) {
        await convex.mutation(api.dailyHabits.toggleHabit, {
          date: dateStr,
          field: "amSquats",
          value: false,
          userId: "demo-user",
        });
        habits = await convex.query(api.dailyHabits.getTodayHabits, { date: dateStr, userId: "demo-user" });
      }
    } catch (e) {
      console.error("Failed to fetch habits:", e);
    }

    try {
      workout = await convex.query(api.workouts.getWorkoutByDay, { dayOfWeek: dayName });
    } catch (e) {
      console.error("Failed to fetch workout:", e);
    }
  }

  return {
    habits,
    workout,
    dateStr,
    dayName,
  };
};

export const actions: Actions = {
  toggleHabit: async ({ request }) => {
    const data = await request.formData();
    const date = data.get("date") as string;
    const field = data.get("field") as "amSquats" | "steps7k" | "bike1hr" | "pmSquats";
    const value = data.get("value") === "true";

    if (!convexUrl) {
      return { success: false, error: "Convex not configured" };
    }

    const convex = new ConvexHttpClient(convexUrl);

    try {
      await convex.mutation(api.dailyHabits.toggleHabit, {
        date,
        field,
        value,
        userId: "demo-user",
      });
      return { success: true };
    } catch (e) {
      console.error("Failed to toggle habit:", e);
      return { success: false, error: "Failed to toggle habit" };
    }
  },
};

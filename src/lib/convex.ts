import { browser } from "$app/environment";
import { ConvexClient } from "convex/browser";
import type { ApiFromModules } from "../convex/_generated/api";

// Initialize Convex client (returns null during SSR)
export function createConvexClient(): ConvexClient | null {
  if (!browser) {
    return null;
  }
  const url = import.meta.env.VITE_CONVEX_URL;
  if (!url) {
    throw new Error("VITE_CONVEX_URL is not set");
  }
  return new ConvexClient(url);
}

// Type for the API
export type API = ApiFromModules<{
  auth: typeof import("../convex/auth");
  dailyHabits: typeof import("../convex/dailyHabits");
  exercises: typeof import("../convex/exercises");
  seed: typeof import("../convex/seed");
  workoutLogs: typeof import("../convex/workoutLogs");
  workouts: typeof import("../convex/workouts");
}>;

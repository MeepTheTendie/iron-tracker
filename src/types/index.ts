import { z } from "zod";

export const HabitSchema = z.object({
  amSquats: z.boolean(),
  steps7k: z.boolean(),
  bike1hr: z.boolean(),
  pmSquats: z.boolean(),
});

export type HabitKey = "amSquats" | "steps7k" | "bike1hr" | "pmSquats";

export const HABIT_LABELS: Record<HabitKey, string> = {
  amSquats: "15x AM Squats",
  steps7k: "7k Steps",
  bike1hr: "1 Hour Bike",
  pmSquats: "15x PM Squats",
};

export const HABIT_ORDER: HabitKey[] = ["amSquats", "steps7k", "bike1hr", "pmSquats"];

export interface Workout {
  _id: string;
  name: string;
  dayOfWeek: string;
  description?: string;
}

export interface Exercise {
  _id: string;
  name: string;
  muscleGroup?: string;
  notes?: string;
}

export interface WorkoutExercise {
  _id: string;
  workoutId: string;
  exerciseId: string;
  exercise?: Exercise;
  sets: number;
  reps: number;
  restSeconds?: number;
  order: number;
}

export interface WorkoutLog {
  _id: string;
  date: string;
  exerciseName: string;
  weight: number;
  reps: number;
}

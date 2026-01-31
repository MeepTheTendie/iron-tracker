<script lang="ts">
  import { HabitTracker } from "$components";
  import { WorkoutCard } from "$components";
  import { TrendingUp, Dumbbell, ArrowRight } from "lucide-svelte";

  const today = new Date();
  const dateStr = today.toISOString().split("T")[0];
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
</script>

<svelte:head>
  <title>Iron Tracker - Dashboard</title>
</svelte:head>

<div class="space-y-6">
  <!-- Date Header -->
  <p class="text-gray-400 font-medium text-lg text-center">
    {dayName}, {dateStr}
  </p>

  <!-- Habits -->
  <HabitTracker {dateStr} />

  <!-- History Button -->
  <a
    href="/history"
    class="w-full flex items-center justify-between p-4 bg-violet-100 rounded-2xl border-2 border-violet-200 hover:bg-violet-200 active:scale-[0.98] transition-all"
  >
    <div class="flex items-center gap-3">
      <div class="w-12 h-12 bg-violet-200 rounded-xl flex items-center justify-center">
        <TrendingUp class="w-6 h-6 text-violet-700" />
      </div>
      <div class="text-left">
        <div class="font-bold text-gray-800 text-lg">Training History</div>
        <div class="text-xs text-violet-600 font-medium">View your strength gains</div>
      </div>
    </div>
    <div class="text-violet-300 font-bold text-xl">→</div>
  </a>

  <!-- Workout -->
  <WorkoutCard {dayName} />

  <!-- Exercise Library Button -->
  <a
    href="/exercises"
    class="w-full flex items-center justify-between p-4 bg-emerald-100 rounded-2xl border-2 border-emerald-200 hover:bg-emerald-200 active:scale-[0.98] transition-all"
  >
    <div class="flex items-center gap-3">
      <div class="w-12 h-12 bg-emerald-200 rounded-xl flex items-center justify-center">
        <Dumbbell class="w-6 h-6 text-emerald-700" />
      </div>
      <div class="text-left">
        <div class="font-bold text-gray-800 text-lg">Exercise Library</div>
        <div class="text-xs text-emerald-600 font-medium">View and manage exercises</div>
      </div>
    </div>
    <div class="text-emerald-300 font-bold text-xl">→</div>
  </a>
</div>

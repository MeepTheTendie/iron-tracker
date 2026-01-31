<script lang="ts">
  import { Dumbbell, ArrowRight } from "lucide-svelte";
  import { fly } from "svelte/transition";

  let { dayName, workout } = $props<{
    dayName: string;
    workout: any;
  }>();
</script>

{#if !workout}
  <div class="bg-white rounded-2xl shadow-sm border-2 border-gray-100 mb-6 p-4">
    <div class="animate-pulse space-y-3">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gray-200 rounded-xl"></div>
        <div class="space-y-2">
          <div class="h-5 bg-gray-200 rounded w-32"></div>
          <div class="h-3 bg-gray-100 rounded w-24"></div>
        </div>
      </div>
      <div class="space-y-2 mt-4">
        {#each [1, 2, 3] as _}
          <div class="h-14 bg-gray-100 rounded-xl"></div>
        {/each}
      </div>
    </div>
  </div>
{:else if workout}
  <div in:fly={{ y: 20 }} class="bg-white rounded-2xl shadow-sm border-2 border-gray-100 mb-6">
    <div class="bg-sky-50 p-4 rounded-t-2xl border-b border-sky-100">
      <div class="flex items-center gap-2">
        <div class="w-10 h-10 bg-sky-200 rounded-xl flex items-center justify-center">
          <Dumbbell class="w-6 h-6 text-sky-700" />
        </div>
        <div>
          <h2 class="text-lg font-bold text-gray-800">{workout.name}</h2>
          <p class="text-xs text-sky-600 font-medium">{workout.description}</p>
        </div>
      </div>
    </div>

    <div class="p-4">
      <h3 class="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Today's Exercises</h3>
      <div class="space-y-2">
        {#each workout.exercises as exercise (exercise._id)}
          <div class="flex items-center justify-between p-3 bg-sky-50/50 rounded-xl">
            <div>
              <p class="font-semibold text-gray-800">{exercise.exercise?.name}</p>
              <p class="text-xs text-gray-500">{exercise.exercise?.muscleGroup}</p>
            </div>
            <div class="text-right">
              <p class="font-bold text-sky-700">{exercise.sets} × {exercise.reps}</p>
              <p class="text-xs text-gray-400">sets × reps</p>
            </div>
          </div>
        {/each}
      </div>

      <a
        href="/workout"
        class="mt-4 w-full flex items-center justify-center gap-2 p-4 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 active:scale-[0.98] transition-all"
      >
        Start Workout
        <ArrowRight class="w-5 h-5" />
      </a>
    </div>
  </div>
{:else}
  <div in:fly={{ y: 20 }} class="bg-emerald-50 rounded-2xl border-2 border-emerald-100 p-6 text-center mb-6">
    <div class="w-16 h-16 bg-emerald-200 rounded-full flex items-center justify-center mx-auto mb-3">
      <Dumbbell class="w-8 h-8 text-emerald-700" />
    </div>
    <h2 class="text-xl font-bold text-emerald-800 mb-1">Rest Day</h2>
    <p class="text-emerald-600">Enjoy your recovery. Next workout: {dayName === 'Sunday' ? 'Monday' : 'Tomorrow'}</p>
  </div>
{/if}

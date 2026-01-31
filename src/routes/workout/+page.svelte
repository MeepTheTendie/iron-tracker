<script lang="ts">
  import { Check, ArrowLeft, Clock, Plus } from "lucide-svelte";
  import { fly, fade, scale } from "svelte/transition";
  import { goto } from "$app/navigation";
  import { enhance } from "$app/forms";

  let { data } = $props();

  const today = new Date();
  const dateStr = today.toISOString().split("T")[0];
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });

  let completedExercises = $state<Set<string>>(new Set());
  let activeExercise: string | null = $state(null);
  let weight = $state("");
  let reps = $state("");
  let formSubmitting = $state(false);
</script>

<svelte:head>
  <title>Workout - Iron Tracker</title>
</svelte:head>

<form method="POST" action="?/logSet" use:enhance={() => {
  formSubmitting = true;
  return async ({ result, update }) => {
    if (result.type === 'success') {
      if (weight && reps && activeExercise) {
        completedExercises.add(activeExercise);
        completedExercises = completedExercises;
        weight = "";
        reps = "";
        activeExercise = null;
        if ("vibrate" in navigator) {
          navigator.vibrate([50, 100, 50]);
        }
      }
    }
    formSubmitting = false;
    update();
  };
}} id="logSetForm">
  <input type="hidden" name="date" value={dateStr} />
  <input type="hidden" name="exerciseName" id="logExerciseName" />
  <input type="hidden" name="weight" id="logWeight" />
  <input type="hidden" name="reps" id="logReps" />
</form>

<div class="min-h-screen pb-20">
  <div class="flex items-center gap-4 mb-6">
    <button
      onclick={() => goto("/")}
      class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <ArrowLeft class="w-6 h-6 text-gray-600" />
    </button>
    <div>
      <h1 class="text-2xl font-bold text-gray-800">{data.workout?.name || "Rest Day"}</h1>
      <p class="text-sm text-gray-500">{dayName}</p>
    </div>
  </div>

  {#if !data.workout}
    <div class="space-y-4">
      {#each [1, 2, 3, 4] as i}
        <div class="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-4 animate-pulse">
          <div class="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div class="h-4 bg-gray-100 rounded w-1/4"></div>
        </div>
      {/each}
    </div>
  {:else if data.workout}
    <div class="space-y-4">
      {#each data.workout.exercises as exercise (exercise._id)}
        <div
          in:fly={{ y: 20, delay: exercise.order * 100 }}
          class="bg-white rounded-2xl shadow-sm border-2 border-gray-100 overflow-hidden
            {isCompleted(exercise.exercise?.name || '') ? 'border-emerald-200 bg-emerald-50/30' : ''}"
        >
          <div class="p-4 flex items-center justify-between">
            <div>
              <h3 class="font-bold text-lg text-gray-800">{exercise.exercise?.name}</h3>
              <p class="text-sm text-gray-500">
                {exercise.sets} sets × {exercise.reps} reps
                {#if exercise.restSeconds}
                  • Rest {exercise.restSeconds}s
                {/if}
              </p>
            </div>
            {#if isCompleted(exercise.exercise?.name || '')}
              <div in:scale>
                <Check class="w-8 h-8 text-emerald-500" />
              </div>
            {:else}
              <button
                onclick={() => activeExercise = activeExercise === exercise._id ? null : exercise._id}
                class="p-2 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition-colors"
              >
                <Plus class="w-5 h-5" />
              </button>
            {/if}
          </div>

          {#if activeExercise === exercise._id}
            <div in:fade class="px-4 pb-4">
              <div class="flex gap-3">
                <div class="flex-1">
                  <label for="weight-input" class="block text-xs font-medium text-gray-500 mb-1">Weight (lbs)</label>
                  <input
                    id="weight-input"
                    type="number"
                    bind:value={weight}
                    placeholder="0"
                    class="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:outline-none text-center font-bold"
                  />
                </div>
                <div class="flex-1">
                  <label for="reps-input" class="block text-xs font-medium text-gray-500 mb-1">Reps</label>
                  <input
                    id="reps-input"
                    type="number"
                    bind:value={reps}
                    placeholder="0"
                    class="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:outline-none text-center font-bold"
                  />
                </div>
              </div>
              <button
                onclick={() => {
                  const form = document.getElementById("logSetForm") as HTMLFormElement;
                  const nameInput = document.getElementById("logExerciseName") as HTMLInputElement;
                  const weightInput = document.getElementById("logWeight") as HTMLInputElement;
                  const repsInput = document.getElementById("logReps") as HTMLInputElement;
                  nameInput.value = exercise.exercise?.name || "";
                  weightInput.value = weight;
                  repsInput.value = reps;
                  form.requestSubmit();
                }}
                disabled={!weight || !reps || formSubmitting}
                class="mt-3 w-full p-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {formSubmitting ? 'Logging...' : 'Log Set'}
              </button>
            </div>
          {/if}
        </div>
      {/each}
    </div>

    {#if completedExercises.size === data.workout.exercises.length}
      <div in:fly={{ y: 20 }} class="mt-6">
        <button
          onclick={() => goto("/")}
          class="w-full p-4 bg-emerald-500 text-white rounded-2xl font-bold text-lg hover:bg-emerald-600 active:scale-[0.98] transition-all"
        >
          Workout Complete!
        </button>
      </div>
    {/if}
  {:else}
    <div in:fade class="text-center py-12">
      <div class="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Clock class="w-10 h-10 text-emerald-600" />
      </div>
      <h2 class="text-2xl font-bold text-gray-800 mb-2">Rest Day</h2>
      <p class="text-gray-500">Take time to recover. Your muscles grow when you rest.</p>
      <button
        onclick={() => goto("/")}
        class="mt-6 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
      >
        Back to Dashboard
      </button>
    </div>
  {/if}
</div>

<script lang="ts" module>
  function isCompleted(exerciseName: string) {
    return false;
  }
</script>

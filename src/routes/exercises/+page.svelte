<script lang="ts">
  import { createConvexClient } from "$lib/convex";
  import { api } from "../../../convex/_generated/api";
  import { Plus, Trash2, Dumbbell } from "lucide-svelte";
  import { fly, fade } from "svelte/transition";

  const client = createConvexClient();
  
  // State for exercises
  let exercises = $state<any[]>([]);
  let exercisesLoading = $state(true);
  let createLoading = $state(false);
  let deleteLoading = $state<string | null>(null);

  // Fetch exercises (only on browser)
  $effect(() => {
    if (!client) {
      exercisesLoading = false;
      return;
    }
    exercisesLoading = true;
    
    const fetchExercises = async () => {
      try {
        const result = await client.query(api.exercises.getExercises, {});
        exercises = result || [];
      } catch (err) {
        console.error("Failed to fetch exercises:", err);
      } finally {
        exercisesLoading = false;
      }
    };
    
    fetchExercises();
  });

  let newName = $state("");
  let newMuscleGroup = $state("");
  let showAddForm = $state(false);

  async function addExercise() {
    if (!client || !newName.trim()) return;

    createLoading = true;
    
    try {
      await client.mutation(api.exercises.createExercise, {
        name: newName.trim(),
        muscleGroup: newMuscleGroup.trim() || undefined,
      });

      newName = "";
      newMuscleGroup = "";
      showAddForm = false;
    } finally {
      createLoading = false;
    }
  }

  async function removeExercise(id: string) {
    if (!client) return;
    
    deleteLoading = id;
    
    try {
      await client.mutation(api.exercises.deleteExercise, { id });
    } finally {
      deleteLoading = null;
    }
  }
</script>

<svelte:head>
  <title>Exercises - Iron Tracker</title>
</svelte:head>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold text-gray-800">Exercise Library</h1>
    <button
      onclick={() => showAddForm = !showAddForm}
      class="p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
    >
      <Plus class="w-6 h-6" />
    </button>
  </div>

  <!-- Add Exercise Form -->
  {#if showAddForm}
    <div in:fly={{ y: -20 }} out:fade class="bg-emerald-50 rounded-2xl border-2 border-emerald-100 p-4">
      <h2 class="font-bold text-emerald-800 mb-3">Add New Exercise</h2>
      <div class="space-y-3">
        <input
          type="text"
          bind:value={newName}
          placeholder="Exercise name"
          class="w-full p-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none"
        />
        <input
          type="text"
          bind:value={newMuscleGroup}
          placeholder="Muscle group (optional)"
          class="w-full p-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none"
        />
        <div class="flex gap-3">
          <button
            onclick={addExercise}
            disabled={!newName.trim() || createLoading}
            class="flex-1 p-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 disabled:opacity-50 transition-colors"
          >
            {createLoading ? 'Adding...' : 'Add Exercise'}
          </button>
          <button
            onclick={() => showAddForm = false}
            class="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Exercise List -->
  {#if exercisesLoading}
    <div class="space-y-3">
      {#each [1, 2, 3, 4] as i}
        <div class="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-4 animate-pulse">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-gray-100 rounded-xl"></div>
            <div class="flex-1">
              <div class="h-5 bg-gray-200 rounded w-32 mb-1"></div>
              <div class="h-3 bg-gray-100 rounded w-20"></div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="space-y-3">
      {#each exercises as exercise (exercise._id)}
        <div
          in:fly={{ y: 20 }}
          class="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-4 flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Dumbbell class="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h3 class="font-bold text-gray-800">{exercise.name}</h3>
              {#if exercise.muscleGroup}
                <p class="text-xs text-emerald-600 font-medium">{exercise.muscleGroup}</p>
              {/if}
            </div>
          </div>
          <button
            onclick={() => removeExercise(exercise._id)}
            disabled={deleteLoading === exercise._id}
            class="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          >
            {#if deleteLoading === exercise._id}
              <div class="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
            {:else}
              <Trash2 class="w-5 h-5" />
            {/if}
          </button>
        </div>
      {/each}
    </div>
  {/if}

  {#if !exercisesLoading && exercises.length === 0}
    <div class="text-center py-12">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Dumbbell class="w-8 h-8 text-gray-400" />
      </div>
      <p class="text-gray-500">No exercises yet. Add your first one above!</p>
    </div>
  {/if}
</div>

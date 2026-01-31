<script lang="ts">
  import { Plus, Trash2, Dumbbell } from "lucide-svelte";
  import { fly, fade } from "svelte/transition";
  import { enhance } from "$app/forms";

  let { data } = $props();

  let newName = $state("");
  let newMuscleGroup = $state("");
  let showAddForm = $state(false);
  let deletingId = $state<string | null>(null);
</script>

<svelte:head>
  <title>Exercises - Iron Tracker</title>
</svelte:head>

<form method="POST" action="?/create" use:enhance={() => {
  return async ({ result, update }) => {
    if (result.type === 'success') {
      newName = "";
      newMuscleGroup = "";
      showAddForm = false;
    }
    update();
  };
}} id="createForm">
  <input type="hidden" name="name" value={newName} />
  <input type="hidden" name="muscleGroup" value={newMuscleGroup} />
</form>

<form method="POST" action="?/delete" use:enhance={() => {
  return async ({ result, update }) => {
    if (result.type === 'success') {
      deletingId = null;
    }
    update();
  };
}} id="deleteForm">
  <input type="hidden" name="id" id="deleteId" value="" />
</form>

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
            onclick={() => {
              if (newName.trim()) {
                (document.getElementById("createForm") as HTMLFormElement).requestSubmit();
              }
            }}
            disabled={!newName.trim()}
            class="flex-1 p-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 disabled:opacity-50 transition-colors"
          >
            Add Exercise
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

  <div class="space-y-3">
    {#each data.exercises as exercise (exercise._id)}
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
          onclick={() => {
            deletingId = exercise._id;
            (document.getElementById("deleteId") as HTMLInputElement).value = exercise._id;
            (document.getElementById("deleteForm") as HTMLFormElement).requestSubmit();
          }}
          disabled={deletingId === exercise._id}
          class="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
        >
          {#if deletingId === exercise._id}
            <div class="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
          {:else}
            <Trash2 class="w-5 h-5" />
          {/if}
        </button>
      </div>
    {/each}
  </div>

  {#if data.exercises.length === 0}
    <div class="text-center py-12">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Dumbbell class="w-8 h-8 text-gray-400" />
      </div>
      <p class="text-gray-500">No exercises yet. Add your first one above!</p>
    </div>
  {/if}
</div>

<script lang="ts">
  import { Check, Flame, Loader2, Trophy } from "lucide-svelte";
  import { fade, fly, scale } from "svelte/transition";

  let { date, habits, onToggle } = $props<{
    date: string;
    habits: any;
    onToggle: (field: "amSquats" | "steps7k" | "bike1hr" | "pmSquats") => void;
  }>();

  let toggleLoading = $state<"amSquats" | "steps7k" | "bike1hr" | "pmSquats" | null>(null);

  const habitList = [
    { field: "amSquats", label: "15x AM Squats" },
    { field: "steps7k", label: "7k Steps" },
    { field: "bike1hr", label: "1 Hour Bike" },
    { field: "pmSquats", label: "15x PM Squats" },
  ] as const;

  const completed = $derived(
    habitList.every(h => habits?.[h.field] ?? false)
  );

  const count = $derived(
    habitList.filter(h => habits?.[h.field]).length
  );

  function handleToggle(field: "amSquats" | "steps7k" | "bike1hr" | "pmSquats") {
    if ("vibrate" in navigator) {
      navigator.vibrate(15);
    }
    toggleLoading = field;
    onToggle(field);
    setTimeout(() => {
      toggleLoading = null;
    }, 500);
  }
</script>

{#if !habits}
  <div class="bg-white rounded-2xl shadow-sm border-2 border-gray-100 mb-6 p-4">
    <div class="animate-pulse space-y-3">
      <div class="h-6 bg-rose-200 rounded w-1/3"></div>
      <div class="h-2 bg-gray-200 rounded-full"></div>
      {#each habitList as _}
        <div class="h-12 bg-gray-100 rounded-lg"></div>
      {/each}
    </div>
  </div>
{:else if completed}
  <div
    in:scale={{ duration: 300 }}
    class="bg-rose-200 p-6 rounded-2xl border-2 border-rose-300 mb-6 text-center"
  >
    <div class="flex items-center justify-center gap-3 mb-2">
      <div in:fly={{ y: -20 }}>
        <Trophy class="w-10 h-10 text-rose-600" />
      </div>
      <h2 class="text-2xl font-bold text-rose-800">All Rituals Complete!</h2>
    </div>
    <p class="text-rose-600">Great job! See you tomorrow!</p>
  </div>
{:else}
  <div
    in:fly={{ y: 20 }}
    class="bg-white rounded-2xl shadow-sm border-2 border-gray-100 mb-6"
  >
    <div class="bg-rose-50 p-4 rounded-t-2xl border-b border-rose-100">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="text-rose-500">
            <Flame class="w-5 h-5 fill-rose-400" />
          </div>
          <h2 class="text-lg font-bold text-gray-800">Daily Rituals</h2>
        </div>
        <span class="text-sm font-bold bg-rose-100 text-rose-700 px-3 py-1 rounded-full">
          {count}/4
        </span>
      </div>
    </div>

    <div class="px-4 pt-4">
      <div class="w-full bg-gray-100 h-2 rounded-full mb-4 overflow-hidden">
        <div
          class="bg-rose-400 h-full transition-all duration-500 ease-out"
          style="width: {(count / 4) * 100}%"
        ></div>
      </div>
    </div>

    <div class="p-4 space-y-2">
      {#each habitList as habit (habit.field)}
        <button
          onclick={() => handleToggle(habit.field)}
          class="w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200
            {habits?.[habit.field]
              ? 'bg-rose-100 border-rose-300'
              : 'bg-white border-gray-200 hover:border-rose-200'}
            {toggleLoading === habit.field ? 'opacity-60 cursor-wait' : ''}"
        >
          <div class="flex items-center gap-3">
            <div class="w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-colors
              {habits?.[habit.field] ? 'bg-rose-400 border-rose-400' : 'border-gray-300'}">
              {#if toggleLoading === habit.field}
                <Loader2 class="w-4 h-4 text-gray-400 animate-spin" />
              {:else if habits?.[habit.field]}
                <Check class="w-4 h-4 text-white" />
              {/if}
            </div>
            <span class="font-semibold {habits?.[habit.field] ? 'text-rose-800' : 'text-gray-700'}">
              {habit.label}
            </span>
          </div>

          {#if habits?.[habit.field]}
            <span in:fade class="text-xs text-rose-600 font-medium bg-rose-50 px-2 py-1 rounded">
              Done
            </span>
          {/if}
        </button>
      {/each}
    </div>
  </div>
{/if}

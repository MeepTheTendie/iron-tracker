<script lang="ts">
  import { createConvexClient } from "$lib/convex";
  import { api } from "../../../convex/_generated/api";
  import { Chart, registerables } from "chart.js";
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";

  Chart.register(...registerables);

  const client = createConvexClient();
  
  // State for exercises list
  let exercises = $state<any[]>([]);
  let exercisesLoading = $state(true);
  
  // State for progress data
  let progressData = $state<any[]>([]);
  let progressLoading = $state(false);
  
  let selectedExercise = $state("");
  let chartCanvas = $state<HTMLCanvasElement | null>(null);
  let chart: Chart | null = null;

  // Fetch exercises list (only on browser)
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

  // Fetch progress data when exercise is selected (only on browser)
  $effect(() => {
    if (!client) {
      progressData = [];
      return;
    }
    
    if (!selectedExercise) {
      progressData = [];
      return;
    }
    
    progressLoading = true;
    
    const fetchProgress = async () => {
      try {
        const result = await client.query(api.workoutLogs.getProgressData, { exerciseName: selectedExercise });
        progressData = result || [];
      } catch (err) {
        console.error("Failed to fetch progress:", err);
      } finally {
        progressLoading = false;
      }
    };
    
    fetchProgress();
  });

  // Update chart when progress data changes
  $effect(() => {
    if (chartCanvas && progressData && progressData.length > 0) {
      if (chart) {
        chart.destroy();
      }

      const data = progressData.map((log) => ({
        x: log.date,
        y: log.weight,
      }));

      chart = new Chart(chartCanvas as HTMLCanvasElement, {
        type: "line",
        data: {
          labels: data.map((d) => new Date(d.x).toLocaleDateString()),
          datasets: [
            {
              label: "Weight (lbs)",
              data: data.map((d) => d.y),
              borderColor: "#fb7185",
              backgroundColor: "rgba(251, 113, 133, 0.1)",
              borderWidth: 3,
              pointBackgroundColor: "#fb7185",
              pointBorderColor: "#fff",
              pointBorderWidth: 2,
              pointRadius: 6,
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            y: {
              beginAtZero: false,
              grid: {
                color: "rgba(0, 0, 0, 0.05)",
              },
            },
            x: {
              grid: {
                display: false,
              },
            },
          },
        },
      });
    }
  });

  onMount(() => {
    return () => {
      chart?.destroy();
    };
  });
</script>

<svelte:head>
  <title>History - Iron Tracker</title>
</svelte:head>

<div class="space-y-6">
  <h1 class="text-2xl font-bold text-gray-800">Training History</h1>

  <!-- Exercise Selector -->
  <div class="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-4">
    <label for="exercise-select" class="block text-sm font-medium text-gray-700 mb-2">Select Exercise</label>
    {#if exercisesLoading}
      <div class="h-12 bg-gray-100 rounded-xl animate-pulse"></div>
    {:else}
      <select
        id="exercise-select"
        bind:value={selectedExercise}
        class="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:outline-none bg-white"
      >
        <option value="">Choose an exercise...</option>
        {#each exercises as exercise}
          <option value={exercise.name}>{exercise.name}</option>
        {/each}
      </select>
    {/if}
  </div>

  <!-- Chart -->
  {#if selectedExercise}
    <div in:fly={{ y: 20 }} class="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-4">
      <h2 class="font-bold text-gray-800 mb-4">{selectedExercise} Progress</h2>
      <div class="h-64">
        <canvas bind:this={chartCanvas}></canvas>
      </div>

      <!-- Stats -->
      {#if progressLoading}
        <div class="grid grid-cols-2 gap-4 mt-4">
          <div class="bg-gray-50 rounded-xl p-3 text-center animate-pulse">
            <div class="h-8 bg-gray-200 rounded w-16 mx-auto mb-1"></div>
            <div class="h-3 bg-gray-100 rounded w-20 mx-auto"></div>
          </div>
          <div class="bg-gray-50 rounded-xl p-3 text-center animate-pulse">
            <div class="h-8 bg-gray-200 rounded w-16 mx-auto mb-1"></div>
            <div class="h-3 bg-gray-100 rounded w-20 mx-auto"></div>
          </div>
        </div>
      {:else if progressData && progressData.length > 0}
        {@const maxWeight = Math.max(...progressData.map((l) => l.weight))}
        {@const totalSets = progressData.length}
        <div class="grid grid-cols-2 gap-4 mt-4">
          <div class="bg-rose-50 rounded-xl p-3 text-center">
            <p class="text-2xl font-bold text-rose-600">{maxWeight}</p>
            <p class="text-xs text-rose-400 font-medium">Max Weight (lbs)</p>
          </div>
          <div class="bg-sky-50 rounded-xl p-3 text-center">
            <p class="text-2xl font-bold text-sky-600">{totalSets}</p>
            <p class="text-xs text-sky-400 font-medium">Total Sets</p>
          </div>
        </div>
      {:else}
        <p class="text-center text-gray-400 py-8">No data yet. Complete some workouts!</p>
      {/if}
    </div>
  {/if}
</div>

<script lang="ts">
  import { Chart, registerables } from "chart.js";
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import { goto } from "$app/navigation";

  Chart.register(...registerables);

  let { data } = $props();

  let selectedExercise = $state("");

  $effect(() => {
    selectedExercise = data.selectedExercise;
  });

  let chartCanvas = $state<HTMLCanvasElement | null>(null);
  let chart: Chart | null = null;

  $effect(() => {
    if (chartCanvas && data.progressData && data.progressData.length > 0) {
      if (chart) {
        chart.destroy();
      }

      const progressData = data.progressData;
      const dataPoints = progressData.map((log: any) => ({
        x: log.date,
        y: log.weight,
      }));

      chart = new Chart(chartCanvas as HTMLCanvasElement, {
        type: "line",
        data: {
          labels: dataPoints.map((d: any) => new Date(d.x).toLocaleDateString()),
          datasets: [
            {
              label: "Weight (lbs)",
              data: dataPoints.map((d: any) => d.y),
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

  function handleSelectChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    const exerciseName = target.value;
    selectedExercise = exerciseName;
    goto(exerciseName ? `?exercise=${encodeURIComponent(exerciseName)}` : "/history");
  }
</script>

<svelte:head>
  <title>History - Iron Tracker</title>
</svelte:head>

<div class="space-y-6">
  <h1 class="text-2xl font-bold text-gray-800">Training History</h1>

  <div class="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-4">
    <label for="exercise-select" class="block text-sm font-medium text-gray-700 mb-2">Select Exercise</label>
    <select
      id="exercise-select"
      value={selectedExercise}
      onchange={handleSelectChange}
      class="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:outline-none bg-white"
    >
      <option value="">Choose an exercise...</option>
      {#each data.exercises as exercise}
        <option value={exercise.name}>{exercise.name}</option>
      {/each}
    </select>
  </div>

  {#if selectedExercise}
    <div in:fly={{ y: 20 }} class="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-4">
      <h2 class="font-bold text-gray-800 mb-4">{selectedExercise} Progress</h2>
      <div class="h-64">
        <canvas bind:this={chartCanvas}></canvas>
      </div>

      {#if data.progressData && data.progressData.length > 0}
        {@const maxWeight = Math.max(...data.progressData.map((l: any) => l.weight))}
        {@const totalSets = data.progressData.length}
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

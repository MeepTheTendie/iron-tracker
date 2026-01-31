<script lang="ts">
  import { Github } from "lucide-svelte";
</script>

<svelte:head>
  <title>Sign In - Iron Tracker</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center px-4">
  <div class="w-full max-w-sm">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
      <p class="text-gray-500">Sign in to track your iron journey</p>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-6">
      <form method="POST" action="/login">
        <button
          type="submit"
          class="w-full flex items-center justify-center gap-3 p-4 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 active:scale-[0.98] transition-all"
        >
          <Github class="w-5 h-5" />
          Continue with GitHub
        </button>
      </form>

      <p class="text-center text-sm text-gray-400 mt-4">
        By signing in, you agree to track your gains
      </p>
    </div>
  </div>
</div>

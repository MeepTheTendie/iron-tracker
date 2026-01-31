# Iron Tracker v2

Svelte 5 + SvelteKit + Convex + GitHub Auth

## Setup Instructions

### 1. Install Dependencies
```bash
bun install
```

### 2. Initialize Convex
```bash
npx convex dev
```
This will:
- Create a Convex project
- Set up the database schema
- Generate API types in `convex/_generated/`

### 3. Set Environment Variables
Create `.env.local`:
```env
VITE_CONVEX_URL=https://your-project.convex.cloud
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

Get your GitHub OAuth credentials:
1. Go to GitHub Settings → Developer Settings → OAuth Apps
2. Create new OAuth App
3. Set Authorization callback URL to: `https://yourdomain.com/api/auth/callback/github`

### 4. Seed Database
```bash
npx convex run seed:run
```

This creates:
- 4 workouts (Upper A, Lower A, Upper B, Lower B)
- 24 exercises with proper associations

### 5. Deploy to Vercel
```bash
vercel --prod
```

Or push to GitHub and connect Vercel to auto-deploy.

## Features

- ✅ Real-time habit tracking with sync across devices
- ✅ GitHub OAuth authentication
- ✅ Day-of-week workout programs
- ✅ Workout logging with set/rep tracking
- ✅ Progress charts with Chart.js
- ✅ Exercise library CRUD
- ✅ Wes Anderson aesthetic (pastel colors)
- ✅ Mobile-first design with bottom navigation
- ✅ Haptic feedback on mobile

## Stack

- **Frontend**: Svelte 5 (runes), SvelteKit, Tailwind CSS v4
- **Backend**: Convex (database + real-time sync + auth)
- **Auth**: Convex Auth with GitHub OAuth
- **Charts**: Chart.js
- **Icons**: Lucide Svelte
- **Animations**: Svelte transitions

## Project Structure

```
src/
  lib/
    components/        # Reusable Svelte components
    server/           # Server-side utilities
  routes/             # SvelteKit routes (file-based)
    +layout.svelte    # Root layout with nav
    +page.svelte      # Dashboard
    workout/          # Active workout logging
    history/          # Progress charts
    exercises/        # Exercise library
convex/
  schema.ts           # Database schema
  auth.ts             # Convex Auth config
  seed.ts             # Database seed data
  dailyHabits.ts      # Habits API
  workouts.ts         # Workouts API
  exercises.ts        # Exercises API
  workoutLogs.ts      # Workout logging API
```

## Development

```bash
# Start dev server (runs Convex dev + Vite)
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

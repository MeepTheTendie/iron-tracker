# Iron Tracker

A modern web application for tracking daily habits and strength training progress. Built with React, Vite, and Supabase.

## Features

- **Daily Habit Tracking**: Track morning/evening squats, daily steps, and bike workouts
- **Workout Programming**: Follow structured workout programs with sets, reps, and exercise notes
- **Progress Visualization**: Interactive charts showing strength gains over time
- **Day-of-Week Programs**: Automatically loads the correct workout based on today's schedule
- **Responsive Design**: Optimized for mobile and desktop use

## Tech Stack

Iron Tracker is built on the modern **TanStack ecosystem** for a best-in-class developer experience and performant user experience:

### TanStack Ecosystem

- **[TanStack Router](https://tanstack.com/router)** (v1.132.0)
  - File-based routing with type-safe route generation
  - Auto-generated route tree (`routeTree.gen.ts`)
  - Loader functions for server-side data fetching
  - Built-in routing devtools panel

- **[TanStack React DevTools](https://tanstack.com/devtools)** (v0.7.0)
  - In-app development panel for debugging
  - Router visualization and state inspection

- **[TanStack React Router DevTools](https://tanstack.com/router)** (v1.132.0)
  - Route tree visualization
  - Route matching and params inspection

### Additional Technologies

- **Frontend**: React 19.2.0 with TypeScript
- **Build Tool**: Vite 7.1.7
- **Styling**: Tailwind CSS 4.0.6
- **Backend**: Supabase (PostgreSQL + auto-generated API)
- **Charts**: Recharts 3.6.0
- **Icons**: Lucide React 0.545.0
- **Testing**: Vitest 3.0.5
- **Code Quality**: ESLint + Prettier

## Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)
- Git

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/iron-tracker.git
cd iron-tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the environment template and add your Supabase credentials:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase URL and anon key:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Where to find your Supabase credentials:**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy the "Project URL" and "anon" public key

### 4. Set Up Supabase Database

Run the SQL commands from `SUPABASE_RLS_FIX.md` in your Supabase SQL Editor to enable Row Level Security.

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

Iron Tracker uses the following Supabase tables:

### `programs`

Workout programs organized by day of week.

| Column      | Type    | Description                         |
| ----------- | ------- | ----------------------------------- |
| id          | integer | Primary key                         |
| name        | text    | Program name (e.g., "Upper Body A") |
| day_of_week | text    | Day name (e.g., "Monday")           |

### `exercises`

Exercise library.

| Column | Type    | Description                  |
| ------ | ------- | ---------------------------- |
| id     | integer | Primary key                  |
| name   | text    | Exercise name                |
| notes  | text    | Optional exercise notes/tips |

### `program_exercises`

Junction table linking programs to exercises.

| Column       | Type    | Description              |
| ------------ | ------- | ------------------------ |
| id           | integer | Primary key              |
| program_id   | integer | Foreign key to programs  |
| exercise_id  | integer | Foreign key to exercises |
| sets         | integer | Number of sets           |
| reps         | integer | Reps per set             |
| rest_seconds | integer | Rest time between sets   |
| sort_order   | integer | Display order            |

### `daily_habits`

Daily habit tracking data.

| Column    | Type    | Description                     |
| --------- | ------- | ------------------------------- |
| date      | date    | Primary key (YYYY-MM-DD format) |
| am_squats | boolean | Morning squats completed        |
| steps_10k | boolean | 10,000 steps reached            |
| bike_1hr  | boolean | 1 hour bike completed           |
| pm_squats | boolean | Evening squats completed        |

### `workout_logs`

Workout log entries for progress tracking.

| Column        | Type    | Description         |
| ------------- | ------- | ------------------- |
| id            | integer | Primary key         |
| date          | date    | Workout date        |
| exercise_name | text    | Name of exercise    |
| weight        | integer | Weight lifted (lbs) |
| reps          | integer | Reps performed      |

## Available Scripts

| Command           | Description                               |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Start development server on port 3000     |
| `npm run build`   | Build for production (outputs to `dist/`) |
| `npm run preview` | Preview production build locally          |
| `npm run test`    | Run tests with Vitest                     |
| `npm run lint`    | Check code with ESLint                    |
| `npm run format`  | Format code with Prettier                 |
| `npm run check`   | Format + lint + type check                |

## Project Structure

```
iron-tracker/
├── src/
│   ├── components/         # Reusable React components
│   │   ├── Header.tsx     # App header with navigation
│   │   ├── HabitTracker.tsx # Daily habit checklist
│   │   └── WorkoutCard.tsx  # Workout display and start button
│   ├── lib/
│   │   └── supabase.ts    # Supabase client configuration
│   ├── routes/            # TanStack Router file-based routes
│   │   ├── __root.tsx     # Root route with layout
│   │   ├── index.tsx      # Dashboard (home page)
│   │   ├── history.tsx    # Progress charts and history
│   │   └── workout.tsx    # Active workout tracking
│   ├── main.tsx           # App entry point
│   ├── routeTree.gen.ts   # Auto-generated router tree
│   └── styles.css         # Tailwind CSS imports
├── public/                # Static assets
│   ├── manifest.json      # PWA manifest
│   ├── robots.txt         # SEO rules
│   └── favicon.ico        # App icon
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── .env.example           # Environment template
├── SUPABASE_RLS_FIX.md    # Database security instructions
└── README.md              # This file
```

## Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - Framework Preset: `Vite` (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Add Environment Variables**
   - Go to Settings → Environment Variables
   - Add `VITE_SUPABASE_URL` with your Supabase URL
   - Add `VITE_SUPABASE_ANON_KEY` with your anon key

4. **Add Custom Domain**
   - Go to Settings → Domains
   - Add `myworkouttracker.xyz`
   - Vercel will automatically provision SSL

5. **Configure Supabase**
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add `https://myworkouttracker.xyz` to Redirect URLs

### Alternative Deployments

**Netlify:**

- Build command: `npm run build`
- Publish directory: `dist`
- Add same environment variables

**Cloudflare Pages:**

- Build command: `npm run build`
- Build output: `/dist`
- Add same environment variables

## Security Setup

**IMPORTANT**: Before deploying, you must enable Row Level Security (RLS) on your Supabase tables to prevent unauthorized access.

See `SUPABASE_RLS_FIX.md` for detailed SQL commands to run in your Supabase SQL Editor.

## TanStack Router Guide

Iron Tracker uses **TanStack Router** for type-safe, file-based routing. This section explains how routing works in the app.

### Route File Structure

Routes are defined as files in `src/routes/`. The file path determines the URL:

| File                     | Route      | Description                           |
| ------------------------ | ---------- | ------------------------------------- |
| `src/routes/__root.tsx`  | `/` (root) | Layout wrapper with Header and Outlet |
| `src/routes/index.tsx`   | `/`        | Dashboard with habits and workout     |
| `src/routes/history.tsx` | `/history` | Progress charts and history           |
| `src/routes/workout.tsx` | `/workout` | Active workout tracking               |

### File-Based Routing

TanStack Router automatically generates routes from files:

```tsx
// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  loader: async () => {
    // Fetch data before rendering
    return { message: 'Hello World' }
  },
  component: IndexPage,
})

function IndexPage() {
  const data = Route.useLoaderData()
  return <div>{data.message}</div>
}
```

### Layout Routes

The root route (`__root.tsx`) wraps all pages with shared UI:

```tsx
// src/routes/__root.tsx
import { Outlet, createRootRoute } from '@tanstack/react-router'
import Header from '../components/Header'

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
    </>
  ),
})
```

The `<Outlet />` component renders child routes.

### Data Loading with Loaders

Each route can define a `loader` function to fetch data before rendering:

```tsx
export const Route = createFileRoute('/history')({
  loader: async () => {
    const { data } = await supabase
      .from('workout_logs')
      .select('date, exercise_name, weight, reps')
      .order('date', { ascending: true })
    return { logs: data }
  },
  component: HistoryPage,
})
```

Access loaded data with the `useLoaderData()` hook:

```tsx
function HistoryPage() {
  const { logs } = Route.useLoaderData()
  return <Chart data={logs} />
}
```

### Programmatic Navigation

Use the `useNavigate` hook for programmatic navigation:

```tsx
import { useNavigate } from '@tanstack/react-router'

function MyComponent() {
  const navigate = useNavigate()

  return (
    <button onClick={() => navigate({ to: '/history' })}>View History</button>
  )
}
```

### Route Search Params

Access URL search parameters:

```tsx
// Route definition with search params
export const Route = createFileRoute('/workout')({
  component: WorkoutPage,
})

// Access params
const search = Route.useSearch() // { programName: "Upper Body A" }
```

### DevTools

TanStack Router DevTools are included in development mode, showing:

- Route tree visualization
- Active route highlighting
- Route params and search params
- Navigation history

---

## Development

### Adding New Routes

Create a new file in `src/routes/`:

```tsx
// src/routes/about.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return <div className="p-4">About Iron Tracker</div>
}
```

The route `/about` is automatically created.

### Adding Components

Components go in `src/components/`. Use the existing components as templates:

```tsx
import { LucideIcon } from 'lucide-react'

interface Props {
  title: string
  icon?: LucideIcon
}

export function MyComponent({ title, icon: Icon }: Props) {
  return (
    <div className="p-4 bg-white rounded-xl shadow-sm">
      {Icon && <Icon className="w-5 h-5" />}
      <h2>{title}</h2>
    </div>
  )
}
```

### Database Changes

When modifying the database schema:

1. Make changes in Supabase Dashboard
2. Update TypeScript interfaces in component files to match
3. Test locally with `npm run dev`
4. Deploy with `npm run build && vercel deploy`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - feel free to use this project for your own purposes.

## Acknowledgments

- **[TanStack](https://tanstack.com)** for the exceptional open-source ecosystem:
  - [TanStack Router](https://tanstack.com/router) for type-safe file-based routing
  - [TanStack DevTools](https://tanstack.com/devtools) for React debugging
  - [TanStack Query](https://tanstack.com/query) for data fetching (recommended for future enhancement)
- [Tailwind CSS](https://tailwindcss.com) for utility-first styling
- [Supabase](https://supabase.com) for backend-as-a-service
- [Recharts](https://recharts.org) for beautiful charts
- [Lucide](https://lucide.dev) for consistent icons

---

**Live Domain**: [https://myworkouttracker.xyz](https://myworkouttracker.xyz)

**Repository**: [https://github.com/yourusername/iron-tracker](https://github.com/yourusername/iron-tracker)

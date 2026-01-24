# 🏋️ Iron Tracker - Bun-Powered

A modern web application for tracking daily habits and strength training progress. Built with React, Vite, Convex, and now **Bun** for lightning-fast development and deployment.

## Features

- **Daily Habit Tracking**: Track morning/evening squats, daily steps, and bike workouts
- **Workout Programming**: Follow structured workout programs with sets, reps, and exercise notes
- **Progress Visualization**: Interactive charts showing strength gains over time
- **Day-of-Week Programs**: Automatically loads the correct workout based on today's schedule
- **Responsive Design**: Optimized for mobile and desktop use
- **⚡ Bun Powered**: Ultra-fast package management and runtime

## Tech Stack

Iron Tracker is built on the modern **TanStack ecosystem** with **Bun** as the package manager:

### Core Technologies

- **Runtime**: **Bun 1.1.33** - Ultra-fast JavaScript runtime
- **Frontend**: React 19.2.0 with TypeScript
- **Build Tool**: Vite 7.1.7
- **Package Manager**: **Bun** (replacing npm for 10x faster installs)
- **Styling**: Tailwind CSS 4.0.6
- **Backend**: Convex (serverless functions + database)
- **Charts**: Recharts 3.6.0
- **Icons**: Lucide React 0.545.0
- **Testing**: Vitest 3.0.5

### TanStack Ecosystem

- **TanStack Router** (v1.132.0) - Type-safe file-based routing
- **TanStack React DevTools** (v0.7.0) - In-app development panel
- **TanStack Query** (v5.0.0) - Server state management

## Prerequisites

- **Bun 1.1.33+** (recommended) or Node.js 18+
- Convex account (free tier works)
- Git

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/iron-tracker.git
cd iron-tracker
```

### 2. Install Dependencies with Bun

```bash
bun install
```

> **Why Bun?** Bun installs dependencies up to 10x faster than npm and provides a built-in bundler, test runner, and more.

### 3. Configure Environment Variables

Copy the environment template and add your Convex credentials:

```bash
cp .env.example .env
```

Edit `.env` and add your Convex URL:

```
VITE_CONVEX_URL=https://your-project-id.convex.cloud
```

**Where to find your Convex credentials:**

1. Run `bunx convex dev` to start Convex locally
2. Your Convex URL will be displayed and auto-configured

### 4. Set Up Convex Database

Run `bunx convex dev` to start Convex locally and automatically set up your database schema.

### 5. Start Development Server with Bun

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts (Bun-Powered)

### Development Commands

```bash
bun run dev          # Start development server with hot reload
bun run start        # Alias for dev
bun run preview      # Preview production build locally
```

### Quality Assurance Commands

```bash
bun run test         # Run unit tests once
bun run test:watch   # Run tests in watch mode
bun run test:coverage # Run tests with coverage report
bun run lint         # Run ESLint code quality checks
bun run lint:fix     # Run ESLint and auto-fix issues
bun run format       # Format code with Prettier
bun run format:check # Check code formatting without fixing
bun run tsc          # Run TypeScript type checking
bun run check        # Run format + lint + type check
bun run check:ci     # Full CI-quality checks (format:check + lint + tsc + test)
```

### Security Commands

```bash
bun run audit        # Run Bun security audit
bun run audit:fix    # Automatically fix security vulnerabilities
bun run security     # Run comprehensive security checks (audit + lint + tsc)
```

### Dependency Management

```bash
bun run deps:check   # Check for outdated dependencies
bun run deps:update  # Update dependencies to latest versions
```

### Performance Commands

```bash
bun run analyze      # Analyze bundle size
bun run perf         # Run performance audit with Lighthouse
```

### Build & Deployment

```bash
bun run build        # Build for production (outputs to dist/)
bun run clean        # Clean build artifacts and cache
bun run clean:full   # Clean everything and reinstall dependencies
bun run release      # Prepare for release (full checks + build)
```

## Migration from npm to Bun

This project has been migrated from npm to Bun for improved performance:

### Key Benefits

- **10x faster** package installations
- **Built-in bundler** and test runner
- **TypeScript support** out of the box
- **Smaller bundle sizes** with optimized packaging
- **Faster development server** startup times

### Migration Changes

- All `npm run` commands replaced with `bun run`
- `package-lock.json` → `bun.lockb`
- Added `"packageManager": "bun@1.1.33"` to package.json
- Updated scripts to use `bunx` for global tools

## Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - Framework Preset: `Vite` (auto-detected)
   - Build Command: `bun run build`
   - Output Directory: `dist`
   - Install Command: `bun install`

3. **Add Environment Variables**
   - Go to Settings → Environment Variables
   - Add `VITE_CONVEX_URL` with your Convex URL

4. **Add Custom Domain**
   - Go to Settings → Domains
   - Add `myworkouttracker.xyz`
   - Vercel will automatically provision SSL

5. **Configure Convex**
   - Run `bunx convex deploy` to deploy your Convex functions to production

## Database Schema

Iron Tracker uses the following Convex tables:

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

## License

MIT License - feel free to use this project for your own purposes.

## Acknowledgments

- **[Bun](https://bun.sh)** for the ultra-fast JavaScript runtime
- **[TanStack](https://tanstack.com)** for the exceptional open-source ecosystem
- **[Tailwind CSS](https://tailwindcss.com)** for utility-first styling
- **[Convex](https://convex.dev)** for backend-as-a-service
- **[Recharts](https://recharts.org)** for beautiful charts
- **[Lucide](https://lucide.dev)** for consistent icons

---

**Live Domain**: [https://myworkouttracker.xyz](https://myworkouttracker.xyz)  
**Repository**: [https://github.com/yourusername/iron-tracker](https://github.com/yourusername/iron-tracker)  
**⚡ Powered by Bun**: [https://bun.sh](https://bun.sh)

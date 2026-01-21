# Iron Tracker

A modern web application for tracking daily habits and strength training progress. Built with React, Vite, and Convex.

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
- **Backend**: Convex (serverless functions + database)
- **Charts**: Recharts 3.6.0
- **Icons**: Lucide React 0.545.0
- **Testing**: Vitest 3.0.5
- **Code Quality**: ESLint + Prettier

## Prerequisites

- Node.js 18+ and npm
- Convex account (free tier works)
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

Copy the environment template and add your Convex credentials:

```bash
cp .env.example .env
```

Edit `.env` and add your Convex URL:

```
VITE_CONVEX_URL=https://your-project-id.convex.cloud
```

**Where to find your Convex credentials:**

1. Run `npx convex dev` to start Convex locally
2. Your Convex URL will be displayed and auto-configured

### 4. Set Up Convex Database

Run `npx convex dev` to start Convex locally and automatically set up your database schema.

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

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

## Available Scripts

### Development Commands
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload on port 3000 |
| `npm run start` | Alias for `npm run dev` |
| `npm run preview` | Preview production build locally |

### Quality Assurance Commands
| Command | Description |
|---------|-------------|
| `npm run test` | Run unit tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Run ESLint code quality checks |
| `npm run lint:fix` | Run ESLint and auto-fix issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting without fixing |
| `npm run tsc` | Run TypeScript type checking |
| `npm run check` | Run format + lint + type check |
| `npm run check:ci` | Full CI-quality checks (format:check + lint + tsc + test) |

### Security Commands
| Command | Description |
|---------|-------------|
| `npm run audit` | Run npm security audit |
| `npm run audit:fix` | Automatically fix security vulnerabilities |
| `npm run security` | Run comprehensive security checks (audit + lint + tsc) |

### Dependency Management
| Command | Description |
|---------|-------------|
| `npm run deps:check` | Check for outdated dependencies |
| `npm run deps:update` | Update dependencies to latest versions |

### Performance Commands
| Command | Description |
|---------|-------------|
| `npm run analyze` | Analyze bundle size |
| `npm run perf` | Run performance audit with Lighthouse |

### Git Hooks
| Command | Description |
|---------|-------------|
| `npm run pre-commit` | Run pre-commit quality checks |
| `npm run pre-push` | Run pre-push comprehensive checks |

### Build & Deployment
| Command | Description |
|---------|-------------|
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run clean` | Clean build artifacts and cache |
| `npm run clean:full` | Clean everything and reinstall dependencies |
| `npm run release` | Prepare for release (full checks + build) |

### Setup Commands
| Command | Description |
|---------|-------------|
| `npm run setup` | Run complete development environment setup |

### Docker Commands
| Command | Description |
|---------|-------------|
| `npm run docker:build` | Build Docker image |
| `npm run docker:run` | Run Docker container |

## 🏗️ Automation & DevOps

### CI/CD Pipeline
Iron Tracker features a comprehensive CI/CD pipeline:

- **Multi-environment Support**: Development, staging, and production deployments
- **Automated Testing**: Multi-node testing, code quality, security scanning
- **Performance Monitoring**: Lighthouse audits, bundle size analysis
- **Rollback Capabilities**: Quick rollback mechanisms for failed deployments
- **Environment-specific Configs**: Separate configurations for each environment

### Quality Assurance
- **Pre-commit Hooks**: Automatic code formatting, linting, and testing
- **Pre-push Hooks**: Comprehensive validation before pushing
- **Automated Testing**: Unit tests, integration tests, performance tests
- **Code Coverage**: Comprehensive test coverage reporting
- **Bundle Analysis**: Automated bundle size monitoring and optimization

### Monitoring & Observability
- **Health Check Endpoints**: `/api/health`, `/api/ready`, `/api/live`
- **Performance Metrics**: Real-time application performance tracking
- **Error Tracking**: Comprehensive error logging and analysis
- **Uptime Monitoring**: Automated service availability checks
- **Security Monitoring**: Continuous vulnerability scanning

## 📁 Project Structure

```
iron-tracker/
├── .github/
│   ├── workflows/         # GitHub Actions CI/CD workflows
│   │   ├── ci-cd.yml     # Main CI/CD pipeline
│   │   ├── security.yml  # Security scanning workflow
│   │   ├── code-quality.yml # Code quality checks
│   │   └── monitoring.yml # Health checks and monitoring
│   └── dependabot.yml    # Automated dependency updates
├── src/
│   ├── components/         # Reusable React components
│   │   ├── ui/           # Base UI components
│   │   ├── features/     # Feature-specific components
│   │   └── layouts/      # Layout components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and configurations
│   │   ├── convex.ts     # Convex client configuration
│   │   └── error-tracking.ts # Error tracking system
│   ├── routes/           # TanStack Router file-based routes
│   │   ├── __root.tsx    # Root route with layout
│   │   ├── index.tsx     # Dashboard (home page)
│   │   ├── history.tsx   # Progress charts and history
│   │   └── workout.tsx   # Active workout tracking
│   ├── api/             # API endpoints
│   │   └── health.ts     # Health check endpoints
│   ├── types/           # TypeScript type definitions
│   ├── styles/          # Global styles and themes
│   ├── main.tsx         # App entry point
│   ├── routeTree.gen.ts # Auto-generated router tree
│   └── styles.css      # Tailwind CSS imports
├── scripts/             # Automation and utility scripts
│   ├── setup.sh         # Development environment setup
│   ├── pre-commit.sh    # Pre-commit hook script
│   ├── pre-push.sh      # Pre-push hook script
│   ├── dev.sh          # Development server script
│   ├── build.sh        # Production build script
│   └── test.sh         # Test runner script
├── public/              # Static assets
│   ├── manifest.json    # Enhanced PWA manifest
│   ├── robots.txt       # SEO rules
│   └── favicon.ico      # App icon
├── docs/                # Documentation
│   ├── DEVELOPMENT.md   # Development guide
│   ├── CONTRIBUTING.md  # Contributing guidelines
│   ├── DEPLOYMENT.md    # Deployment procedures
│   └── ARCHITECTURE.md  # Architecture documentation
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── eslint.config.js     # ESLint configuration
├── lighthouserc.js      # Lighthouse CI configuration
├── .pre-commit-config.yaml # Pre-commit hooks configuration
├── .secrets.baseline   # Secrets detection baseline
├── .env.example         # Environment template
├── CONVEX_SETUP.md   # Database setup instructions
└── README.md            # This file
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
   - Add `VITE_CONVEX_URL` with your Convex URL

4. **Add Custom Domain**
   - Go to Settings → Domains
   - Add `myworkouttracker.xyz`
   - Vercel will automatically provision SSL

5. **Configure Convex**
   - Run `npx convex deploy` to deploy your Convex functions to production

### Alternative Deployments

**Netlify:**

- Build command: `npm run build`
- Publish directory: `dist`
- Add same environment variables

**Cloudflare Pages:**

- Build command: `npm run build`
- Build output: `/dist`
- Add same environment variables

## 🔒 Security Features

Iron Tracker includes enterprise-grade security features:

### Automated Security
- **GitHub Dependabot**: Automated dependency updates and vulnerability scanning
- **Security Workflows**: Comprehensive CI/CD security scanning
- **Pre-commit Hooks**: Automatic secret detection and code quality checks
- **Dependency Auditing**: Regular security audit with npm audit
- **Snyk Integration**: Advanced vulnerability scanning
- **Semgrep Analysis**: Static code analysis for security issues
- **TruffleHog**: Secret detection in code history

### Security Best Practices
- **Environment Variables**: Secure management with `.env` files
- **Row Level Security**: Convex handles data access at the function level
- **Input Validation**: Comprehensive input sanitization
- **HTTPS Enforcement**: SSL/TLS for all communications
- **Error Tracking**: Comprehensive error monitoring and alerting
- **Security Headers**: Proper security headers implementation

### Security Setup

**IMPORTANT**: Convex automatically handles data access control. No additional RLS configuration needed.

### Monitoring & Alerting
- **Health Checks**: `/api/health` endpoint for monitoring
- **Performance Metrics**: Real-time performance tracking
- **Error Tracking**: Comprehensive error logging and analysis
- **Uptime Monitoring**: Automated service availability checks

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
  loader: async ({ ctx }) => {
    const logs = await ctx.runQuery(api.workoutLogs.getHistory)
    return { logs }
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

1. Make changes in `convex/schema.ts`
2. Run `npx convex dev` to apply changes locally
3. Test locally with `npm run dev`
4. Deploy with `npm run build && npx convex deploy`

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
- [Convex](https://convex.dev) for backend-as-a-service (database + functions)
- [Recharts](https://recharts.org) for beautiful charts
- [Lucide](https://lucide.dev) for consistent icons

---

**Live Domain**: [https://myworkouttracker.xyz](https://myworkouttracker.xyz)

**Repository**: [https://github.com/yourusername/iron-tracker](https://github.com/yourusername/iron-tracker)

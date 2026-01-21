# Iron Tracker Architecture Documentation

This document provides a comprehensive overview of Iron Tracker's architecture, design patterns, and technical decisions.

## 🏗️ Overview

Iron Tracker is a modern web application built with React, TypeScript, and Convex. The architecture follows a component-based, event-driven design with emphasis on type safety, performance, and developer experience.

### Core Principles

- **Type Safety**: Comprehensive TypeScript usage throughout
- **Component Reusability**: Modular, testable components
- **Performance Optimized**: Lazy loading, code splitting, caching
- **Developer Experience**: Hot reload, dev tools, automated quality checks
- **Security First**: Input validation, secure authentication, proper secrets management

## 🎯 Technology Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI framework with concurrent features |
| TypeScript | 5.7.2 | Type safety and enhanced DX |
| Vite | 7.1.7 | Build tool with hot module replacement |
| TanStack Router | 1.132.0 | Type-safe file-based routing |
| TanStack Query | 5.0.0 | Server state management and caching |
| Tailwind CSS | 4.0.6 | Utility-first styling |
| Recharts | 3.6.0 | Data visualization and charts |
| Lucide React | 0.545.0 | Icon library |

### Backend Technologies

| Technology | Purpose |
|------------|---------|
| Convex | Backend-as-a-service (database + serverless functions) |
| PostgreSQL | Primary database with ACID compliance |

### Development Tools

| Technology | Purpose |
|------------|---------|
| ESLint | Code linting and quality checks |
| Prettier | Code formatting and consistency |
| Vitest | Unit and integration testing |
| Husky | Git hooks for quality enforcement |
| Commitizen | Conventional commit standards |
| Lighthouse | Performance and accessibility auditing |

## 🏛️ System Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Side   │    │   Build Tools    │    │  Infrastructure │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ React Components│◄───┤     Vite        │◄───┤   GitHub Actions │
│ TanStack Router │    │   TypeScript    │    │     Vercel      │
│ TanStack Query  │    │   Tailwind      │    │    Convex       │
│ PWA Features    │    │   ESLint/Prettier│   │    Monitoring   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                                              │
         └──────────────────────┬───────────────────────┘
                                │
                       ┌─────────────────┐
                       │   Convex API    │
                       ├─────────────────┤
                       │   Database      │
                       │   Functions     │
                       └─────────────────┘
```

### Component Architecture

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (Button, Input, etc.)
│   ├── features/        # Feature-specific components
│   │   ├── auth/        # Authentication components
│   │   ├── workout/     # Workout tracking components
│   │   └── habits/      # Habit tracking components
│   └── layouts/         # Layout components (Header, Footer, etc.)
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and configurations
├── services/            # API service layers
├── types/               # TypeScript type definitions
├── routes/              # TanStack Router routes
├── styles/              # Global styles and themes
└── utils/               # Helper functions
```

## 🔄 Data Flow Architecture

### Unidirectional Data Flow

```typescript
// Data flow pattern
Convex → TanStack Query → React State → UI Components → User Interaction → Mutations → Convex
```

### Query Flow

```typescript
// Example: Workout data flow
export function useWorkouts() {
  return useQuery({
    queryKey: ['workouts'],
    queryFn: async () => {
      const data = await ctx.runQuery(api.workouts.getAll)
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    cacheTime: 10 * 60 * 1000, // 10 minutes cache
  });
}
```

### Mutation Flow

```typescript
// Example: Workout log mutation
export function useLogWorkout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (workoutLog: WorkoutLog) => {
      const data = await ctx.runMutation(api.workoutLogs.create, workoutLog)
      return data;
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries(['workout-logs']);
      queryClient.invalidateQueries(['workout-stats']);
    },
    onError: (error) => {
      // Handle error
      console.error('Failed to log workout:', error);
    },
  });
}
```

## 🗄️ Database Architecture

### Schema Design

```sql
-- Core tables
programs              -- Workout programs by day of week
exercises             -- Exercise library
program_exercises      -- Many-to-many relationship
daily_habits          -- Daily habit tracking
workout_logs          -- Workout progress logs
users                -- User profiles and preferences

-- Relationships
programs 1→N program_exercises N←1 exercises
users 1→N daily_habits
users 1→N workout_logs
```

### Access Control

Convex handles access control at the function level. Each query and mutation can check authentication and authorization:

```typescript
// Example: Protected query with access control
export const getWorkoutLogs = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    return await ctx.runQuery(api.workoutLogs.getByUser, { 
      userId: identity.subject 
    });
  },
});
```

### Data Relationships

```typescript
// Type definitions
interface Program {
  id: number;
  name: string;
  day_of_week: string;
  program_exercises?: ProgramExercise[];
}

interface Exercise {
  id: number;
  name: string;
  notes?: string;
}

interface ProgramExercise {
  id: number;
  program_id: number;
  exercise_id: number;
  sets: number;
  reps: number;
  rest_seconds: number;
  sort_order: number;
  exercise?: Exercise;
}

interface WorkoutLog {
  id: number;
  user_id: string;
  date: string;
  exercise_name: string;
  weight: number;
  reps: number;
  created_at: string;
}
```

## 🛣️ Routing Architecture

### File-Based Routing Structure

```
src/routes/
├── __root.tsx              # Root layout with Header and Outlet
├── index.tsx               # Dashboard (/)
├── history.tsx             # Progress history (/history)
├── workout.tsx             # Active workout (/workout)
├── login.tsx               # Authentication (/login)
├── profile.tsx             # User profile (/profile)
└── (auth)/                 # Route groups
    ├── login.tsx           # Nested login route
    └── register.tsx        # Nested register route
```

### Route Patterns

```typescript
// Root route with layout
export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  ),
});

// Feature route with data loading
export const Route = createFileRoute('/workout')({
  loader: async () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const { data } = await ctx.runQuery or ctx.runMutation
      .from('programs')
      .select('*, exercises:program_exercises(exercise:exercises(*))')
      .eq('day_of_week', today)
      .single();
    return { workout: data };
  },
  component: WorkoutPage,
});

// Route with parameters
export const Route = createFileRoute('/exercise/$id')({
  loader: ({ params }) => {
    return ctx.runQuery or ctx.runMutation
      .from('exercises')
      .select('*')
      .eq('id', params.id)
      .single();
  },
  component: ExerciseDetail,
});
```

## 🎨 Component Architecture

### Component Hierarchy

```
App
├── Router (TanStack)
├── ErrorBoundary
├── Suspense
└── Layout
    ├── Header
    │   ├── Navigation
    │   ├── UserMenu
    │   └── ThemeToggle
    ├── Main (Outlet)
    │   ├── Dashboard
    │   │   ├── HabitTracker
    │   │   ├── WorkoutCard
    │   │   └── ProgressSummary
    │   ├── Workout
    │   │   ├── ExerciseList
    │   │   ├── ExerciseCard
    │   │   └── WorkoutTimer
    │   └── History
    │       ├── ProgressChart
    │       ├── WorkoutLog
    │       └── StatsSummary
    └── Footer
```

### Component Patterns

#### 1. Compound Components

```typescript
// WorkoutCard with compound pattern
export function WorkoutCard({ workout, children }: WorkoutCardProps) {
  return (
    <div className="workout-card">
      <WorkoutCard.Header workout={workout} />
      <WorkoutCard.Content>
        {children}
      </WorkoutCard.Content>
      <WorkoutCard.Footer />
    </div>
  );
}

WorkoutCard.Header = function Header({ workout }: { workout: Workout }) {
  return <h3>{workout.name}</h3>;
};

WorkoutCard.Content = function Content({ children }: { children: React.ReactNode }) {
  return <div className="content">{children}</div>;
};

WorkoutCard.Footer = function Footer() {
  return <div className="footer">Footer content</div>;
};
```

#### 2. Render Props

```typescript
// Data fetching with render props
export function DataProvider<T>({
  queryKey,
  queryFn,
  children,
}: DataProviderProps<T>) {
  const { data, isLoading, error } = useQuery({ queryKey, queryFn });
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return children(data);
}

// Usage
<DataProvider
  queryKey={['workouts']}
  queryFn={() => ctx.runQuery or ctx.runMutation.from('workouts').select('*')}
>
  {(workouts) => <WorkoutList workouts={workouts} />}
</DataProvider>
```

#### 3. Custom Hooks

```typescript
// Complex state management
export function useWorkoutSession(workoutId: number) {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [completedSets, setCompletedSets] = useState<Set<string>>(new Set());
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    totalSets: 0,
    completedSets: 0,
    totalWeight: 0,
  });

  const { data: workout } = useWorkout(workoutId);
  const logMutation = useLogWorkout();

  const completeSet = useCallback((exerciseId: string, weight: number, reps: number) => {
    setCompletedSets(prev => new Set(prev).add(exerciseId));
    setSessionStats(prev => ({
      ...prev,
      completedSets: prev.completedSets + 1,
      totalWeight: prev.totalWeight + (weight * reps),
    }));
    
    logMutation.mutate({
      exercise_id: exerciseId,
      weight,
      reps,
      completed_at: new Date().toISOString(),
    });
  }, [logMutation]);

  const nextExercise = useCallback(() => {
    setCurrentExercise(prev => Math.min(prev + 1, (workout?.exercises?.length || 0) - 1));
  }, [workout?.exercises?.length]);

  return {
    currentExercise,
    completedSets,
    sessionStats,
    workout,
    completeSet,
    nextExercise,
    isComplete: currentExercise === (workout?.exercises?.length || 0) - 1,
  };
}
```

## 🔐 Security Architecture

### Authentication Flow

```typescript
// Authentication context
export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state
    const initAuth = async () => {
      const { data: { session } } = await ctx.runQuery or ctx.runMutation.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = ctx.runQuery or ctx.runMutation.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await ctx.runQuery or ctx.runMutation.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await ctx.runQuery or ctx.runMutation.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await ctx.runQuery or ctx.runMutation.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Data Protection

```typescript
// Protected data access
export function useProtectedData<T>(queryKey: string[], queryFn: () => Promise<T>) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey,
    queryFn,
    enabled: !!user, // Only run if user is authenticated
    retry: (failureCount, error) => {
      if (error.message.includes('Unauthorized')) return false;
      return failureCount < 3;
    },
  });
}

// Secure API wrapper
export class SecureAPI {
  static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const { data: { session } } = await ctx.runQuery or ctx.runMutation.auth.getSession();
    
    if (!session) {
      throw new Error('Authentication required');
    }

    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }
}
```

## ⚡ Performance Architecture

### Code Splitting Strategy

```typescript
// Lazy loading for route components
const WorkoutPage = lazy(() => import('../routes/workout'));
const HistoryPage = lazy(() => import('../routes/history'));
const ProfilePage = lazy(() => import('../routes/profile'));

// Dynamic imports for heavy components
const ProgressChart = lazy(() => import('../components/ProgressChart'));

// Usage with Suspense
<Suspense fallback={<div>Loading...</div>}>
  <ProgressChart data={chartData} />
</Suspense>
```

### Caching Strategy

```typescript
// Multi-layer caching
export function useWorkoutData(workoutId: number) {
  return useQuery({
    queryKey: ['workout', workoutId],
    queryFn: () => fetchWorkout(workoutId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
}

// Prefetching for better UX
export function WorkoutList() {
  const { data: workouts } = useWorkouts();
  const queryClient = useQueryClient();

  const prefetchWorkout = (workoutId: number) => {
    queryClient.prefetchQuery({
      queryKey: ['workout', workoutId],
      queryFn: () => fetchWorkout(workoutId),
      staleTime: 30 * 1000, // 30 seconds
    });
  };

  return (
    <div>
      {workouts?.map(workout => (
        <WorkoutCard
          key={workout.id}
          workout={workout}
          onMouseEnter={() => prefetchWorkout(workout.id)}
        />
      ))}
    </div>
  );
}
```

### Bundle Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core dependencies
          vendor: ['react', 'react-dom'],
          // Routing
          router: ['@tanstack/react-router', '@tanstack/react-router-devtools'],
          // State management
          state: ['@tanstack/react-query'],
          // UI components
          ui: ['lucide-react', 'clsx', 'tailwind-merge'],
          // Charts
          charts: ['recharts'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@tanstack/react-router'],
  },
});
```

## 🧪 Testing Architecture

### Testing Structure

```
src/
├── components/
│   ├── WorkoutCard.tsx
│   ├── WorkoutCard.test.tsx
│   ├── WorkoutCard.stories.tsx  # Storybook stories
│   └── index.ts
├── hooks/
│   ├── useWorkoutData.ts
│   ├── useWorkoutData.test.ts
│   └── index.ts
├── services/
│   ├── workoutService.ts
│   ├── workoutService.test.ts
│   └── index.ts
└── __tests__/              # Integration tests
    ├── setup.ts
    ├── utils.tsx
    └── fixtures/
        └── workouts.json
```

### Test Patterns

```typescript
// Component testing with React Testing Library
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WorkoutCard } from './WorkoutCard';

describe('WorkoutCard', () => {
  const mockWorkout = {
    id: 1,
    name: 'Upper Body A',
    exercises: [
      { id: 1, name: 'Bench Press', sets: 3, reps: 10 },
    ],
  };

  it('renders workout information correctly', () => {
    render(<WorkoutCard workout={mockWorkout} onStart={vi.fn()} />);
    
    expect(screen.getByText('Upper Body A')).toBeInTheDocument();
    expect(screen.getByText('Bench Press')).toBeInTheDocument();
  });

  it('calls onStart when start button is clicked', async () => {
    const mockOnStart = vi.fn();
    const user = userEvent.setup();
    
    render(<WorkoutCard workout={mockWorkout} onStart={mockOnStart} />);
    
    await user.click(screen.getByRole('button', { name: /start workout/i }));
    
    expect(mockOnStart).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<WorkoutCard workout={mockWorkout} onStart={vi.fn()} loading />);
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});

// Hook testing
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useWorkoutData } from './useWorkoutData';

describe('useWorkoutData', () => {
  it('fetches workout data successfully', async () => {
    const queryClient = new QueryClient();
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );

    const { result } = renderHook(() => useWorkoutData(1), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockWorkout);
  });
});
```

## 🔄 State Management Architecture

### State Layers

1. **Server State**: TanStack Query (caching, synchronization, background updates)
2. **URL State**: TanStack Router (search params, route state)
3. **Form State**: React Hook Form or useState (form inputs, validation)
4. **UI State**: useState/useReducer (component-specific state)
5. **Global State**: React Context (auth, theme, user preferences)

### State Flow Patterns

```typescript
// Server state with TanStack Query
export function useWorkouts() {
  return useQuery({
    queryKey: ['workouts'],
    queryFn: fetchWorkouts,
    staleTime: 5 * 60 * 1000,
  });
}

// URL state with TanStack Router
export const Route = createFileRoute('/workout')({
  component: WorkoutPage,
  validateSearch: (search: Record<string, unknown>) => ({
    programId: typeof search.programId === 'number' ? search.programId : undefined,
    exercise: typeof search.exercise === 'string' ? search.exercise : '',
  }),
});

function WorkoutPage() {
  const { programId, exercise } = Route.useSearch();
  // Use search params in component
}

// Form state with React Hook Form
export function WorkoutForm({ workout }: { workout: Workout }) {
  const { register, handleSubmit, formState: { errors } } = useForm<WorkoutFormData>({
    defaultValues: workout,
  });

  const mutation = useUpdateWorkout();

  const onSubmit = (data: WorkoutFormData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}

// Global state with Context
export const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

## 🚀 Deployment Architecture

### Build Pipeline

```yaml
# CI/CD flow
1. Code Push → GitHub
2. GitHub Actions triggers
   - Install dependencies
   - Run tests
   - Lint and format check
   - Security scan
   - Build application
   - Run performance audit
3. Deploy to appropriate environment
   - Staging (develop branch)
   - Production (main branch)
4. Health checks and monitoring
```

### Environment Configuration

```typescript
// Environment-specific configuration
const config = {
  development: {
    apiUrl: 'http://localhost:54321',
    convexUrl: process.env.VITE_CONVEX_URL,
    debug: true,
  },
  staging: {
    apiUrl: 'https://api.staging.iron-tracker.com',
    convexUrl: process.env.VITE_CONVEX_URL,
    debug: false,
  },
  production: {
    apiUrl: 'https://api.iron-tracker.com',
    convexUrl: process.env.VITE_CONVEX_URL,
    debug: false,
  },
}[import.meta.env.VITE_APP_ENV || 'development'];
```

## 📊 Monitoring Architecture

### Performance Monitoring

```typescript
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // Send to analytics service
  if (import.meta.env.PROD) {
    gtag('event', metric.name, {
      event_category: 'Web Vitals',
      value: Math.round(metric.value),
      non_interaction: true,
    });
  }
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### Error Tracking

```typescript
// Error boundary with tracking
export class ErrorBoundary extends Component<Props, State> {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Send to error tracking service
    if (import.meta.env.PROD) {
      // Sentry.captureException(error, { extra: errorInfo });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong.</h2>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## 🔮 Future Architecture Considerations

### Scalability

- **Microservices**: Split into specialized services
- **Event Sourcing**: Implement event-driven architecture
- **CQRS**: Separate read and write operations
- **Distributed Caching**: Redis or similar

### Advanced Features

- **Real-time Updates**: WebSocket integration
- **Offline Support**: Service workers with sync
- **AI/ML Integration**: Workout recommendations
- **Social Features**: Sharing and community

### Performance Enhancements

- **Edge Computing**: Deploy to CDN edge locations
- **Image Optimization**: WebP, responsive images
- **Code Optimization**: Tree shaking, dead code elimination
- **Database Optimization**: Indexing, query optimization

This architecture documentation serves as a comprehensive guide for understanding Iron Tracker's technical foundation and provides direction for future development and scaling.
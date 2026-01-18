# Contributing to Iron Tracker

Thank you for your interest in contributing to Iron Tracker! This guide will help you get started with contributing to the project.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git
- Supabase account (for development)
- GitHub account

### Setup Development Environment

1. **Fork the Repository**
   ```bash
   # Fork the repository on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/iron-tracker.git
   cd iron-tracker
   ```

2. **Setup Environment**
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

3. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Start Development**
   ```bash
   npm run dev
   ```

## 📋 Development Workflow

### 1. Create a Feature Branch

```bash
# Create a new branch for your feature
git checkout -b feature/amazing-feature

# Or for a bug fix
git checkout -b fix/bug-description
```

### 2. Make Your Changes

- Follow our [Code Style Guidelines](#code-style)
- Write tests for new functionality
- Update documentation as needed
- Ensure all tests pass

### 3. Test Your Changes

```bash
# Run all quality checks
npm run check:ci

# Run tests specifically
npm run test

# Test performance
npm run perf
```

### 4. Commit Your Changes

We use [Conventional Commits](https://www.conventionalcommits.org/) format:

```bash
# Format: type(scope): description

git add .
git commit -m "feat(workout): add exercise history filtering"
git commit -m "fix(auth): resolve login validation issue"
git commit -m "docs: update contributing guidelines"
```

#### Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting (no functional changes)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes

### 5. Push and Create Pull Request

```bash
git push origin feature/amazing-feature
```

Then create a Pull Request on GitHub with:

- Clear title following conventional commit format
- Detailed description of changes
- Reference any relevant issues
- Screenshots for UI changes (if applicable)

## 🎯 Code Style Guidelines

### General Principles

- **Consistency**: Follow existing patterns in the codebase
- **Clarity**: Write readable, self-documenting code
- **Simplicity**: Prefer simple solutions over complex ones
- **TypeScript**: Use TypeScript for type safety

### TypeScript

```typescript
// ✅ Good: Use interfaces for type definitions
interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
}

// ✅ Good: Use proper typing for props
interface WorkoutCardProps {
  workout: Workout;
  onStart: () => void;
}

export function WorkoutCard({ workout, onStart }: WorkoutCardProps) {
  // Component implementation
}

// ❌ Bad: Using 'any' type
function processData(data: any) {
  // ...
}
```

### React Components

```typescript
// ✅ Good: Functional components with hooks
export function HabitTracker({ habits }: HabitTrackerProps) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  
  const toggleHabit = useCallback((habitId: string) => {
    setCompleted(prev => {
      const newSet = new Set(prev);
      if (newSet.has(habitId)) {
        newSet.delete(habitId);
      } else {
        newSet.add(habitId);
      }
      return newSet;
    });
  }, []);

  return (
    <div className="habit-tracker">
      {/* Component JSX */}
    </div>
  );
}

// ✅ Good: Custom hooks for complex logic
export function useWorkoutHistory(exerciseId?: string) {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLogs() {
      try {
        setLoading(true);
        const { data } = await supabase
          .from('workout_logs')
          .select('*')
          .eq('exercise_id', exerciseId)
          .order('date', { ascending: true });
        
        setLogs(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    if (exerciseId) {
      fetchLogs();
    }
  }, [exerciseId]);

  return { logs, loading, error };
}
```

### File Naming

- Components: `PascalCase.tsx` (e.g., `WorkoutCard.tsx`)
- Utilities: `camelCase.ts` (e.g., `supabaseClient.ts`)
- Hooks: `camelCase.ts` (e.g., `useWorkoutData.ts`)
- Types: `camelCase.types.ts` (e.g., `workout.types.ts`)
- Tests: `ComponentName.test.tsx` (co-located)

### Imports

```typescript
// ✅ Good: Organized imports
import React, { useState, useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { supabase } from '../lib/supabase';
import { WorkoutCard } from '../components/WorkoutCard';
import type { Workout, Exercise } from '../types/workout.types';

// Local imports last
import './WorkoutPage.css';
```

## 🧪 Testing Guidelines

### Test Structure

```typescript
// ✅ Good: Test structure
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WorkoutCard } from './WorkoutCard';

describe('WorkoutCard', () => {
  const mockWorkout: Workout = {
    id: 1,
    name: 'Upper Body A',
    exercises: [],
  };

  it('renders workout name correctly', () => {
    render(<WorkoutCard workout={mockWorkout} onStart={vi.fn()} />);
    expect(screen.getByText('Upper Body A')).toBeInTheDocument();
  });

  it('calls onStart when start button is clicked', async () => {
    const mockOnStart = vi.fn();
    const user = userEvent.setup();
    
    render(<WorkoutCard workout={mockWorkout} onStart={mockOnStart} />);
    
    await user.click(screen.getByRole('button', { name: /start workout/i }));
    expect(mockOnStart).toHaveBeenCalledTimes(1);
  });

  it('shows loading state while exercises load', () => {
    render(<WorkoutCard workout={mockWorkout} onStart={vi.fn()} loading />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
```

### Test Coverage

- Aim for >80% code coverage
- Test critical user flows
- Test error handling
- Test edge cases

## 🏗️ Architecture Guidelines

### Component Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── features/        # Feature-specific components
│   └── layouts/         # Layout components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and configurations
├── services/            # API services
├── types/               # TypeScript type definitions
├── routes/              # TanStack Router routes
└── styles/              # Global styles and themes
```

### Data Flow

```typescript
// ✅ Good: Data flow with TanStack Query
export function useWorkoutData() {
  return useQuery({
    queryKey: ['workouts'],
    queryFn: async () => {
      const { data } = await supabase
        .from('workouts')
        .select('*');
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// In component
export function WorkoutList() {
  const { data: workouts, isLoading, error } = useWorkoutData();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {workouts?.map(workout => (
        <WorkoutCard key={workout.id} workout={workout} />
      ))}
    </div>
  );
}
```

## 🔧 Development Tools

### Pre-commit Hooks

We use pre-commit hooks to ensure code quality:

- ESLint for linting
- Prettier for formatting
- TypeScript for type checking
- Tests for validation

### VS Code Configuration

Recommended VS Code extensions are included in `.vscode/extensions.json`.

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Environment**: OS, browser, Node.js version
2. **Steps to Reproduce**: Clear reproduction steps
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Error Messages**: Any console errors
6. **Screenshots**: If applicable

### Bug Report Template

```markdown
## Bug Description
Brief description of the bug

## Environment
- OS: [e.g., macOS 14.0]
- Browser: [e.g., Chrome 120]
- Node.js: [e.g., 20.10.0]

## Steps to Reproduce
1. Go to...
2. Click on...
3. See error

## Expected Behavior
Describe what should happen

## Actual Behavior
Describe what actually happens

## Screenshots
Add screenshots if helpful

## Additional Context
Any other relevant information
```

## 💡 Feature Requests

For feature requests:

1. Check existing issues first
2. Use the feature request template
3. Provide clear use cases
4. Consider implementation complexity

### Feature Request Template

```markdown
## Feature Description
Clear description of the feature

## Problem Statement
What problem does this solve?

## Proposed Solution
How should this be implemented?

## Alternatives Considered
Other approaches you considered

## Additional Context
Any other relevant information
```

## 📝 Documentation

### When to Update Documentation

- Adding new features
- Changing API endpoints
- Modifying configuration
- Updating setup instructions

### Documentation Types

- **README.md**: Project overview and quick start
- **DEVELOPMENT.md**: Detailed development guide
- **API.md**: API documentation (if applicable)
- **Code comments**: Complex logic explanations

## 🔐 Security

### Security Guidelines

- Never commit secrets or API keys
- Use environment variables for sensitive data
- Validate all user input
- Use HTTPS in production
- Keep dependencies updated
- Follow OWASP security best practices

### Reporting Security Issues

For security issues, please email: security@iron-tracker.com

## 🚀 Deployment

### Environments

- **Development**: Local development
- **Staging**: Pre-production testing
- **Production**: Live application

### Deployment Process

1. Code is merged to `main` branch
2. CI/CD pipeline runs automatically
3. Application is deployed to production
4. Health checks verify deployment

## 🤝 Code Review Guidelines

### For Reviewers

- Check code follows style guidelines
- Verify tests are adequate
- Check for security issues
- Consider performance implications
- Provide constructive feedback

### For Authors

- Address all review comments
- Update tests as needed
- Keep PR descriptions updated
- Respond to feedback promptly

## 📊 Performance Guidelines

### Performance Best Practices

- Use React.memo for expensive components
- Implement code splitting for large bundles
- Optimize images and assets
- Use TanStack Query for data caching
- Monitor bundle size

### Performance Monitoring

- Use Lighthouse for performance audits
- Monitor Core Web Vitals
- Track bundle size changes
- Monitor API response times

## 🎉 Recognition

Contributors are recognized in:

- README.md contributors section
- Release notes
- Commit history
- Special recognition for significant contributions

## 📞 Getting Help

- Create an issue for bugs or feature requests
- Check existing documentation
- Join community discussions
- Review existing issues

## 📄 License

By contributing to Iron Tracker, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Iron Tracker! 🏋️‍♂️💪
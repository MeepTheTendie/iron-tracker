import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorBoundary } from '../components/ErrorBoundary'
import {
  Skeleton,
  SkeletonCard,
  SkeletonList,
  SkeletonButton,
  SkeletonHabitTracker,
} from '../components/Skeleton'
import { WorkoutTimer } from '../components/WorkoutTimer'
import { StreakDisplay } from '../components/StreakTracker'

const mockNavigate = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
}))

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Child content</div>
      </ErrorBoundary>,
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.getByText('Child content')).toBeInTheDocument()
  })

  it('renders fallback when error occurs', () => {
    const ThrowError = () => {
      throw new Error('Test error')
    }

    const { container } = render(
      <ErrorBoundary
        fallback={<div data-testid="fallback">Custom fallback</div>}
      >
        <ThrowError />
      </ErrorBoundary>,
    )

    expect(
      container.querySelector('[data-testid="fallback"]'),
    ).toBeInTheDocument()
  })

  it('shows error message when error occurs', () => {
    const ThrowError = () => {
      throw new Error('Something went wrong')
    }

    const { container } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    )

    const errorDiv = container.querySelector('.p-4.bg-red-50')
    expect(errorDiv).toBeInTheDocument()
    expect(errorDiv).toHaveTextContent('Something went wrong')
  })

  it('shows "Unknown error" when error message is empty', () => {
    const ThrowError = () => {
      const error = new Error('')
      throw error
    }

    const { container } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    )

    expect(container).toHaveTextContent('Unknown error')
  })

  it('has correct styling classes', () => {
    const ThrowError = () => {
      throw new Error('Test')
    }

    const { container } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    )

    const errorDiv = container.querySelector('.p-4.bg-red-50')
    expect(errorDiv).toHaveClass(
      'p-4 bg-red-50 border border-red-200 rounded-lg text-red-700',
    )
  })
})

describe('Skeleton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders Skeleton with custom className', () => {
    render(<Skeleton className="w-10 h-10" />)
    expect(screen.getByTestId('skeleton')).toHaveClass('w-10 h-10')
  })

  it('renders Skeleton with shimmer effect', () => {
    render(<Skeleton className="w-20 h-20" />)
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveClass('bg-gradient-to-r')
    expect(skeleton).toHaveClass('animate-pulse')
  })

  it('renders SkeletonCard', () => {
    render(<SkeletonCard />)
    expect(screen.getByTestId('skeleton-card')).toBeInTheDocument()
  })

  it('renders SkeletonList with multiple cards', () => {
    render(<SkeletonList count={3} />)
    const cards = screen.getAllByTestId('skeleton-card')
    expect(cards).toHaveLength(3)
  })

  it('renders SkeletonList with default count of 3', () => {
    render(<SkeletonList />)
    const cards = screen.getAllByTestId('skeleton-card')
    expect(cards).toHaveLength(3)
  })

  it('renders SkeletonButton', () => {
    render(<SkeletonButton />)
    expect(screen.getByTestId('skeleton-button')).toBeInTheDocument()
  })

  it('renders SkeletonHabitTracker', () => {
    render(<SkeletonHabitTracker />)
    expect(screen.getByTestId('skeleton-habit-tracker')).toBeInTheDocument()
  })
})

describe('WorkoutTimer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders with default duration of 90 seconds', () => {
    render(<WorkoutTimer />)
    expect(screen.getByText('1:30')).toBeInTheDocument()
  })

  it('renders with custom duration', () => {
    render(<WorkoutTimer duration={60} />)
    expect(screen.getByText('1:00')).toBeInTheDocument()
  })

  it('shows "Start" button initially', () => {
    render(<WorkoutTimer />)
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument()
  })

  it('changes to "Pause" when running', () => {
    render(<WorkoutTimer />)
    const startButton = screen.getByRole('button', { name: 'Start' })
    fireEvent.click(startButton)
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument()
  })

  it('shows "Timer paused" when not running', () => {
    render(<WorkoutTimer />)
    expect(screen.getByText('Timer paused')).toBeInTheDocument()
  })

  it('shows "Rest timer running" when running', () => {
    render(<WorkoutTimer />)
    const startButton = screen.getByRole('button', { name: 'Start' })
    fireEvent.click(startButton)
    expect(screen.getByText('Rest timer running')).toBeInTheDocument()
  })

  it('resets timer when reset button clicked', () => {
    render(<WorkoutTimer duration={10} />)
    expect(screen.getByText('0:10')).toBeInTheDocument()
    const resetButton = screen.getByRole('button', { name: 'Reset' })
    fireEvent.click(resetButton)
    expect(screen.getByText('0:10')).toBeInTheDocument()
  })

  it('has callback prop for onComplete', () => {
    const onComplete = vi.fn()
    render(<WorkoutTimer duration={1} onComplete={onComplete} />)
    expect(onComplete).not.toHaveBeenCalled()
  })

  it('formats time correctly with leading zero', () => {
    render(<WorkoutTimer duration={65} />)
    expect(screen.getByText('1:05')).toBeInTheDocument()
  })

  it('formats time correctly for single digit seconds', () => {
    render(<WorkoutTimer duration={61} />)
    expect(screen.getByText('1:01')).toBeInTheDocument()
  })
})

describe('StreakDisplay', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)
    vi.spyOn(Storage.prototype, 'setItem').mockReturnValue(undefined)
  })

  it('renders current streak', () => {
    render(
      <StreakDisplay
        streakData={{
          currentStreak: 5,
          longestStreak: 10,
          lastCompletedDate: '2026-01-21',
        }}
      />,
    )
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('day streak')).toBeInTheDocument()
  })

  it('renders longest streak', () => {
    render(
      <StreakDisplay
        streakData={{
          currentStreak: 5,
          longestStreak: 10,
          lastCompletedDate: '2026-01-21',
        }}
      />,
    )
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('best')).toBeInTheDocument()
  })

  it('renders with zero streak', () => {
    render(
      <StreakDisplay
        streakData={{
          currentStreak: 0,
          longestStreak: 0,
          lastCompletedDate: null,
        }}
      />,
    )
    expect(screen.getAllByText('0')[0]).toBeInTheDocument()
  })

  it('has correct styling classes for current streak', () => {
    render(
      <StreakDisplay
        streakData={{
          currentStreak: 2,
          longestStreak: 1,
          lastCompletedDate: '2026-01-21',
        }}
      />,
    )
    const currentStreakDiv = screen.getByText('2').closest('div.bg-orange-100')
    expect(currentStreakDiv).toBeInTheDocument()
    expect(currentStreakDiv).toHaveClass('bg-orange-100 px-4 py-2 rounded-lg')
  })

  it('has correct styling classes for longest streak', () => {
    render(
      <StreakDisplay
        streakData={{
          currentStreak: 1,
          longestStreak: 5,
          lastCompletedDate: '2026-01-21',
        }}
      />,
    )
    const longestStreakDiv = screen.getByText('5').closest('div.bg-amber-100')
    expect(longestStreakDiv).toBeInTheDocument()
    expect(longestStreakDiv).toHaveClass('bg-amber-100 px-4 py-2 rounded-lg')
  })
})

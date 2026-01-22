import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { HabitTracker } from '../components/HabitTracker'

const mockMutation = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  useRouter: () => ({
    invalidate: vi.fn(),
  }),
}))

vi.mock('../lib/convex', () => ({
  convex: {
    mutation: (...args: unknown[]) => mockMutation(...args),
  },
}))

describe('HabitTracker', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(navigator, 'vibrate', {
      value: vi.fn(),
      writable: true,
      configurable: true
    })
    Object.defineProperty(navigator, 'onLine', { value: true, writable: true })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const defaultHabits = {
    _id: 'habit-1',
    _creationTime: Date.now(),
    date: new Date().toISOString().split('T')[0],
    amSquats: false,
    steps7k: false,
    bike1hr: false,
    pmSquats: false,
  }

  it('renders Daily Rituals header', () => {
    render(<HabitTracker habits={defaultHabits} date="2026-01-21" />)
    expect(screen.getByText('Daily Rituals')).toBeInTheDocument()
  })

  it('renders all four habit buttons', () => {
    render(<HabitTracker habits={defaultHabits} date="2026-01-21" />)
    expect(screen.getByRole('button', { name: '15x AM Squats, not completed' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '7k Steps, not completed' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '1 Hour Bike, not completed' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '15x PM Squats, not completed' })).toBeInTheDocument()
  })

  it('shows progress bar with 0% when no habits completed', () => {
    render(<HabitTracker habits={defaultHabits} date="2026-01-21" />)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '0')
  })

  it('displays completion count as 0/4 initially', () => {
    render(<HabitTracker habits={defaultHabits} date="2026-01-21" />)
    expect(screen.getByText('0/4')).toBeInTheDocument()
  })

  it('displays completion count correctly when some habits completed', () => {
    const partialHabits = {
      ...defaultHabits,
      amSquats: true,
      steps7k: true,
      bike1hr: false,
      pmSquats: false,
    }
    render(<HabitTracker habits={partialHabits} date="2026-01-21" />)
    expect(screen.getByText('2/4')).toBeInTheDocument()
  })

  it('shows "All Rituals Complete" when all habits done', () => {
    const completedHabits = {
      ...defaultHabits,
      amSquats: true,
      steps7k: true,
      bike1hr: true,
      pmSquats: true,
    }
    render(<HabitTracker habits={completedHabits} date="2026-01-21" />)
    expect(screen.getByText('All Rituals Complete!')).toBeInTheDocument()
    expect(screen.getByText('Great job! See you tomorrow!')).toBeInTheDocument()
  })

  it('calls convex mutation when habit is clicked', async () => {
    mockMutation.mockResolvedValue(undefined)
    render(<HabitTracker habits={defaultHabits} date="2026-01-21" />)

    const amSquatsButton = screen.getByRole('button', { name: '15x AM Squats, not completed' })
    fireEvent.click(amSquatsButton)

    await waitFor(() => {
      expect(mockMutation).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          date: '2026-01-21',
          field: 'amSquats',
          value: true,
        }),
      )
    })
  })

  it('shows loading state on clicked habit', () => {
    mockMutation.mockImplementation(() => new Promise(() => {}))
    render(<HabitTracker habits={defaultHabits} date="2026-01-21" />)

    const amSquatsButton = screen.getByRole('button', { name: '15x AM Squats, not completed' })
    fireEvent.click(amSquatsButton)

    expect(screen.getByRole('button', { name: '15x AM Squats, not completed' })).toHaveClass('opacity-60')
  })

  it('shows offline warning when disconnected', () => {
    Object.defineProperty(navigator, 'onLine', { value: false, writable: true })
    render(<HabitTracker habits={defaultHabits} date="2026-01-21" />)
    expect(screen.getByText('Offline - changes will sync when connected')).toBeInTheDocument()
  })

  it('displays error message when save fails', async () => {
    mockMutation.mockRejectedValue(new Error('Failed to save'))
    render(<HabitTracker habits={defaultHabits} date="2026-01-21" />)

    const amSquatsButton = screen.getByRole('button', { name: '15x AM Squats, not completed' })
    fireEvent.click(amSquatsButton)

    await waitFor(() => {
      expect(screen.getByText('Failed to save. Tap to retry.')).toBeInTheDocument()
    })
  })

  it('marks habit as done with check icon', () => {
    const completedHabits = {
      ...defaultHabits,
      amSquats: true,
    }
    render(<HabitTracker habits={completedHabits} date="2026-01-21" />)

    const amSquatsButton = screen.getByRole('button', { name: '15x AM Squats, completed' })
    expect(amSquatsButton).toHaveClass('bg-rose-100')
    expect(amSquatsButton).toHaveClass('border-rose-300')
  })

  it('displays "Done" badge for completed habits', () => {
    const completedHabits = {
      ...defaultHabits,
      amSquats: true,
    }
    render(<HabitTracker habits={completedHabits} date="2026-01-21" />)
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('displays "Done" for all completed habits', () => {
    const completedHabits = {
      ...defaultHabits,
      amSquats: true,
      steps7k: true,
      bike1hr: true,
      pmSquats: true,
    }
    render(<HabitTracker habits={completedHabits} date="2026-01-21" />)
    expect(screen.getByText('All Rituals Complete!')).toBeInTheDocument()
  })

  it('handles null habits gracefully', () => {
    render(<HabitTracker habits={null} date="2026-01-21" />)
    expect(screen.getByText('0/4')).toBeInTheDocument()
  })

  it('renders progress bar width correctly', () => {
    const partialHabits = {
      ...defaultHabits,
      amSquats: true,
      steps7k: true,
    }
    render(<HabitTracker habits={partialHabits} date="2026-01-21" />)
    const progressFill = screen.getByTestId('progress-fill')
    expect(progressFill).toHaveStyle({ width: '50%' })
  })
})

describe('HabitTracker - offline functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(navigator, 'onLine', { value: false, writable: true })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('displays offline warning when navigator.onLine is false', () => {
    const habits = {
      _id: 'habit-1',
      _creationTime: Date.now(),
      date: '2026-01-21',
      amSquats: false,
      steps7k: false,
      bike1hr: false,
      pmSquats: false,
    }
    render(<HabitTracker habits={habits} date="2026-01-21" />)
    expect(screen.getByText('Offline - changes will sync when connected')).toBeInTheDocument()
  })
})

describe('HabitTracker - edge cases', () => {
  it('handles habits with undefined values', () => {
    const habits = {
      _id: 'habit-1',
      _creationTime: Date.now(),
      date: '2026-01-21',
      amSquats: undefined,
      steps7k: undefined,
      bike1hr: undefined,
      pmSquats: undefined,
    }
    render(<HabitTracker habits={habits} date="2026-01-21" />)
    expect(screen.getByText('0/4')).toBeInTheDocument()
  })

  it('displays correct date in UI', () => {
    const habits = {
      _id: 'habit-1',
      _creationTime: Date.now(),
      date: '2026-01-21',
      amSquats: false,
      steps7k: false,
      bike1hr: false,
      pmSquats: false,
    }
    render(<HabitTracker habits={habits} date="2026-01-21" />)
    expect(screen.getByText('Daily Rituals')).toBeInTheDocument()
  })

  it('does not call mutation if already pending', () => {
    mockMutation.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    const habits = {
      _id: 'habit-1',
      _creationTime: Date.now(),
      date: '2026-01-21',
      amSquats: false,
      steps7k: false,
      bike1hr: false,
      pmSquats: false,
    }
    render(<HabitTracker habits={habits} date="2026-01-21" />)

    const button = screen.getByRole('button', { name: '15x AM Squats, not completed' })
    fireEvent.click(button)
    fireEvent.click(button)
    fireEvent.click(button)

    expect(mockMutation).toHaveBeenCalledTimes(1)
  })
})

import { describe, expect, it, beforeEach, vi, type Mock } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { WorkoutCard } from '../components/WorkoutCard'

const mockNavigate = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
}))

vi.mock('../../hooks/useHabits', () => ({
  useTodayWorkout: vi.fn(),
}))

const mockWorkout = {
  _id: 'workout-1',
  name: 'Upper Body A',
  workoutType: 'strength',
  description: 'Focus on chest and back',
  workout_exercises: [
    {
      _id: 'we-1',
      sets: 3,
      reps: 10,
      restSeconds: 60,
      sortOrder: 1,
      exercises: {
        name: 'Bench Press',
        muscleGroup: 'Chest',
        notes: 'Keep elbows tucked',
      },
    },
    {
      _id: 'we-2',
      sets: 3,
      reps: 12,
      restSeconds: 60,
      sortOrder: 2,
      exercises: {
        name: 'Bent Over Row',
        muscleGroup: 'Back',
        notes: null,
      },
    },
  ],
}

describe('WorkoutCard', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    vi.clearAllMocks()
  })

  it('renders workout name', () => {
    const { useTodayWorkout } = require('../../hooks/useHabits')
    ;(useTodayWorkout as Mock).mockReturnValue({ data: mockWorkout, isPending: false })

    render(<WorkoutCard dayName="Monday" />)
    expect(screen.getByText('Upper Body A')).toBeInTheDocument()
  })

  it('renders workout description', () => {
    const { useTodayWorkout } = require('../../hooks/useHabits')
    ;(useTodayWorkout as Mock).mockReturnValue({ data: mockWorkout, isPending: false })

    render(<WorkoutCard dayName="Monday" />)
    expect(screen.getByText('Focus on chest and back')).toBeInTheDocument()
  })

  it('renders all exercises', () => {
    const { useTodayWorkout } = require('../../hooks/useHabits')
    ;(useTodayWorkout as Mock).mockReturnValue({ data: mockWorkout, isPending: false })

    render(<WorkoutCard dayName="Monday" />)
    expect(screen.getByText('Bench Press')).toBeInTheDocument()
    expect(screen.getByText('Bent Over Row')).toBeInTheDocument()
  })

  it('renders exercise sets and reps', () => {
    const { useTodayWorkout } = require('../../hooks/useHabits')
    ;(useTodayWorkout as Mock).mockReturnValue({ data: mockWorkout, isPending: false })

    render(<WorkoutCard dayName="Monday" />)
    const spans = screen.getAllByText(/^[0-9]+$/, { selector: '.bg-gray-100 span' })
    expect(spans.length).toBe(4)
    expect(spans[0]).toHaveTextContent('3')
    expect(spans[1]).toHaveTextContent('10')
    expect(spans[2]).toHaveTextContent('3')
    expect(spans[3]).toHaveTextContent('12')
  })

  it('renders muscle groups', () => {
    const { useTodayWorkout } = require('../../hooks/useHabits')
    ;(useTodayWorkout as Mock).mockReturnValue({ data: mockWorkout, isPending: false })

    render(<WorkoutCard dayName="Monday" />)
    expect(screen.getByText('Chest')).toBeInTheDocument()
    expect(screen.getByText('Back')).toBeInTheDocument()
  })

  it('renders exercise notes when present', () => {
    const { useTodayWorkout } = require('../../hooks/useHabits')
    ;(useTodayWorkout as Mock).mockReturnValue({ data: mockWorkout, isPending: false })

    render(<WorkoutCard dayName="Monday" />)
    expect(screen.getByText('Keep elbows tucked')).toBeInTheDocument()
  })

  it('does not render notes when null', () => {
    const { useTodayWorkout } = require('../../hooks/useHabits')
    ;(useTodayWorkout as Mock).mockReturnValue({ data: mockWorkout, isPending: false })

    render(<WorkoutCard dayName="Monday" />)
    expect(screen.queryByText('notes')).not.toBeInTheDocument()
  })

  it('has Start Workout button', () => {
    const { useTodayWorkout } = require('../../hooks/useHabits')
    ;(useTodayWorkout as Mock).mockReturnValue({ data: mockWorkout, isPending: false })

    render(<WorkoutCard dayName="Monday" />)
    expect(screen.getByRole('button', { name: 'Start Workout' })).toBeInTheDocument()
  })

  it('navigates to workout page when Start Workout is clicked', () => {
    const { useTodayWorkout } = require('../../hooks/useHabits')
    ;(useTodayWorkout as Mock).mockReturnValue({ data: mockWorkout, isPending: false })

    render(<WorkoutCard dayName="Monday" />)
    fireEvent.click(screen.getByRole('button', { name: 'Start Workout' }))
    expect(mockNavigate).toHaveBeenCalledWith({
      to: '/workout',
      search: { workoutId: 'workout-1', workoutName: 'Upper Body A' },
    })
  })

  it('shows rest seconds when present', () => {
    const { useTodayWorkout } = require('../../hooks/useHabits')
    ;(useTodayWorkout as Mock).mockReturnValue({ data: mockWorkout, isPending: false })

    render(<WorkoutCard dayName="Monday" />)
    const restElements = screen.getAllByText((_, element) => {
      return element?.textContent === '60s rest'
    })
    expect(restElements.length).toBeGreaterThanOrEqual(1)
  })

  it('renders exercise numbers', () => {
    const { useTodayWorkout } = require('../../hooks/useHabits')
    ;(useTodayWorkout as Mock).mockReturnValue({ data: mockWorkout, isPending: false })

    render(<WorkoutCard dayName="Monday" />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it("renders Today's Session label", () => {
    const { useTodayWorkout } = require('../../hooks/useHabits')
    ;(useTodayWorkout as Mock).mockReturnValue({ data: mockWorkout, isPending: false })

    render(<WorkoutCard dayName="Monday" />)
    expect(screen.getByText("Today's Session")).toBeInTheDocument()
  })
})

describe('WorkoutCard - null workout', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    vi.clearAllMocks()
  })

  it('renders Active Recovery Day when no workout', () => {
    const { useTodayWorkout } = require('../../hooks/useHabits')
    ;(useTodayWorkout as Mock).mockReturnValue({ data: null, isPending: false })

    render(<WorkoutCard dayName="Monday" />)
    expect(screen.getByText('Active Recovery Day')).toBeInTheDocument()
  })

  it('renders recovery message', () => {
    const { useTodayWorkout } = require('../../hooks/useHabits')
    ;(useTodayWorkout as Mock).mockReturnValue({ data: null, isPending: false })

    render(<WorkoutCard dayName="Monday" />)
    expect(screen.getByText('Light movement, big gains')).toBeInTheDocument()
    expect(screen.getByText('Focus on your 7k steps and the Bike today. Recovery is when muscles grow.')).toBeInTheDocument()
  })

  it('has Start Custom Workout button', () => {
    const { useTodayWorkout } = require('../../hooks/useHabits')
    ;(useTodayWorkout as Mock).mockReturnValue({ data: null, isPending: false })

    render(<WorkoutCard dayName="Monday" />)
    expect(screen.getByRole('button', { name: 'Start Custom Workout' })).toBeInTheDocument()
  })

  it('navigates to workout page when button clicked', () => {
    const { useTodayWorkout } = require('../../hooks/useHabits')
    ;(useTodayWorkout as Mock).mockReturnValue({ data: null, isPending: false })

    render(<WorkoutCard dayName="Monday" />)
    fireEvent.click(screen.getByRole('button', { name: 'Start Custom Workout' }))
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/workout' })
  })
})

describe('WorkoutCard - loading state', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    vi.clearAllMocks()
  })

  it('shows skeleton when loading', () => {
    const { useTodayWorkout } = require('../../hooks/useHabits')
    ;(useTodayWorkout as Mock).mockReturnValue({ data: null, isPending: true })

    render(<WorkoutCard dayName="Monday" />)
    expect(screen.getByTestId('workout-skeleton')).toBeInTheDocument()
  })
})

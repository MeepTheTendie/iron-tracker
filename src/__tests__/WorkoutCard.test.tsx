import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { WorkoutCard } from '../components/WorkoutCard'

const mockNavigate = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
}))

describe('WorkoutCard', () => {
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

  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('renders workout name', () => {
    render(<WorkoutCard workout={mockWorkout} />)
    expect(screen.getByText('Upper Body A')).toBeInTheDocument()
  })

  it('renders workout description', () => {
    render(<WorkoutCard workout={mockWorkout} />)
    expect(screen.getByText('Focus on chest and back')).toBeInTheDocument()
  })

  it('renders all exercises', () => {
    render(<WorkoutCard workout={mockWorkout} />)
    expect(screen.getByText('Bench Press')).toBeInTheDocument()
    expect(screen.getByText('Bent Over Row')).toBeInTheDocument()
  })

  it('renders exercise sets and reps', () => {
    render(<WorkoutCard workout={mockWorkout} />)
    const spans = screen.getAllByText(/^[0-9]+$/, {
      selector: '.bg-gray-100 span',
    })
    expect(spans.length).toBe(4)
    expect(spans[0]).toHaveTextContent('3')
    expect(spans[1]).toHaveTextContent('10')
    expect(spans[2]).toHaveTextContent('3')
    expect(spans[3]).toHaveTextContent('12')
  })

  it('renders muscle groups', () => {
    render(<WorkoutCard workout={mockWorkout} />)
    expect(screen.getByText('Chest')).toBeInTheDocument()
    expect(screen.getByText('Back')).toBeInTheDocument()
  })

  it('renders exercise notes when present', () => {
    render(<WorkoutCard workout={mockWorkout} />)
    expect(screen.getByText('Keep elbows tucked')).toBeInTheDocument()
  })

  it('does not render notes when null', () => {
    render(<WorkoutCard workout={mockWorkout} />)
    expect(screen.queryByText('notes')).not.toBeInTheDocument()
  })

  it('has Start Workout button', () => {
    render(<WorkoutCard workout={mockWorkout} />)
    expect(
      screen.getByRole('button', { name: 'Start Workout' }),
    ).toBeInTheDocument()
  })

  it('navigates to workout page when Start Workout is clicked', () => {
    render(<WorkoutCard workout={mockWorkout} />)
    fireEvent.click(screen.getByRole('button', { name: 'Start Workout' }))
    expect(mockNavigate).toHaveBeenCalledWith({
      to: '/workout',
      search: { workoutId: 'workout-1', workoutName: 'Upper Body A' },
    })
  })

  it('shows rest seconds when present', () => {
    render(<WorkoutCard workout={mockWorkout} />)
    const restElements = screen.getAllByText((_, element) => {
      return element?.textContent === '60s rest'
    })
    expect(restElements.length).toBeGreaterThanOrEqual(1)
  })

  it('renders exercise numbers', () => {
    render(<WorkoutCard workout={mockWorkout} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it("renders Today's Session label", () => {
    render(<WorkoutCard workout={mockWorkout} />)
    expect(screen.getByText("Today's Session")).toBeInTheDocument()
  })
})

describe('WorkoutCard - null workout', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('renders Active Recovery Day when no workout', () => {
    render(<WorkoutCard workout={null} />)
    expect(screen.getByText('Active Recovery Day')).toBeInTheDocument()
  })

  it('renders recovery message', () => {
    render(<WorkoutCard workout={null} />)
    expect(screen.getByText('Light movement, big gains')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Focus on your 7k steps and the Bike today. Recovery is when muscles grow.',
      ),
    ).toBeInTheDocument()
  })

  it('has Start Custom Workout button', () => {
    render(<WorkoutCard workout={null} />)
    expect(
      screen.getByRole('button', { name: 'Start Custom Workout' }),
    ).toBeInTheDocument()
  })

  it('navigates to workout page when button clicked', () => {
    render(<WorkoutCard workout={null} />)
    fireEvent.click(
      screen.getByRole('button', { name: 'Start Custom Workout' }),
    )
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/workout' })
  })
})

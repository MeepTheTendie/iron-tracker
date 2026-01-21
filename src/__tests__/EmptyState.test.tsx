import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  EmptyState,
  WorkoutEmptyState,
  HabitsEmptyState,
  HistoryEmptyState,
} from '../components/EmptyState'

describe('EmptyState', () => {
  it('renders with icon, title, and description', () => {
    render(
      <EmptyState
        icon={<span data-testid="icon">★</span>}
        title="Test Title"
        description="Test description goes here"
      />,
    )
    expect(screen.getByTestId('icon')).toBeInTheDocument()
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test description goes here')).toBeInTheDocument()
  })

  it('does not render action button when not provided', () => {
    render(
      <EmptyState
        icon={<span>★</span>}
        title="Test"
        description="Description"
      />,
    )
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders action button with correct label', () => {
    const handleClick = vi.fn()
    render(
      <EmptyState
        icon={<span>★</span>}
        title="Test"
        description="Description"
        action={{ label: 'Click Me', onClick: handleClick }}
      />,
    )
    expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument()
  })

  it('calls onClick when action button is clicked', () => {
    const handleClick = vi.fn()
    render(
      <EmptyState
        icon={<span>★</span>}
        title="Test"
        description="Description"
        action={{ label: 'Click Me', onClick: handleClick }}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Click Me' }))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies correct color theme - pink', () => {
    render(
      <EmptyState
        icon={<span>★</span>}
        title="Test"
        description="Description"
        color="pink"
      />,
    )
    const headerDiv = screen.getByRole('heading', { name: 'Test' }).closest('div')
    expect(headerDiv).toHaveClass('bg-rose-200')
  })

  it('applies correct color theme - blue', () => {
    render(
      <EmptyState
        icon={<span>★</span>}
        title="Test"
        description="Description"
        color="blue"
      />,
    )
    const headerDiv = screen.getByRole('heading', { name: 'Test' }).closest('div')
    expect(headerDiv).toHaveClass('bg-sky-200')
  })

  it('applies correct color theme - green', () => {
    render(
      <EmptyState
        icon={<span>★</span>}
        title="Test"
        description="Description"
        color="green"
      />,
    )
    const headerDiv = screen.getByRole('heading', { name: 'Test' }).closest('div')
    expect(headerDiv).toHaveClass('bg-emerald-200')
  })

  it('includes plus icon in action button', () => {
    render(
      <EmptyState
        icon={<span>★</span>}
        title="Test"
        description="Description"
        action={{ label: 'Add Item', onClick: vi.fn() }}
      />,
    )
    const button = screen.getByRole('button', { name: 'Add Item' })
    expect(button.querySelector('svg')).toBeInTheDocument()
  })
})

describe('WorkoutEmptyState', () => {
  it('renders No Workout Today title', () => {
    render(<WorkoutEmptyState onStart={() => {}} />)
    expect(screen.getByText('No Workout Today')).toBeInTheDocument()
  })

  it('renders rest day description', () => {
    render(<WorkoutEmptyState onStart={() => {}} />)
    expect(screen.getByText('Take a rest day or start a custom workout')).toBeInTheDocument()
  })

  it('has clickable plus button', () => {
    const handleStart = vi.fn()
    render(<WorkoutEmptyState onStart={handleStart} />)
    const plusButton = screen.getByLabelText('Start custom workout')
    fireEvent.click(plusButton)
    expect(handleStart).toHaveBeenCalledTimes(1)
  })

  it('has Start Custom Workout button', () => {
    render(<WorkoutEmptyState onStart={() => {}} />)
    expect(screen.getByRole('button', { name: 'Start Custom Workout' })).toBeInTheDocument()
  })

  it('shows plus icon in header', () => {
    render(<WorkoutEmptyState onStart={() => {}} />)
    const plusButton = screen.getByLabelText('Start custom workout')
    expect(plusButton.querySelector('svg')).toBeInTheDocument()
  })
})

describe('HabitsEmptyState', () => {
  it('renders No Habits Yet title', () => {
    render(<HabitsEmptyState onAdd={() => {}} />)
    expect(screen.getByText('No Habits Yet')).toBeInTheDocument()
  })

  it('renders Add Your First Habit button', () => {
    const handleAdd = vi.fn()
    render(<HabitsEmptyState onAdd={handleAdd} />)
    expect(screen.getByRole('button', { name: 'Add Your First Habit' })).toBeInTheDocument()
  })

  it('calls onAdd when button is clicked', () => {
    const handleAdd = vi.fn()
    render(<HabitsEmptyState onAdd={handleAdd} />)
    fireEvent.click(screen.getByRole('button', { name: 'Add Your First Habit' }))
    expect(handleAdd).toHaveBeenCalledTimes(1)
  })
})

describe('HistoryEmptyState', () => {
  it('renders No History Yet title', () => {
    render(<HistoryEmptyState />)
    expect(screen.getByText('No History Yet')).toBeInTheDocument()
  })

  it('does not have action button', () => {
    render(<HistoryEmptyState />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})

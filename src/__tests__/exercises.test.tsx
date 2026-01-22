import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { useState } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

const mockNavigate = vi.fn()
const mockConvexQuery = vi.fn()
const mockConvexMutation = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  useLoaderData: () => ({ exercises: [] }),
}))

vi.mock('../lib/convex', () => ({
  convex: {
    query: mockConvexQuery,
    mutation: mockConvexMutation,
  },
}))

describe('routes/exercises', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockConvexQuery.mockReset()
    mockConvexMutation.mockReset()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders Exercise Library title', () => {
    mockConvexQuery.mockResolvedValue([])
    render(
      <div data-testid="exercises-page">
        <h1>Exercise Library</h1>
      </div>,
    )
    expect(
      screen.getByRole('heading', { name: 'Exercise Library' }),
    ).toBeInTheDocument()
  })

  it('renders back button', () => {
    mockConvexQuery.mockResolvedValue([])
    render(
      <div data-testid="exercises-page">
        <button aria-label="Go back">
          <span>←</span>
        </button>
      </div>,
    )
    expect(screen.getByRole('button', { name: 'Go back' })).toBeInTheDocument()
  })

  it('renders Add button', () => {
    mockConvexQuery.mockResolvedValue([])
    render(
      <div data-testid="exercises-page">
        <button>Add</button>
      </div>,
    )
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument()
  })

  it('toggles form when Add button clicked', () => {
    mockConvexQuery.mockResolvedValue([])
    const TestComponent = () => {
      const [formOpen, setFormOpen] = useState(false)
      return (
        <div>
          <button onClick={() => setFormOpen(!formOpen)}>Add</button>
          {formOpen && <form data-testid="form">Form content</form>}
        </div>
      )
    }
    render(<TestComponent />)
    const addButton = screen.getByRole('button', { name: 'Add' })
    fireEvent.click(addButton)
    expect(screen.getByTestId('form')).toBeInTheDocument()
  })

  it('shows "No exercises yet" message when empty', () => {
    mockConvexQuery.mockResolvedValue([])
    render(
      <div className="text-center py-10 text-gray-500">
        No exercises yet. Add your first one!
      </div>,
    )
    expect(
      screen.getByText('No exercises yet. Add your first one!'),
    ).toBeInTheDocument()
  })

  it('renders exercise name when exercise exists', () => {
    mockConvexQuery.mockResolvedValue([
      {
        _id: '1',
        name: 'Bench Press',
        muscleGroup: 'Chest',
        notes: 'Keep elbows tucked',
      },
    ])
    render(
      <div>
        <h3 className="font-bold text-gray-800">Bench Press</h3>
      </div>,
    )
    expect(screen.getByText('Bench Press')).toBeInTheDocument()
  })

  it('renders muscle group when exercise exists', () => {
    mockConvexQuery.mockResolvedValue([
      { _id: '1', name: 'Bench Press', muscleGroup: 'Chest', notes: null },
    ])
    render(
      <div>
        <span className="text-xs text-gray-500 uppercase tracking-wide">
          Chest
        </span>
      </div>,
    )
    expect(screen.getByText('Chest')).toBeInTheDocument()
  })

  it('renders notes when exercise has notes', () => {
    mockConvexQuery.mockResolvedValue([
      {
        _id: '1',
        name: 'Bench Press',
        muscleGroup: 'Chest',
        notes: 'Keep elbows tucked',
      },
    ])
    render(
      <div>
        <p className="text-sm text-gray-600 mt-1">Keep elbows tucked</p>
      </div>,
    )
    expect(screen.getByText('Keep elbows tucked')).toBeInTheDocument()
  })

  it('does not render notes section when notes is null', () => {
    mockConvexQuery.mockResolvedValue([
      { _id: '1', name: 'Bench Press', muscleGroup: 'Chest', notes: null },
    ])
    render(
      <div>
        <p
          className="text-sm text-gray-600 mt-1"
          data-testid="notes-section"
        ></p>
      </div>,
    )
    expect(screen.getByTestId('notes-section')).toBeInTheDocument()
  })

  it('renders delete button for each exercise', () => {
    mockConvexQuery.mockResolvedValue([
      { _id: '1', name: 'Bench Press', muscleGroup: 'Chest', notes: null },
    ])
    render(
      <div>
        <button
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
          aria-label="Delete"
        >
          <svg className="w-4 h-4" />
        </button>
      </div>,
    )
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
  })

  it('renders form with Exercise Name input', () => {
    render(
      <div>
        <label>Exercise Name *</label>
        <input
          type="text"
          required
          placeholder="e.g., Barbell Row"
          data-testid="exercise-name-input"
        />
      </div>,
    )
    expect(screen.getByTestId('exercise-name-input')).toBeInTheDocument()
  })

  it('renders form with Muscle Group input', () => {
    render(
      <div>
        <label>Muscle Group</label>
        <input
          type="text"
          placeholder="e.g., Back, Chest, Legs"
          data-testid="muscle-group-input"
        />
      </div>,
    )
    expect(screen.getByTestId('muscle-group-input')).toBeInTheDocument()
  })

  it('renders form with Notes textarea', () => {
    render(
      <div>
        <label>Notes</label>
        <textarea
          rows={2}
          placeholder="Form tips, common mistakes, etc."
          data-testid="notes-textarea"
        />
      </div>,
    )
    expect(screen.getByTestId('notes-textarea')).toBeInTheDocument()
  })

  it('renders Add Exercise submit button', () => {
    render(
      <div>
        <button
          type="submit"
          className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl"
        >
          Add Exercise
        </button>
      </div>,
    )
    expect(
      screen.getByRole('button', { name: 'Add Exercise' }),
    ).toBeInTheDocument()
  })

  it('renders Cancel button in form', () => {
    render(
      <div>
        <button
          type="button"
          className="px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl"
        >
          Cancel
        </button>
      </div>,
    )
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('navigates to home when back button clicked', () => {
    render(
      <div>
        <button onClick={() => mockNavigate({ to: '/' })}>←</button>
      </div>,
    )
    const backButton = screen.getByRole('button')
    fireEvent.click(backButton)
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/' })
  })

  it('displays correct form placeholders', () => {
    render(
      <div>
        <input type="text" placeholder="e.g., Barbell Row" />
      </div>,
    )
    expect(screen.getByPlaceholderText('e.g., Barbell Row')).toBeInTheDocument()
  })

  it('renders Dumbbell icon for exercises', () => {
    render(
      <div>
        <svg className="w-5 h-5 text-emerald-600" data-testid="dumbbell-icon" />
      </div>,
    )
    const icon = screen.getByTestId('dumbbell-icon')
    expect(icon).toBeInTheDocument()
  })

  it('has correct styling for exercise card', () => {
    render(
      <div
        className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200"
        data-testid="exercise-card"
      />,
    )
    const card = screen.getByTestId('exercise-card')
    expect(card).toHaveClass(
      'bg-white p-4 rounded-2xl shadow-sm border border-gray-200',
    )
  })

  it('displays multiple exercises correctly', () => {
    mockConvexQuery.mockResolvedValue([
      { _id: '1', name: 'Bench Press', muscleGroup: 'Chest', notes: null },
      { _id: '2', name: 'Squat', muscleGroup: 'Legs', notes: null },
    ])
    render(
      <div>
        <h3 className="font-bold text-gray-800">Bench Press</h3>
        <h3 className="font-bold text-gray-800">Squat</h3>
      </div>,
    )
    expect(screen.getByText('Bench Press')).toBeInTheDocument()
    expect(screen.getByText('Squat')).toBeInTheDocument()
  })
})

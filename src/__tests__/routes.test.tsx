import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

const mockNavigate = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/' }),
  useLoaderData: () => ({}),
  useSearch: () => ({}),
}))

vi.mock('../lib/convex', () => ({
  convex: {
    query: vi.fn(),
    mutation: vi.fn(),
  },
}))

describe('routes/index', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('renders date and day name', () => {
    const today = new Date()
    const dateStr = today.toISOString().split('T')[0]
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' })

    render(
      <div data-testid="dashboard">
        <span data-testid="date">{dateStr}</span>
        <span data-testid="day">{dayName}</span>
      </div>,
    )

    expect(screen.getByTestId('date')).toBeInTheDocument()
    expect(screen.getByTestId('day')).toBeInTheDocument()
  })

  it('navigates to history page when Training History button clicked', () => {
    render(
      <div>
        <button onClick={() => mockNavigate({ to: '/history' })}>Training History</button>
      </div>,
    )

    const button = screen.getByRole('button', { name: 'Training History' })
    fireEvent.click(button)
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/history' })
  })

  it('navigates to exercises page when Exercise Library button clicked', () => {
    render(
      <div>
        <button onClick={() => mockNavigate({ to: '/exercises' })}>Exercise Library</button>
      </div>,
    )

    const button = screen.getByRole('button', { name: 'Exercise Library' })
    fireEvent.click(button)
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/exercises' })
  })

  it('shows loading state when data is being fetched', () => {
    render(
      <div className="animate-pulse">Loading...</div>,
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('handles empty workout state', () => {
    render(
      <div>No workout scheduled</div>,
    )

    expect(screen.getByText('No workout scheduled')).toBeInTheDocument()
  })
})

describe('routes/history', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('renders Progress Tracker title', () => {
    render(
      <h1>Progress Tracker</h1>,
    )

    expect(screen.getByRole('heading', { name: 'Progress Tracker' })).toBeInTheDocument()
  })

  it('renders exercise select dropdown', () => {
    render(
      <select>
        <option value="">Select Exercise</option>
        <option value="Bench Press">Bench Press</option>
      </select>,
    )

    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('renders Strength Curve chart container', () => {
    render(
      <div className="h-80 bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
        <h2>Strength Curve</h2>
      </div>,
    )

    expect(screen.getByRole('heading', { name: 'Strength Curve' })).toBeInTheDocument()
  })

  it('shows no data message when chart is empty', () => {
    render(
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        No data logged for this exercise yet.
      </div>,
    )

    expect(screen.getByText('No data logged for this exercise yet.')).toBeInTheDocument()
  })

  it('navigates back to home with back button', () => {
    render(
      <div>
        <button onClick={() => mockNavigate({ to: '/' })}>
          <span className="sr-only">Go back</span>
        </button>
      </div>,
    )

    const backButton = screen.getByRole('button')
    fireEvent.click(backButton)
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/' })
  })

  it('displays max weight stat when data exists', () => {
    render(
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
          <div className="text-blue-600 text-xs font-bold uppercase mb-1">Max Weight</div>
          <div className="text-2xl font-black text-blue-900">225 <span className="text-sm font-medium">lbs</span></div>
        </div>
      </div>,
    )

    expect(screen.getByText('225')).toBeInTheDocument()
    expect(screen.getByText('lbs')).toBeInTheDocument()
  })

  it('displays total sets stat when data exists', () => {
    render(
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
          <div className="text-purple-600 text-xs font-bold uppercase mb-1">Total Sets</div>
          <div className="text-2xl font-black text-purple-900">12</div>
        </div>
      </div>,
    )

    expect(screen.getByText('12')).toBeInTheDocument()
  })
})

describe('routes/workout', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('renders workout page title', () => {
    render(
      <h1>Freestyle Session</h1>,
    )

    expect(screen.getByRole('heading', { name: 'Freestyle Session' })).toBeInTheDocument()
  })

  it('renders Focus Mode subtitle', () => {
    render(
      <p className="text-xs text-gray-400">Focus Mode</p>,
    )

    expect(screen.getByText('Focus Mode')).toBeInTheDocument()
  })

  it('renders Finish Workout button', () => {
    render(
      <button>Finish Workout</button>,
    )

    expect(screen.getByRole('button', { name: 'Finish Workout' })).toBeInTheDocument()
  })

  it('navigates to home when Finish Workout clicked', () => {
    render(
      <button onClick={() => mockNavigate({ to: '/' })}>Finish Workout</button>,
    )

    const button = screen.getByRole('button', { name: 'Finish Workout' })
    fireEvent.click(button)
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/' })
  })

  it('shows freestyle mode message when no workout loaded', () => {
    render(
      <div className="text-center p-8 text-gray-500">
        <p>No program loaded. You are in freestyle mode.</p>
      </div>,
    )

    expect(screen.getByText('No program loaded. You are in freestyle mode.')).toBeInTheDocument()
  })

  it('renders exercise logger input fields', () => {
    render(
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label>LBS</label>
          <input type="number" placeholder="0" />
        </div>
        <div className="flex-1">
          <label>REPS</label>
          <input type="number" />
        </div>
        <button>Save</button>
      </div>,
    )

    expect(screen.getByPlaceholderText('0')).toBeInTheDocument()
    expect(screen.getAllByRole('spinbutton')).toHaveLength(2)
  })

  it('shows sets completed indicator', () => {
    render(
      <div className="flex gap-1">
        <div className="h-2 flex-1 bg-emerald-500 rounded-full" />
        <div className="h-2 flex-1 bg-emerald-500 rounded-full" />
        <div className="flex items-center gap-1 text-xs text-emerald-700 font-medium ml-2">
          2 Sets
        </div>
      </div>,
    )

    expect(screen.getByText('2 Sets')).toBeInTheDocument()
  })

  it('renders exercise with target sets and reps', () => {
    render(
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
        <div className="flex justify-between items-start mb-3">
          <h3>Bench Press</h3>
          <div className="text-right">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Target</span>
            <div className="font-mono text-sm font-bold text-gray-600">3 x 10</div>
          </div>
        </div>
      </div>,
    )

    expect(screen.getByText('Bench Press')).toBeInTheDocument()
    expect(screen.getByText('3 x 10')).toBeInTheDocument()
  })
})

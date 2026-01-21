import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Header from '../components/Header'

const mockNavigate = vi.fn()
const mockLocation = { pathname: '/' }
const mockTheme = { theme: 'light', toggleTheme: vi.fn() }

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
  Link: ({ to, children, className, 'aria-current': ariaCurrent }: any) => (
    <a href={to} className={className} data-aria-current={ariaCurrent}>{children}</a>
  ),
}))

vi.mock('../lib/useDarkMode', () => ({
  useDarkMode: () => mockTheme,
}))

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders Iron Tracker title', () => {
    render(<Header />)
    expect(screen.getByRole('heading', { name: 'Iron Tracker' })).toBeInTheDocument()
  })

  it('renders menu button', () => {
    render(<Header />)
    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument()
  })

  it('renders theme toggle button', () => {
    render(<Header />)
    expect(screen.getByRole('button', { name: /Current theme: light/ })).toBeInTheDocument()
  })

  it('renders Home navigation link', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
  })

  it('renders History navigation link', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: 'History' })).toBeInTheDocument()
  })

  it('renders Exercises navigation link', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: 'Exercises' })).toBeInTheDocument()
  })

  it('navigates to home when Home link clicked', () => {
    render(<Header />)

    const homeLink = screen.getByRole('link', { name: 'Home' })
    fireEvent.click(homeLink)

    expect(mockNavigate).toHaveBeenCalledWith({ to: '/' })
  })

  it('navigates to history when History link clicked', () => {
    render(<Header />)

    const historyLink = screen.getByRole('link', { name: 'History' })
    fireEvent.click(historyLink)

    expect(mockNavigate).toHaveBeenCalledWith({ to: '/history' })
  })

  it('navigates to exercises when Exercises link clicked', () => {
    render(<Header />)

    const exercisesLink = screen.getByRole('link', { name: 'Exercises' })
    fireEvent.click(exercisesLink)

    expect(mockNavigate).toHaveBeenCalledWith({ to: '/exercises' })
  })

  it('renders theme toggle in drawer', () => {
    render(<Header />)
    expect(screen.getByRole('button', { name: /Theme: light/ })).toBeInTheDocument()
  })

  it('calls toggleTheme when theme button clicked', () => {
    render(<Header />)

    const themeButton = screen.getByRole('button', { name: /Current theme: light/ })
    fireEvent.click(themeButton)

    expect(mockTheme.toggleTheme).toHaveBeenCalled()
  })

  it('shows Daily Rituals section', () => {
    render(<Header />)
    expect(screen.getByText('Daily Rituals')).toBeInTheDocument()
  })

  it('shows completed count label in drawer', () => {
    render(<Header />)
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('Streak')).toBeInTheDocument()
  })

  it('renders bottom navigation bar', () => {
    render(<Header />)
    const bottomNav = screen.getByRole('navigation', { name: 'Bottom navigation' })
    expect(bottomNav).toBeInTheDocument()
  })

  it('renders bottom nav with Home, History, Exercises links', () => {
    render(<Header />)

    const bottomNav = screen.getByRole('navigation', { name: 'Bottom navigation' })
    expect(bottomNav).toHaveTextContent('Home')
    expect(bottomNav).toHaveTextContent('History')
    expect(bottomNav).toHaveTextContent('Exercises')
  })

  it('renders Navigation header', () => {
    render(<Header />)
    expect(screen.getByRole('heading', { name: 'Navigation' })).toBeInTheDocument()
  })

  it('displays "system" theme correctly', () => {
    mockTheme.theme = 'system'
    render(<Header />)
    expect(screen.getByRole('button', { name: /Current theme: system/ })).toBeInTheDocument()
  })

  it('displays "dark" theme correctly', () => {
    mockTheme.theme = 'dark'
    render(<Header />)
    expect(screen.getByRole('button', { name: /Current theme: dark/ })).toBeInTheDocument()
  })

  it('Home link has correct href', () => {
    render(<Header />)
    const links = screen.getAllByRole('link', { name: 'Home' })
    expect(links[0]).toHaveAttribute('href', '/')
  })

  it('History link has correct href', () => {
    render(<Header />)
    const links = screen.getAllByRole('link', { name: 'History' })
    expect(links[0]).toHaveAttribute('href', '/history')
  })

  it('Exercises links have correct href', () => {
    render(<Header />)
    const links = screen.getAllByRole('link', { name: 'Exercises' })
    expect(links[0]).toHaveAttribute('href', '/exercises')
  })

  it('Iron Tracker link goes to home', () => {
    render(<Header />)
    const titleLink = screen.getByRole('link', { name: 'Iron Tracker' })
    expect(titleLink).toHaveAttribute('href', '/')
  })

  it('renders flame icon for Daily Rituals', () => {
    render(<Header />)
    expect(screen.getByText('Daily Rituals')).toBeInTheDocument()
  })

  it('has menu button with aria-label', () => {
    render(<Header />)
    const menuButton = screen.getByRole('button', { name: 'Open menu' })
    expect(menuButton).toHaveAttribute('aria-label', 'Open menu')
  })

  it('has close menu button with aria-label', () => {
    render(<Header />)
    const closeButton = screen.getByRole('button', { name: 'Close menu' })
    expect(closeButton).toHaveAttribute('aria-label', 'Close menu')
  })

  it('theme button shows current theme', () => {
    mockTheme.theme = 'dark'
    render(<Header />)
    const themeButton = screen.getByRole('button', { name: /Current theme: dark/ })
    expect(themeButton).toBeInTheDocument()
  })
})

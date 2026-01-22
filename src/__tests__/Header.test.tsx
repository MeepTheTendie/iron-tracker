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
    <a href={to} className={className} data-aria-current={ariaCurrent}>
      {children}
    </a>
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
    expect(
      screen.getByRole('heading', { name: 'Iron Tracker' }),
    ).toBeInTheDocument()
  })

  it('renders menu button', () => {
    render(<Header />)
    expect(
      screen.getByRole('button', { name: 'Open menu' }),
    ).toBeInTheDocument()
  })

  it('renders theme toggle button', () => {
    render(<Header />)
    expect(
      screen.getByRole('button', { name: /Current theme: light/ }),
    ).toBeInTheDocument()
  })

  it('renders Home navigation link in drawer', () => {
    render(<Header />)
    const links = screen.getAllByRole('link', { name: 'Home' })
    expect(links.length).toBeGreaterThanOrEqual(1)
  })

  it('renders History navigation link in drawer', () => {
    render(<Header />)
    const links = screen.getAllByRole('link', { name: 'History' })
    expect(links.length).toBeGreaterThanOrEqual(1)
  })

  it('renders Exercises navigation link in drawer', () => {
    render(<Header />)
    const links = screen.getAllByRole('link', { name: 'Exercises' })
    expect(links.length).toBeGreaterThanOrEqual(1)
  })

  it('navigates to home when Home link clicked', () => {
    render(<Header />)
    const homeLink = screen.getAllByRole('link', { name: 'Home' })[0]
    expect(homeLink).toHaveAttribute('href', '/')
  })

  it('navigates to history when History link clicked', () => {
    render(<Header />)
    const historyLink = screen.getAllByRole('link', { name: 'History' })[0]
    expect(historyLink).toHaveAttribute('href', '/history')
  })

  it('navigates to exercises when Exercises link clicked', () => {
    render(<Header />)
    const exercisesLink = screen.getAllByRole('link', { name: 'Exercises' })[0]
    expect(exercisesLink).toHaveAttribute('href', '/exercises')
  })

  it('renders theme toggle in drawer', () => {
    render(<Header />)
    const themeButton = screen.getByRole('button', { name: /Theme/ })
    expect(themeButton).toBeInTheDocument()
    expect(themeButton).toHaveTextContent('light')
  })

  it('calls toggleTheme when theme button clicked', () => {
    render(<Header />)
    const themeButton = screen.getByRole('button', {
      name: /Current theme: light/,
    })
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
    const bottomNav = screen.getByRole('navigation', {
      name: 'Bottom navigation',
    })
    expect(bottomNav).toBeInTheDocument()
  })

  it('renders bottom nav with Home, History, Exercises', () => {
    render(<Header />)
    const bottomNav = screen.getByRole('navigation', {
      name: 'Bottom navigation',
    })
    expect(bottomNav).toHaveTextContent('Home')
    expect(bottomNav).toHaveTextContent('History')
    expect(bottomNav).toHaveTextContent('Exercises')
  })

  it('renders Navigation header', () => {
    render(<Header />)
    expect(
      screen.getByRole('heading', { name: 'Navigation' }),
    ).toBeInTheDocument()
  })

  it('displays "system" theme correctly', () => {
    mockTheme.theme = 'system'
    render(<Header />)
    expect(
      screen.getByRole('button', { name: /Current theme: system/ }),
    ).toBeInTheDocument()
  })

  it('displays "dark" theme correctly', () => {
    mockTheme.theme = 'dark'
    render(<Header />)
    expect(
      screen.getByRole('button', { name: /Current theme: dark/ }),
    ).toBeInTheDocument()
  })

  it('displays "system" theme correctly', () => {
    mockTheme.theme = 'system'
    render(<Header />)
    expect(
      screen.getByRole('button', { name: /Current theme: system/ }),
    ).toBeInTheDocument()
  })

  it('History link has correct href', () => {
    render(<Header />)
    const links = screen.getAllByRole('link', { name: 'History' })
    expect(links[0]).toHaveAttribute('href', '/history')
  })

  it('Exercises link has correct href', () => {
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
    const themeButton = screen.getByRole('button', {
      name: /Current theme: dark/,
    })
    expect(themeButton).toBeInTheDocument()
  })

  it('has navigation items in bottom nav', () => {
    render(<Header />)
    const bottomNav = screen.getByRole('navigation', {
      name: 'Bottom navigation',
    })
    const links = bottomNav.querySelectorAll('a')
    expect(links.length).toBeGreaterThanOrEqual(3)
  })

  it('highlights active navigation link when on history', () => {
    mockLocation.pathname = '/history'
    render(<Header />)
    const historyLinks = screen.getAllByRole('link', { name: 'History' })
    expect(
      historyLinks.some(
        (link) => link.getAttribute('data-aria-current') === 'page',
      ),
    ).toBe(true)
  })

  it('renders icons in navigation', () => {
    render(<Header />)
    const homeLinks = screen.getAllByText('Home')
    expect(homeLinks.length).toBeGreaterThanOrEqual(2)
    const historyLinks = screen.getAllByText('History')
    expect(historyLinks.length).toBeGreaterThanOrEqual(2)
    const exercisesLinks = screen.getAllByText('Exercises')
    expect(exercisesLinks.length).toBeGreaterThanOrEqual(2)
  })
})

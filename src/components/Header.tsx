import { Link, useLocation } from '@tanstack/react-router'

import { useState } from 'react'
import {
  Dumbbell,
  Flame,
  Home,
  Menu,
  Moon,
  Sun,
  TrendingUp,
  X,
} from 'lucide-react'
import { useDarkMode } from '../lib/useDarkMode'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const { theme, toggleTheme } = useDarkMode()

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/history', label: 'History', icon: TrendingUp },
    { to: '/exercises', label: 'Exercises', icon: Dumbbell },
  ]

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const themeIcon =
    theme === 'dark' ? (
      <Moon size={20} className="fill-yellow-300 text-yellow-300" />
    ) : theme === 'system' ? (
      <Sun size={20} className="text-orange-400" />
    ) : (
      <Sun size={20} className="text-yellow-400" />
    )

  return (
    <>
      {/* Top Header */}
      <header className="w-full max-w-md mx-auto p-4 flex items-center justify-between bg-rose-100 text-gray-800 shadow-sm border-b-2 border-rose-200 sticky top-0 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-rose-200 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold">
          <Link to="/">Iron Tracker</Link>
        </h1>
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-rose-200 rounded-lg transition-colors"
          aria-label={`Current theme: ${theme}. Click to cycle through themes.`}
          title={`Theme: ${theme}`}
        >
          {themeIcon}
        </button>
      </header>

      {/* Side Navigation Drawer - Wes Anderson pastel */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-rose-50 text-gray-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between p-4 border-b border-rose-200">
          <h2 className="text-xl font-bold text-rose-800">Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-rose-200 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors mb-2 ${
                isActive(item.to) ? 'bg-rose-300 text-rose-900' : 'hover:bg-rose-200'
              }`}
              aria-current={isActive(item.to) ? 'page' : undefined}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Theme Setting in Drawer */}
        <div className="p-4 border-t border-rose-200">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 p-3 w-full rounded-lg hover:bg-rose-200 transition-colors"
          >
            {themeIcon}
            <div className="text-left">
              <div className="font-medium">Theme</div>
              <div className="text-xs text-gray-500 capitalize">{theme}</div>
            </div>
          </button>
        </div>

        {/* Daily Rituals Stats */}
        <div className="p-4 border-t border-rose-200 bg-rose-50">
          <div className="flex items-center gap-2 text-rose-600 mb-2">
            <Flame size={20} className="fill-rose-400" />
            <span className="font-bold">Daily Rituals</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white rounded-lg p-2 text-center">
              <div className="font-bold text-lg text-gray-800">0</div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
            <div className="bg-white rounded-lg p-2 text-center">
              <div className="font-bold text-lg text-gray-800">0</div>
              <div className="text-xs text-gray-500">Streak</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar - Pastel colors */}
      <nav
        className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-100 shadow-lg z-40 safe-area-pb"
        aria-label="Bottom navigation"
      >
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const active = isActive(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
                  active
                    ? 'text-rose-600 bg-rose-50'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <item.icon size={24} className={active ? 'scale-110' : ''} />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Spacer for bottom navigation */}
      <div className="h-16" />
    </>
  )
}

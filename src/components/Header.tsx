import { Link, useLocation } from '@tanstack/react-router'

import { useState } from 'react'
import { Home, Menu, X, Dumbbell, TrendingUp, Flame } from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/history', label: 'History', icon: TrendingUp },
    { to: '/exercises', label: 'Exercises', icon: Dumbbell },
  ]

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <>
      {/* Top Header */}
      <header className="p-4 flex items-center justify-between bg-gray-900 text-white shadow-lg sticky top-0 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold">
          <Link to="/">Iron Tracker</Link>
        </h1>
        <div className="w-10" /> {/* Spacer for balance */}
      </header>

      {/* Side Navigation Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-gray-900 text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
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
                isActive(item.to) ? 'bg-emerald-600' : 'hover:bg-gray-800'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Stats in Drawer */}
        <div className="p-4 border-t border-gray-700 bg-gray-800">
          <div className="flex items-center gap-2 text-emerald-400">
            <Flame size={20} className="fill-emerald-400" />
            <span className="font-medium">Daily Rituals</span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Track your habits and progress
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 safe-area-pb">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const active = isActive(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  active
                    ? 'text-emerald-600 bg-emerald-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
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

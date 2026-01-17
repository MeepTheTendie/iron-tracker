import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

export function useDarkMode() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme') as Theme | null
      if (stored) return stored
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  })

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (stored === 'system' || (!stored && systemDark)) {
      setResolvedTheme('dark')
      document.documentElement.classList.add('dark')
    } else if (stored === 'dark' || (!stored && !systemDark)) {
      setResolvedTheme('dark')
      document.documentElement.classList.add('dark')
    } else {
      setResolvedTheme('light')
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      if (theme === 'system') {
        const isDark = mediaQuery.matches
        setResolvedTheme(isDark ? 'dark' : 'light')
        if (isDark) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    }
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [theme])

  const toggleTheme = () => {
    const themes: Array<Theme> = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    const nextTheme = themes[nextIndex]
    setTheme(nextTheme)
    localStorage.setItem('theme', nextTheme)
  }

  return { theme, resolvedTheme, toggleTheme, setTheme }
}

import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { routeTree } from './routeTree.gen'
import { queryClient } from './lib/queryClient'
import './styles.css'
import reportWebVitals from './reportWebVitals.ts'

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Error boundary for unhandled errors
// Note: TanStack Router handles errors via errorElement in route definitions

const RootApp = () => (
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
  </QueryClientProvider>
)

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <RootApp />
    </StrictMode>,
  )
}

// Run web vitals asynchronously (don't block rendering)
const runWebVitals = () => {
  try {
    reportWebVitals()
  } catch (e) {
    console.warn('WebVitals error:', e)
  }
}

// Defer web vitals to not block initial render
if (typeof requestIdleCallback !== 'undefined') {
  requestIdleCallback(runWebVitals)
} else {
  setTimeout(runWebVitals, 1000)
}

// Defer service worker registration (Phase 1 optimization)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Delay SW registration to not block initial load
    setTimeout(() => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration.scope)
        })
        .catch((error) => {
          console.log('SW registration failed:', error)
        })
    }, 5000) // Register after 5 seconds, not on initial load
  })
}

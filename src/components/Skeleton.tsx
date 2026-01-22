export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      data-testid="skeleton"
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
        animation: 'shimmer 1.5s infinite',
      }}
    />
  )
}

export function SkeletonCard() {
  return (
    <div
      data-testid="skeleton-card"
      className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden p-5"
    >
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div className="flex-1">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-16 w-full rounded-lg" />
      </div>
      <Skeleton className="h-12 w-full rounded-xl mt-4" />
    </div>
  )
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export function SkeletonButton() {
  return (
    <div
      data-testid="skeleton-button"
      className="bg-white rounded-2xl border border-gray-200 p-4"
    >
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="flex-1">
          <Skeleton className="h-5 w-36 mb-2" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>
    </div>
  )
}

export function SkeletonHabitTracker() {
  return (
    <div
      data-testid="skeleton-habit-tracker"
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5"
    >
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-xl bg-gray-100 animate-pulse"
          />
        ))}
      </div>
    </div>
  )
}

// Add shimmer animation if not in global styles
const shimmerStyles = `
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
`

// Inject styles
if (typeof document !== 'undefined') {
  const styleId = 'skeleton-shimmer'
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style')
    style.id = styleId
    style.textContent = shimmerStyles
    document.head.appendChild(style)
  }
}

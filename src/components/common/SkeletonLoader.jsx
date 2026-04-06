export default function SkeletonLoader({ count = 4, type = 'card' }) {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden shadow-card">
            {/* Image skeleton */}
            <div className="w-full h-44 bg-shimmer-loading bg-[length:1000px_100%] animate-shimmer" />
            
            {/* Content skeleton */}
            <div className="p-4 space-y-3">
              {/* Title */}
              <div className="h-4 bg-shimmer-loading bg-[length:1000px_100%] animate-shimmer rounded-lg w-3/4" />
              
              {/* Description */}
              <div className="space-y-2">
                <div className="h-3 bg-shimmer-loading bg-[length:1000px_100%] animate-shimmer rounded w-full" />
                <div className="h-3 bg-shimmer-loading bg-[length:1000px_100%] animate-shimmer rounded w-2/3" />
              </div>

              {/* Bottom row */}
              <div className="flex justify-between pt-2">
                <div className="h-4 bg-shimmer-loading bg-[length:1000px_100%] animate-shimmer rounded w-1/4" />
                <div className="h-8 bg-shimmer-loading bg-[length:1000px_100%] animate-shimmer rounded-lg w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'store') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden shadow-card">
            {/* Image skeleton */}
            <div className="w-full h-48 bg-shimmer-loading bg-[length:1000px_100%] animate-shimmer" />
            
            {/* Content skeleton */}
            <div className="p-4 space-y-3">
              {/* Name */}
              <div className="h-4 bg-shimmer-loading bg-[length:1000px_100%] animate-shimmer rounded-lg w-4/5" />
              
              {/* Info row */}
              <div className="h-3 bg-shimmer-loading bg-[length:1000px_100%] animate-shimmer rounded w-1/2" />

              {/* Tags */}
              <div className="flex gap-1.5">
                <div className="h-6 bg-shimmer-loading bg-[length:1000px_100%] animate-shimmer rounded-full w-16" />
                <div className="h-6 bg-shimmer-loading bg-[length:1000px_100%] animate-shimmer rounded-full w-20" />
              </div>

              {/* Reviews */}
              <div className="h-3 bg-shimmer-loading bg-[length:1000px_100%] animate-shimmer rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return null
}

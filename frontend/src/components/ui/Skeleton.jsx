import { cn } from '../../lib/utils'

/**
 * Skeleton Component
 * 
 * Loading placeholder component that mimics the structure of content while it loads.
 * Provides smooth animation and various preset shapes.
 * 
 * @example
 * <Skeleton className="h-4 w-full" />
 * <Skeleton variant="circle" size="lg" />
 * <SkeletonText lines={3} />
 */

const Skeleton = ({
  variant = 'rectangle',
  size = 'md',
  animated = true,
  className,
  children,
  ...props
}) => {
  const baseClasses = cn(
    'bg-gray-200 shrink-0',
    animated && 'animate-pulse'
  )

  const variantClasses = {
    rectangle: 'rounded',
    rounded: 'rounded-md',
    circle: 'rounded-full',
    text: 'rounded-sm h-4'
  }

  const sizeClasses = {
    xs: variant === 'circle' ? 'h-6 w-6' : 'h-3',
    sm: variant === 'circle' ? 'h-8 w-8' : 'h-4',
    md: variant === 'circle' ? 'h-10 w-10' : 'h-5',
    lg: variant === 'circle' ? 'h-12 w-12' : 'h-6',
    xl: variant === 'circle' ? 'h-16 w-16' : 'h-8'
  }

  if (children) {
    return (
      <div className={cn(baseClasses, className)} {...props}>
        {children}
      </div>
    )
  }

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
}

// Text skeleton for multiple lines
const SkeletonText = ({
  lines = 3,
  className,
  animated = true,
  lastLineWidth = '75%',
  ...props
}) => {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'h-4 bg-gray-200 rounded-sm',
            animated && 'animate-pulse',
            index === lines - 1 && 'opacity-75'
          )}
          style={{
            width: index === lines - 1 ? lastLineWidth : '100%'
          }}
        />
      ))}
    </div>
  )
}

// Avatar skeleton
const SkeletonAvatar = ({
  size = 'md',
  animated = true,
  className,
  ...props
}) => {
  return (
    <Skeleton
      variant="circle"
      size={size}
      animated={animated}
      className={className}
      {...props}
    />
  )
}

// Card skeleton for content placeholders
const SkeletonCard = ({
  animated = true,
  showAvatar = false,
  className,
  ...props
}) => {
  return (
    <div className={cn('p-4 border rounded-lg', className)} {...props}>
      {/* Header with avatar and title */}
      <div className="flex items-center space-x-3 mb-4">
        {showAvatar && (
          <SkeletonAvatar size="sm" animated={animated} />
        )}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/4" animated={animated} />
          <Skeleton className="h-3 w-1/6" animated={animated} />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <SkeletonText lines={2} animated={animated} />
        <Skeleton className="h-32 w-full rounded" animated={animated} />
        <SkeletonText lines={1} animated={animated} lastLineWidth="60%" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t">
        <div className="flex space-x-2">
          <Skeleton className="h-6 w-16 rounded-full" animated={animated} />
          <Skeleton className="h-6 w-16 rounded-full" animated={animated} />
        </div>
        <Skeleton className="h-8 w-20 rounded" animated={animated} />
      </div>
    </div>
  )
}

// List skeleton for multiple items
const SkeletonList = ({
  items = 5,
  showAvatar = true,
  animated = true,
  className,
  ...props
}) => {
  return (
    <div className={cn('space-y-4', className)} {...props}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3">
          {showAvatar && (
            <SkeletonAvatar size="sm" animated={animated} />
          )}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full" animated={animated} />
            <Skeleton className="h-3 w-3/4" animated={animated} />
          </div>
        </div>
      ))}
    </div>
  )
}

// Table skeleton
const SkeletonTable = ({
  rows = 5,
  cols = 4,
  animated = true,
  className,
  ...props
}) => {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, index) => (
          <Skeleton key={index} className="h-6 w-full" animated={animated} />
        ))}
      </div>

      {/* Rows */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
          >
            {Array.from({ length: cols }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-4 w-full" animated={animated} />
            ))}
          </div>
        ))}
      </div>
    </div>  )
}

export default Skeleton
export { 
  Skeleton, 
  SkeletonText, 
  SkeletonAvatar, 
  SkeletonCard, 
  SkeletonList, 
  SkeletonTable 
}

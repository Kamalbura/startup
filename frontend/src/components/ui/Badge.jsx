import { cn } from '../../lib/utils'

/**
 * Badge Component
 * 
 * A versatile badge component for displaying status, categories, counts, and labels.
 * Supports multiple variants, sizes, and can be dismissible.
 * 
 * @example
 * <Badge variant="success">Active</Badge>
 * <Badge variant="warning" size="sm">Pending</Badge>
 * <Badge variant="outline" dismissible onDismiss={() => {}}>Tag</Badge>
 */

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dismissible = false,
  className,
  onDismiss,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    primary: 'bg-primary-100 text-primary-800 hover:bg-primary-200',
    secondary: 'bg-secondary-100 text-secondary-800 hover:bg-secondary-200',
    success: 'bg-green-100 text-green-800 hover:bg-green-200',
    warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    error: 'bg-red-100 text-red-800 hover:bg-red-200',
    info: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    solid: 'bg-gray-800 text-white hover:bg-gray-700',
    gradient: 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600'
  }

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  }

  const handleDismiss = (e) => {
    e.stopPropagation()
    if (onDismiss) {
      onDismiss()
    }
  }

  return (
    <span
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        dismissible && 'pr-1',
        className
      )}
      {...props}
    >
      {children}
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className={cn(
            'ml-1.5 inline-flex items-center justify-center rounded-full hover:bg-black hover:bg-opacity-10 focus:outline-none focus:bg-black focus:bg-opacity-10',
            size === 'xs' ? 'h-3 w-3' :
            size === 'sm' ? 'h-3.5 w-3.5' :
            size === 'md' ? 'h-4 w-4' : 'h-5 w-5'
          )}
        >
          <svg
            className={cn(
              'stroke-current',
              size === 'xs' ? 'h-2 w-2' :
              size === 'sm' ? 'h-2.5 w-2.5' :
              size === 'md' ? 'h-3 w-3' : 'h-3.5 w-3.5'
            )}
            fill="none"
            viewBox="0 0 8 8"
          >
            <path strokeLinecap="round" strokeWidth="1.5" d="m1 1 6 6m0-6L1 7" />
          </svg>
        </button>
      )}
    </span>
  )
}

// Badge Group for displaying multiple badges
const BadgeGroup = ({
  children,
  max = 5,
  className,
  showMore = true,
  spacing = 'normal',
  ...props
}) => {
  const badges = Array.isArray(children) ? children : [children]
  const visibleBadges = badges.slice(0, max)
  const hiddenCount = badges.length - max

  const spacingClasses = {
    tight: 'gap-1',
    normal: 'gap-2',
    loose: 'gap-3'
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-center',
        spacingClasses[spacing],
        className
      )}
      {...props}
    >
      {visibleBadges}
      {hiddenCount > 0 && showMore && (
        <Badge variant="outline" size="sm">
          +{hiddenCount} more
        </Badge>
      )}
    </div>
  )
}

// Numeric Badge for counts and notifications
const NumericBadge = ({
  count,
  max = 99,
  showZero = false,
  variant = 'primary',
  size = 'sm',
  className,
  ...props
}) => {
  if (count === 0 && !showZero) return null

  const displayCount = count > max ? `${max}+` : count.toString()

  return (
    <Badge
      variant={variant}
      size={size}
      className={cn('tabular-nums', className)}
      {...props}
    >
      {displayCount}
    </Badge>
  )
}

export default Badge
export { Badge, BadgeGroup, NumericBadge }

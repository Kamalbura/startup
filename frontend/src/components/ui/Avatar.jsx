import { useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Avatar Component
 * 
 * A flexible avatar component that supports images, initials, and fallbacks.
 * Perfect for user profiles, team member cards, and comment sections.
 * 
 * @example
 * <Avatar src="/user.jpg" alt="John Doe" size="lg" />
 * <Avatar fallback="JD" size="sm" />
 * <Avatar>
 *   <img src="/user.jpg" alt="User" />
 * </Avatar>
 */

const Avatar = ({
  src,
  alt,
  fallback,
  size = 'md',
  className,
  children,
  ...props
}) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
    '2xl': 'h-20 w-20 text-2xl'
  }

  const baseClasses = 'relative inline-flex items-center justify-center rounded-full bg-gray-100 overflow-hidden select-none'

  // If children are provided, use them
  if (children) {
    return (
      <div 
        className={cn(baseClasses, sizeClasses[size], className)}
        {...props}
      >
        {children}
      </div>
    )
  }

  // Show fallback if no src or image failed to load
  const showFallback = !src || imageError || !imageLoaded

  return (
    <div 
      className={cn(baseClasses, sizeClasses[size], className)}
      {...props}
    >
      {src && !imageError && (
        <img
          src={src}
          alt={alt || 'Avatar'}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-200',
            imageLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      )}
      
      {showFallback && (
        <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-primary-500 to-primary-600 text-white font-medium">
          {fallback || (alt ? alt.charAt(0).toUpperCase() : '?')}
        </div>
      )}
    </div>
  )
}

// Avatar Group for displaying multiple avatars
const AvatarGroup = ({ 
  children, 
  max = 3, 
  size = 'md',
  className,
  showMore = true,
  ...props 
}) => {
  const avatars = Array.isArray(children) ? children : [children]
  const visibleAvatars = avatars.slice(0, max)
  const hiddenCount = avatars.length - max

  const sizeClasses = {
    xs: '-ml-1',
    sm: '-ml-1.5',
    md: '-ml-2',
    lg: '-ml-2.5',
    xl: '-ml-3',
    '2xl': '-ml-4'
  }

  return (
    <div 
      className={cn('flex items-center', className)}
      {...props}
    >
      {visibleAvatars.map((avatar, index) => (
        <div
          key={index}
          className={cn(
            'ring-2 ring-white relative',
            index > 0 && sizeClasses[size]
          )}
          style={{ zIndex: visibleAvatars.length - index }}
        >
          {avatar}
        </div>
      ))}
      
      {hiddenCount > 0 && showMore && (
        <div
          className={cn(
            'ring-2 ring-white relative bg-gray-200 text-gray-600 font-medium',
            sizeClasses[size],
            'inline-flex items-center justify-center rounded-full',
            size === 'xs' ? 'h-6 w-6 text-xs' :
            size === 'sm' ? 'h-8 w-8 text-sm' :
            size === 'md' ? 'h-10 w-10 text-base' :
            size === 'lg' ? 'h-12 w-12 text-lg' :
            size === 'xl' ? 'h-16 w-16 text-xl' : 'h-20 w-20 text-2xl'
          )}
          style={{ zIndex: 0 }}
        >
          +{hiddenCount}
        </div>
      )}
    </div>
  )
}

export { Avatar, AvatarGroup }

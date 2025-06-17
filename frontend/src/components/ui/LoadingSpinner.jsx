import React from 'react'
import { cn } from '@/lib/utils'

const LoadingSpinner = ({ 
  size = 'md', 
  className,
  variant = 'default',
  ...props 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }

  const variantClasses = {
    default: 'text-primary',
    white: 'text-white',
    muted: 'text-muted-foreground'
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-current border-t-transparent",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      role="status"
      aria-label="Loading"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export { LoadingSpinner }

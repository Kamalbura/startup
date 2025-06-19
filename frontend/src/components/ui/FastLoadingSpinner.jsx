// Fast Loading Spinner - Optimized for Performance
// Purpose: Lightweight loading animations using pure CSS, no external dependencies

import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../lib/utils';

/**
 * Fast Loading Spinner - No external dependencies, pure CSS animations
 * Much faster than anime.js version for initial loading
 */
const FastLoadingSpinner = ({ 
  variant = 'dots',
  size = 'md',
  color = 'primary',
  className,
  ...props 
}) => {
  // Size configurations
  const sizeConfig = {
    xs: { container: 'w-4 h-4', dot: 'w-1 h-1' },
    sm: { container: 'w-6 h-6', dot: 'w-1.5 h-1.5' },
    md: { container: 'w-8 h-8', dot: 'w-2 h-2' },
    lg: { container: 'w-12 h-12', dot: 'w-3 h-3' },
    xl: { container: 'w-16 h-16', dot: 'w-4 h-4' }
  };

  // Color configurations
  const colorConfig = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600',
    white: 'bg-white',
    purple: 'bg-purple-600'
  };

  const currentSize = sizeConfig[size];
  const currentColor = colorConfig[color];

  // CSS animations (much faster than JS animations for loading)
  const cssAnimations = `
    @keyframes fastDots {
      0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
      40% { transform: scale(1.2); opacity: 1; }
    }
    
    @keyframes fastPulse {
      0%, 100% { transform: scale(1); opacity: 0.7; }
      50% { transform: scale(1.5); opacity: 0.3; }
    }
    
    @keyframes fastSpin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  // Render different spinner variants
  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className={cn('flex items-center justify-center gap-1', currentSize.container)}>
            {[...Array(3)].map((_, i) => (
              <div
                key={`fast-dot-${i}`}
                className={cn('rounded-full', currentSize.dot, currentColor)}
                style={{
                  animation: 'fastDots 1.4s infinite ease-in-out',
                  animationDelay: `${i * 0.16}s`
                }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <div className={cn('flex items-center justify-center', currentSize.container)}>
            <div
              className={cn('rounded-full', currentSize.container, currentColor)}
              style={{
                animation: 'fastPulse 1.5s infinite ease-in-out'
              }}
            />
          </div>
        );

      case 'spin':
        return (
          <div className={cn('flex items-center justify-center', currentSize.container)}>
            <div
              className={cn('rounded-full border-2 border-t-transparent', currentSize.container)}
              style={{
                borderColor: currentColor.replace('bg-', 'border-'),
                borderTopColor: 'transparent',
                animation: 'fastSpin 1s linear infinite'
              }}
            />
          </div>
        );

      default:
        return (
          <div className={cn('flex items-center justify-center gap-1', currentSize.container)}>
            {[...Array(3)].map((_, i) => (
              <div
                key={`fast-default-${i}`}
                className={cn('rounded-full', currentSize.dot, currentColor)}
                style={{
                  animation: 'fastDots 1.4s infinite ease-in-out',
                  animationDelay: `${i * 0.16}s`
                }}
              />
            ))}
          </div>
        );
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssAnimations }} />
      <div
        className={cn('inline-block', className)}
        role="status"
        aria-label="Loading"
        {...props}
      >
        {renderSpinner()}
      </div>
    </>
  );
};

FastLoadingSpinner.propTypes = {
  variant: PropTypes.oneOf(['dots', 'pulse', 'spin']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error', 'white', 'purple']),
  className: PropTypes.string
};

/**
 * Fast Loading Overlay - Optimized for initial app loading
 */
const FastLoadingOverlay = ({
  isVisible = true,
  variant = 'dots',
  message = 'Loading...',
  backdrop = 'blur'
}) => {
  if (!isVisible) return null;

  const backdropClasses = {
    blur: 'backdrop-blur-sm bg-white/80 dark:bg-gray-900/80',
    dark: 'bg-black/50',
    light: 'bg-white/90',
    none: 'bg-transparent'
  };

  return (
    <div className={cn(
      'fixed inset-0 z-50 flex items-center justify-center',
      backdropClasses[backdrop]
    )}>
      <div className="flex flex-col items-center justify-center space-y-4 p-8">
        <FastLoadingSpinner 
          variant={variant}
          size="lg"
          color="primary"
        />
        {message && (
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

FastLoadingOverlay.propTypes = {
  isVisible: PropTypes.bool,
  variant: PropTypes.oneOf(['dots', 'pulse', 'spin']),
  message: PropTypes.string,
  backdrop: PropTypes.oneOf(['blur', 'dark', 'light', 'none'])
};

export { FastLoadingSpinner, FastLoadingOverlay };
export default FastLoadingSpinner;

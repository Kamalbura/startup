import React, { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';
import { cn } from '../../lib/utils';

/**
 * Advanced Loading Spinner System using Anime.js
 * 
 * Features:
 * - Multiple spinner variants (dots, pulse, wave, orbit, magnetic)
 * - Customizable colors, sizes, and speeds
 * - Smooth enter/exit animations
 * - Accessibility compliant
 * - Lightweight and performant
 * - Auto-cleanup on unmount
 */

// Base LoadingSpinner component with anime.js integration
const LoadingSpinner = ({ 
  variant = 'dots',
  size = 'md',
  color = 'primary',
  speed = 'normal',
  className,
  ...props 
}) => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);

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

  // Speed configurations
  const speedConfig = {
    slow: { duration: 2000, delay: 200 },
    normal: { duration: 1500, delay: 150 },
    fast: { duration: 1000, delay: 100 }
  };

  const currentSize = sizeConfig[size];
  const currentColor = colorConfig[color];
  const currentSpeed = speedConfig[speed];
  useEffect(() => {
    if (!containerRef.current) return;    // Clear any existing animation
    if (animationRef.current) {
      animationRef.current.pause();
    }

    // Create animation based on variant
    switch (variant) {
      case 'dots':
        animationRef.current = anime({
          targets: containerRef.current.querySelectorAll('.loading-dot'),
          scale: [0.8, 1.2, 0.8],
          opacity: [0.5, 1, 0.5],
          duration: currentSpeed.duration,
          delay: anime.stagger(currentSpeed.delay),
          loop: true,
          easing: 'easeInOutSine'
        });
        break;

      case 'pulse':
        animationRef.current = anime({
          targets: containerRef.current.querySelector('.loading-pulse'),
              scale: [1, 1.5, 1],
              opacity: [0.7, 0.3, 0.7],
              duration: currentSpeed.duration,
              loop: true,
              easing: 'easeInOutQuad',
              autoplay: true
            });
            break;

      case 'wave':
        animationRef.current = anime({
          targets: containerRef.current.querySelectorAll('.loading-wave'),
          translateY: [0, -10, 0],
          duration: currentSpeed.duration,
          delay: anime.stagger(currentSpeed.delay),
          loop: true,
          easing: 'easeInOutSine'
        });
        break;

      case 'orbit':
        animationRef.current = anime({
          targets: containerRef.current.querySelector('.loading-orbit'),
          rotate: '1turn',
          duration: currentSpeed.duration,
          loop: true,
          easing: 'linear'
        });
        break;

      case 'magnetic':
        animationRef.current = anime({
          targets: containerRef.current.querySelectorAll('.loading-magnetic'),
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360],
          duration: currentSpeed.duration,
          delay: anime.stagger(currentSpeed.delay, {from: 'center'}),
          loop: true,
          easing: 'easeInOutBack'
        });
        break;

      case 'default':
      case 'spin':
        // Classic spinning circle for backwards compatibility
        animationRef.current = anime({
          targets: containerRef.current.querySelector('.loading-spin'),
          rotate: '1turn',
          duration: currentSpeed.duration,
          loop: true,
          easing: 'linear'
        });
        break;      default:
        // Fallback to dots
        animationRef.current = anime({
          targets: containerRef.current.querySelectorAll('.loading-dot'),
          scale: [0.8, 1.2, 0.8],
          duration: currentSpeed.duration,          delay: anime.stagger(currentSpeed.delay),
          loop: true,
          easing: 'easeInOutSine'
        });
        break;

      default:
        // Fallback to dots
        animationRef.current = anime({
          targets: containerRef.current.querySelectorAll('.loading-dot'),
          scale: [0.8, 1.2, 0.8],
          duration: currentSpeed.duration,
          delay: anime.stagger(currentSpeed.delay),
          loop: true,
          easing: 'easeInOutSine'
        });
    }

    // Cleanup function
    return () => {
      if (animationRef.current) {
        animationRef.current.pause();
        animationRef.current = null;
      }
    };
  }, [variant, size, color, speed, currentSpeed, currentColor]);

  // Render different spinner variants
  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className={cn('flex items-center justify-center gap-1', currentSize.container)}>
            {[...Array(3)].map((_, i) => (
              <div
                key={`dot-${i}`}
                className={cn('loading-dot rounded-full', currentSize.dot, currentColor)}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <div className={cn('flex items-center justify-center', currentSize.container)}>
            <div
              className={cn('loading-pulse rounded-full', currentSize.container, currentColor)}
            />
          </div>
        );

      case 'wave':
        return (
          <div className={cn('flex items-end justify-center gap-1', currentSize.container)}>
            {[...Array(4)].map((_, i) => (
              <div
                key={`wave-${i}`}
                className={cn('loading-wave rounded-full', currentSize.dot, currentColor)}
                style={{ height: `${20 + (i % 2) * 10}%` }}
              />
            ))}
          </div>
        );

      case 'orbit':
        return (
          <div className={cn('relative flex items-center justify-center', currentSize.container)}>
            <div className={cn('loading-orbit absolute border-2 border-transparent rounded-full', currentSize.container)}>
              <div 
                className={cn('absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full', currentSize.dot, currentColor)}
              />
            </div>
          </div>
        );

      case 'magnetic':
        return (
          <div className={cn('grid grid-cols-2 gap-1', currentSize.container)}>
            {[...Array(4)].map((_, i) => (
              <div
                key={`magnetic-${i}`}
                className={cn('loading-magnetic rounded-full', currentSize.dot, currentColor)}
              />
            ))}
          </div>
        );

      case 'default':
      case 'spin':
        // Classic spinning circle for backwards compatibility
        return (
          <div className={cn('flex items-center justify-center', currentSize.container)}>
            <div
              className={cn(
                'loading-spin rounded-full border-2 border-current border-t-transparent',
                currentSize.container,
                color === 'white' ? 'text-white' : 'text-blue-600'
              )}
            />
          </div>
        );      default:
        return (
          <div className={cn('flex items-center justify-center gap-1', currentSize.container)}>
            {[...Array(3)].map((_, i) => (
              <div
                key={`default-${variant}-${i}`}
                className={cn('loading-dot rounded-full', currentSize.dot, currentColor)}
              />
            ))}
          </div>
        );
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn('inline-block', className)}
      role="status"
      aria-label="Loading"
      {...props}
    >
      {renderSpinner()}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// Full-screen loading overlay
const LoadingOverlay = ({ 
  isVisible = true,
  variant = 'dots',
  message = 'Loading...',
  backdrop = 'blur',
  ...props 
}) => {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!overlayRef.current) return;

    if (isVisible) {
      // Animate in
      anime({
        targets: overlayRef.current,
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuad'
      });
    } else {
      // Animate out
      anime({
        targets: overlayRef.current,
        opacity: [1, 0],
        duration: 300,
        easing: 'easeInQuad'
      });
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const backdropClass = {
    blur: 'backdrop-blur-sm bg-white/70',
    dark: 'bg-black/50',
    light: 'bg-white/80',
    none: 'bg-transparent'
  };

  return (
    <div
      ref={overlayRef}
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center',
        backdropClass[backdrop]
      )}
      style={{ opacity: 0 }}
    >
      <LoadingSpinner variant={variant} size="xl" {...props} />
      {message && (
        <p className="mt-4 text-sm font-medium text-gray-600 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

// Loading skeleton for content areas
const LoadingSkeleton = ({ 
  variant = 'text',
  lines = 3,
  className,
  ...props 
}) => {
  const skeletonRef = useRef(null);

  useEffect(() => {
    if (!skeletonRef.current) return;

    const animation = anime({
      targets: skeletonRef.current.querySelectorAll('.skeleton-item'),
      opacity: [0.3, 0.8, 0.3],
      duration: 1500,
      delay: anime.stagger(100),
      loop: true,
      easing: 'easeInOutSine'
    });

    return () => animation.pause();
  }, []);

  const renderSkeleton = () => {
    switch (variant) {
      case 'text':
        return (
          <div className="space-y-2">
                  {[...Array(lines)].map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="skeleton-item h-4 bg-gray-200 rounded animate-pulse"
                style={{ width: `${Math.random() * 40 + 60}%` }}
              />
            ))}
          </div>
        );

      case 'card':
        return (
          <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="skeleton-item h-4 bg-gray-200 rounded w-3/4" />
            <div className="skeleton-item h-3 bg-gray-200 rounded w-1/2" />
            <div className="skeleton-item h-20 bg-gray-200 rounded" />
          </div>
        );

      case 'avatar':
        return (
          <div className="skeleton-item w-12 h-12 bg-gray-200 rounded-full" />
        );

      default:
        return (
          <div className="skeleton-item h-4 bg-gray-200 rounded" />
        );
    }
  };

  return (
    <div
      ref={skeletonRef}
      className={cn('w-full', className)}
      {...props}
    >
      {renderSkeleton()}
    </div>
  );
};

// Button with integrated loading state
const LoadingButton = ({ 
  children,
  isLoading = false,
  loadingText = 'Loading...',
  variant = 'dots',
  disabled,
  className,
  ...props 
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        'relative inline-flex items-center justify-center',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'transition-all duration-200',
        className
      )}
      {...props}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner variant={variant} size="sm" color="white" />
          {loadingText && (
            <span className="ml-2 text-sm">{loadingText}</span>
          )}
        </div>
      )}
      <span className={cn(isLoading && 'opacity-0')}>
        {children}
      </span>
    </button>
  );
};

// Export all components
export default LoadingSpinner;
export { 
  LoadingSpinner,
  LoadingOverlay,
  LoadingSkeleton,
  LoadingButton,
  SkillsLoadingAnimation,
  HelpRequestLoadingAnimation,
  CollaborationLoadingAnimation,
  AnonymousLoadingAnimation,
  CampusLoadingAnimation,
  DataFlowLoadingAnimation,
  NeuralNetworkLoadingAnimation,
  QuantumLoadingAnimation,
  EcosystemLoadingAnimation,
  CampusNetworkLoadingAnimation,
  SkillBuildingLoadingAnimation,
  CollaborationSyncLoadingAnimation,
  AnonymousModeLoadingAnimation
};

// SkillLance-Themed Loading Animations
// Context-specific animations for our platform

/**
 * Skills Loading Animation - Representing skill building and growth
 * Shows icons morphing and growing to represent skill development
 */
const SkillsLoadingAnimation = ({ size = 'md', className }) => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;

    const tl = anime.timeline({
      loop: true,
      autoplay: true
    });

    // Skills building animation
    tl.add({
      targets: containerRef.current.querySelectorAll('.skill-bar'),
      width: ['0%', '100%'],
      duration: 800,
      delay: anime.stagger(200),
      easing: 'easeInOutQuad'
    })
    .add({
      targets: containerRef.current.querySelectorAll('.skill-icon'),
      scale: [0.8, 1.2, 1],
      rotate: [0, 360],
      duration: 600,
      delay: anime.stagger(100),
      easing: 'easeInOutBack'
    }, 400)
    .add({
      targets: containerRef.current.querySelectorAll('.skill-bar'),
      width: ['100%', '0%'],
      duration: 400,
      delay: anime.stagger(100),
      easing: 'easeInQuad'
    }, 1200);

    return () => tl.pause();
  }, []);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24', 
    lg: 'w-32 h-32'
  };

  return (
    <div ref={containerRef} className={cn('flex flex-col items-center space-y-2', sizeClasses[size], className)}>
      <div className="flex space-x-1">
        {['💻', '📚', '🎯'].map((icon, i) => (
          <div key={i} className="skill-icon text-lg">{icon}</div>
        ))}
      </div>
      <div className="w-full space-y-1">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-full bg-gray-200 rounded-full h-1">
            <div className="skill-bar h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Help Request Loading Animation - Showing anonymous help requests flowing
 * Represents the flow of help requests in our platform
 */
const HelpRequestLoadingAnimation = ({ size = 'md', className }) => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;

    const tl = anime.timeline({
      loop: true,
      autoplay: true
    });

    // Help requests floating animation
    tl.add({
      targets: containerRef.current.querySelectorAll('.help-bubble'),
      translateY: [20, -20],
      opacity: [0, 1, 0],
      scale: [0.8, 1, 0.8],
      duration: 2000,
      delay: anime.stagger(400),
      easing: 'easeInOutSine'
    })
    .add({
      targets: containerRef.current.querySelector('.help-center'),
      scale: [1, 1.1, 1],
      rotate: [0, 10, -10, 0],
      duration: 1000,
      easing: 'easeInOutBack'
    }, 0);

    return () => tl.pause();
  }, []);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  return (
    <div ref={containerRef} className={cn('relative flex items-center justify-center', sizeClasses[size], className)}>
      {/* Central help icon */}
      <div className="help-center text-2xl">🤝</div>
      
      {/* Floating help request bubbles */}
      {['❓', '💡', '✨', '🎓'].map((icon, i) => {
        const positions = [
          'top-0 left-1/4', 'top-1/4 right-0', 
          'bottom-0 right-1/4', 'bottom-1/4 left-0'
        ];
        return (
          <div 
            key={i} 
            className={cn('help-bubble absolute text-sm', positions[i])}
          >
            {icon}
          </div>
        );
      })}
    </div>
  );
};

/**
 * Collaboration Loading Animation - Showing real-time collaboration
 * Represents students working together in real-time
 */
const CollaborationLoadingAnimation = ({ size = 'md', className }) => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;

    const tl = anime.timeline({
      loop: true,
      autoplay: true
    });

    // Collaboration orbiting animation
    tl.add({
      targets: containerRef.current.querySelectorAll('.collab-person'),
      rotate: '1turn',
      duration: 3000,
      easing: 'linear'
    })
    .add({
      targets: containerRef.current.querySelectorAll('.collab-connection'),
      opacity: [0, 1, 0],
      scale: [0.5, 1, 0.5],
      duration: 1000,
      delay: anime.stagger(200),
      easing: 'easeInOutSine'
    }, 0);

    return () => tl.pause();
  }, []);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  return (
    <div ref={containerRef} className={cn('relative flex items-center justify-center', sizeClasses[size], className)}>
      {/* Central collaboration icon */}
      <div className="text-xl">💻</div>
      
      {/* Orbiting people icons */}
      {['👩‍🎓', '👨‍🎓', '👩‍💻'].map((person, i) => {
        const radius = size === 'lg' ? 40 : size === 'md' ? 30 : 20;
        const angle = (i * 120) * Math.PI / 180;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        return (
          <div 
            key={i}
            className="collab-person absolute text-sm"
            style={{
              transform: `translate(${x}px, ${y}px)`,
              transformOrigin: `-${x}px -${y}px`
            }}
          >
            {person}
          </div>
        );
      })}
      
      {/* Connection lines */}
      <div className="collab-connection absolute w-1 h-1 bg-blue-400 rounded-full"></div>
    </div>
  );
};

/**
 * Anonymous Loading Animation - Showing privacy protection
 * Represents the anonymous nature of our platform
 */
const AnonymousLoadingAnimation = ({ size = 'md', className }) => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;

    const tl = anime.timeline({
      loop: true,
      autoplay: true
    });

    // Privacy shield animation
    tl.add({
      targets: containerRef.current.querySelectorAll('.privacy-layer'),
      opacity: [0.3, 1, 0.3],
      scale: [0.9, 1.1, 0.9],
      duration: 1500,
      delay: anime.stagger(300),
      easing: 'easeInOutSine'
    })
    .add({
      targets: containerRef.current.querySelector('.anonymous-icon'),
      rotate: [0, 360],
      duration: 2000,
      easing: 'easeInOutQuad'
    }, 0);

    return () => tl.pause();
  }, []);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  return (
    <div ref={containerRef} className={cn('relative flex items-center justify-center', sizeClasses[size], className)}>
      {/* Privacy layers */}
      {[...Array(3)].map((_, i) => (
        <div 
          key={i}
          className="privacy-layer absolute border-2 border-purple-400 rounded-full"
          style={{
            width: `${60 + i * 20}%`,
            height: `${60 + i * 20}%`,
            opacity: 0.3 - i * 0.1
          }}
        />
      ))}
      
      {/* Central anonymous icon */}
      <div className="anonymous-icon text-2xl">🔒</div>
    </div>
  );
};

/**
 * Campus Loading Animation - Showing campus-wide connection
 * Represents the campus community aspect
 */
const CampusLoadingAnimation = ({ size = 'md', className }) => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;

    const tl = anime.timeline({
      loop: true,
      autoplay: true
    });

    // Campus network animation
    tl.add({
      targets: containerRef.current.querySelectorAll('.campus-node'),
      scale: [0.8, 1.2, 0.8],
      opacity: [0.6, 1, 0.6],
      duration: 1000,
      delay: anime.stagger(200, {from: 'center'}),
      easing: 'easeInOutSine'
    })
    .add({
      targets: containerRef.current.querySelectorAll('.campus-connection'),
      strokeDashoffset: [100, 0],
      duration: 1500,
      easing: 'easeInOutQuad'
    }, 200);

    return () => tl.pause();
  }, []);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  return (
    <div ref={containerRef} className={cn('relative flex items-center justify-center', sizeClasses[size], className)}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        {/* Connection lines */}
        <line className="campus-connection" x1="50" y1="20" x2="50" y2="80" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" />
        <line className="campus-connection" x1="20" y1="50" x2="80" y2="50" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" />
        <line className="campus-connection" x1="30" y1="30" x2="70" y2="70" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" />
        <line className="campus-connection" x1="70" y1="30" x2="30" y2="70" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" />
      </svg>
      
      {/* Campus nodes */}
      <div className="campus-node absolute top-2 left-1/2 transform -translate-x-1/2 text-sm">🏛️</div>
      <div className="campus-node absolute bottom-2 left-1/2 transform -translate-x-1/2 text-sm">📚</div>
      <div className="campus-node absolute left-2 top-1/2 transform -translate-y-1/2 text-sm">👥</div>
      <div className="campus-node absolute right-2 top-1/2 transform -translate-y-1/2 text-sm">🎓</div>
      <div className="campus-node absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg">🌟</div>
    </div>
  );
};

// ==========================================
// NEW ADVANCED ANIMATIONS (ANIME.JS V4 INSPIRED)
// ==========================================

/**
 * Morphing Data Flow Animation - Shows data transformation and processing
 * Advanced timeline with morphing shapes and stagger effects
 */
const DataFlowLoadingAnimation = ({ size = 'md', className }) => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;

    const tl = anime.timeline({
      loop: true,
      autoplay: true
    });

    // Complex data flow animation with morphing
    tl.add({
      targets: containerRef.current.querySelectorAll('.data-node'),
      scale: [0, 1],
      opacity: [0, 1],
      duration: 600,
      delay: anime.stagger(150, {from: 'first'}),
      easing: 'spring(1, 80, 10, 0)'
    })
    .add({
      targets: containerRef.current.querySelectorAll('.data-connection'),
      strokeDashoffset: [anime.setDashOffset, 0],
      duration: 800,
      delay: anime.stagger(100),
      easing: 'easeOutExpo'
    }, 300)
    .add({
      targets: containerRef.current.querySelectorAll('.data-processor'),
      rotate: [0, 180],
      scale: [1, 1.2, 1],
      duration: 1000,
      easing: 'easeInOutBack'
    }, 600)
    .add({
      targets: containerRef.current.querySelectorAll('.data-flow-particle'),
      translateX: anime.stagger([-30, 30]),
      translateY: anime.stagger([-15, 15]),
      scale: anime.stagger([0.5, 1.5]),
      opacity: [1, 0],
      duration: 1200,
      easing: 'easeOutQuart'
    }, 800);

    return () => tl.pause();
  }, []);

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28',
    lg: 'w-36 h-36'
  };

  return (
    <div ref={containerRef} className={cn('relative flex items-center justify-center', sizeClasses[size], className)}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 120">
        {/* Data connections */}
        <path className="data-connection" d="M20,60 Q60,20 100,60" stroke="#3b82f6" strokeWidth="2" fill="none" strokeDasharray="5,5"/>
        <path className="data-connection" d="M20,60 Q60,100 100,60" stroke="#8b5cf6" strokeWidth="2" fill="none" strokeDasharray="5,5"/>
        <line className="data-connection" x1="20" y1="60" x2="100" y2="60" stroke="#10b981" strokeWidth="2" strokeDasharray="4,4"/>
      </svg>
      
      {/* Data nodes */}
      <div className="data-node absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full"></div>
      <div className="data-node absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full"></div>
      <div className="data-node absolute top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-purple-500 rounded-full"></div>
      <div className="data-node absolute bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-yellow-500 rounded-full"></div>
      
      {/* Central processor */}
      <div className="data-processor w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs">
        ⚡
      </div>
      
      {/* Flow particles */}
      {[...Array(8)].map((_, i) => (
        <div 
          key={i}
          className="data-flow-particle absolute w-1 h-1 bg-blue-400 rounded-full"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
    </div>
  );
};

/**
 * Neural Network Animation - Inspired by AI/ML processing
 * Shows interconnected nodes with pulsing signals
 */
const NeuralNetworkLoadingAnimation = ({ size = 'md', className }) => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;

    const tl = anime.timeline({
      loop: true,
      autoplay: true
    });

    // Neural network pulse animation
    tl.add({
      targets: containerRef.current.querySelectorAll('.neuron'),
      scale: anime.stagger([0.8, 1.2], {from: 'center'}),
      opacity: anime.stagger([0.4, 1], {from: 'center'}),
      duration: 1000,
      easing: 'easeInOutSine'
    })
    .add({
      targets: containerRef.current.querySelectorAll('.synapse'),
      strokeWidth: anime.stagger([1, 3]),
      opacity: anime.stagger([0.3, 0.9]),
      duration: 800,
      easing: 'easeInOutQuad'
    }, 200)
    .add({
      targets: containerRef.current.querySelectorAll('.signal'),
      opacity: [0, 1, 0],
      scale: [0.5, 1, 0.5],
      duration: 600,
      delay: anime.stagger(100, {from: 'random'}),
      easing: 'easeInOutExpo'
    }, 400);

    return () => tl.pause();
  }, []);

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28',
    lg: 'w-36 h-36'
  };

  const neurons = [
    { x: 50, y: 20, color: 'bg-blue-500' },
    { x: 20, y: 50, color: 'bg-green-500' },
    { x: 80, y: 50, color: 'bg-purple-500' },
    { x: 35, y: 80, color: 'bg-yellow-500' },
    { x: 65, y: 80, color: 'bg-red-500' },
    { x: 50, y: 50, color: 'bg-indigo-600' }
  ];

  return (
    <div ref={containerRef} className={cn('relative flex items-center justify-center', sizeClasses[size], className)}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        {/* Synapses (connections) */}
        {neurons.map((from, i) => 
          neurons.slice(i + 1).map((to, j) => (
            <line 
              key={`${i}-${j}`}
              className="synapse"
              x1={from.x} y1={from.y}
              x2={to.x} y2={to.y}
              stroke="#6366f1"
              strokeWidth="1"
              opacity="0.3"
            />
          ))
        )}
      </svg>
      
      {/* Neurons */}
      {neurons.map((neuron, i) => (
        <div 
          key={i}
          className={cn('neuron absolute w-3 h-3 rounded-full', neuron.color)}
          style={{
            left: `${neuron.x}%`,
            top: `${neuron.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
      
      {/* Signal particles */}
      {[...Array(6)].map((_, i) => (
        <div 
          key={i}
          className="signal absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${30 + i * 8}%`,
            top: `${40 + Math.sin(i) * 20}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
    </div>
  );
};

/**
 * Quantum Computing Animation - Represents quantum states and superposition
 * Uses advanced stagger and morphing techniques
 */
const QuantumLoadingAnimation = ({ size = 'md', className }) => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;

    const tl = anime.timeline({
      loop: true,
      autoplay: true
    });

    // Quantum superposition animation
    tl.add({
      targets: containerRef.current.querySelectorAll('.qubit'),
      rotate: anime.stagger([0, 360], {from: 'center', direction: 'reverse'}),
      scale: anime.stagger([0.5, 1.5, 0.5]),
      opacity: anime.stagger([0.3, 1, 0.3]),
      duration: 2000,
      easing: 'easeInOutCubic'
    })
    .add({
      targets: containerRef.current.querySelectorAll('.quantum-field'),
      borderRadius: ['50%', '20%', '50%'],
      rotate: [0, 180, 360],
      scale: [1, 1.3, 1],
      duration: 1500,
      easing: 'easeInOutBack'
    }, 500)
    .add({
      targets: containerRef.current.querySelectorAll('.entanglement'),
      strokeDasharray: ['0 100', '50 50', '100 0'],
      rotate: [0, 720],
      duration: 1800,
      easing: 'easeOutElastic(1, .6)'
    }, 800);

    return () => tl.pause();
  }, []);

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28',
    lg: 'w-36 h-36'
  };

  return (
    <div ref={containerRef} className={cn('relative flex items-center justify-center', sizeClasses[size], className)}>
      {/* Quantum field layers */}
      <div className="quantum-field absolute inset-4 border-2 border-blue-400 rounded-full opacity-30"></div>
      <div className="quantum-field absolute inset-6 border-2 border-purple-400 rounded-full opacity-40"></div>
      <div className="quantum-field absolute inset-8 border-2 border-green-400 rounded-full opacity-50"></div>
      
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        {/* Entanglement lines */}
        <circle className="entanglement" cx="50" cy="50" r="30" stroke="#8b5cf6" strokeWidth="2" fill="none"/>
        <circle className="entanglement" cx="50" cy="50" r="20" stroke="#3b82f6" strokeWidth="1.5" fill="none"/>
        <circle className="entanglement" cx="50" cy="50" r="10" stroke="#10b981" strokeWidth="1" fill="none"/>
      </svg>
      
      {/* Qubits */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const x = 50 + 25 * Math.cos(angle * Math.PI / 180);
        const y = 50 + 25 * Math.sin(angle * Math.PI / 180);
        return (
          <div 
            key={i}
            className="qubit absolute w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        );
      })}
      
      {/* Central quantum core */}
      <div className="w-4 h-4 bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 rounded-full flex items-center justify-center text-white text-xs animate-pulse">
        ⚛️
      </div>
    </div>
  );
};

/**
 * Ecosystem Growth Animation - Represents organic, interconnected growth
 * Advanced organic movement with realistic easing
 */
const EcosystemLoadingAnimation = ({ size = 'md', className }) => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;

    const tl = anime.timeline({
      loop: true,
      autoplay: true
    });

    // Organic growth animation
    tl.add({
      targets: containerRef.current.querySelectorAll('.seed'),
      scale: [0, 1],
      rotate: [0, 45],
      duration: 800,
      easing: 'easeOutBack(1.7)'
    })
    .add({
      targets: containerRef.current.querySelectorAll('.branch'),
      scaleY: [0, 1],
      duration: 1000,
      delay: anime.stagger(200, {from: 'center'}),
      easing: 'easeOutElastic(1, .8)'
    }, 400)
    .add({
      targets: containerRef.current.querySelectorAll('.leaf'),
      scale: [0, 1],
      rotate: anime.stagger([-15, 15]),
      opacity: [0, 1],
      duration: 600,
      delay: anime.stagger(100, {from: 'random'}),
      easing: 'easeOutBack(1.7)'
    }, 800)
    .add({
      targets: containerRef.current.querySelectorAll('.connection'),
      opacity: [0, 0.6, 0],
      scale: [0.8, 1.2, 0.8],
      duration: 1500,
      easing: 'easeInOutSine'
    }, 1000);

    return () => tl.pause();
  }, []);

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28',
    lg: 'w-36 h-36'
  };

  return (
    <div ref={containerRef} className={cn('relative flex items-center justify-center', sizeClasses[size], className)}>
      {/* Root/Seed */}
      <div className="seed absolute bottom-4 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-amber-600 rounded-full"></div>
      
      {/* Branches */}
      <div className="branch absolute bottom-4 left-1/2 w-0.5 h-6 bg-green-700 transform -translate-x-1/2 origin-bottom"></div>
      <div className="branch absolute bottom-6 left-1/2 w-0.5 h-4 bg-green-700 transform -translate-x-1/2 rotate-45 origin-bottom"></div>
      <div className="branch absolute bottom-6 left-1/2 w-0.5 h-4 bg-green-700 transform -translate-x-1/2 -rotate-45 origin-bottom"></div>
      
      {/* Leaves */}
      {[
        { x: 45, y: 25, rotation: -15 },
        { x: 55, y: 25, rotation: 15 },
        { x: 40, y: 35, rotation: -30 },
        { x: 60, y: 35, rotation: 30 },
        { x: 50, y: 15, rotation: 0 }
      ].map((leaf, i) => (
        <div 
          key={i}
          className="leaf absolute w-2 h-3 bg-green-500 rounded-full"
          style={{
            left: `${leaf.x}%`,
            top: `${leaf.y}%`,
            transform: `translate(-50%, -50%) rotate(${leaf.rotation}deg)`,
            borderRadius: '50% 10% 50% 10%'
          }}
        />
      ))}      
      {/* Ecosystem connections */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <path className="connection" d="M30,70 Q50,50 70,70" stroke="#10b981" strokeWidth="1" fill="none" opacity="0"/>
        <path className="connection" d="M25,60 Q50,40 75,60" stroke="#22c55e" strokeWidth="1" fill="none" opacity="0"/>
      </svg>
    </div>
  );
};

/**
 * SkillLance Campus Network Animation
 * Represents the network of students and resources on the SkillLance platform
 */
const CampusNetworkLoadingAnimation = ({ size = 'md', className }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create campus nodes (students)
    const nodes = containerRef.current.querySelectorAll('.campus-node');
    const connections = containerRef.current.querySelectorAll('.campus-connection');

    const tl = anime.timeline({ loop: true });

    // Initial setup
    anime.set(nodes, { scale: 0, opacity: 0 });
    anime.set(connections, { strokeDasharray: '5 5', strokeDashoffset: 10, opacity: 0 });

    // Animate nodes appearing (students joining campus)
    tl.add({
      targets: nodes,
      scale: [0, 1.2, 1],
      opacity: [0, 1],
      duration: 800,
      delay: anime.stagger(200, {from: 'center'}),
      easing: 'easeOutElastic(1, .8)'
    })
    // Network connections forming
    .add({
      targets: connections,
      opacity: [0, 0.7],
      strokeDashoffset: [10, 0],
      duration: 1000,
      delay: anime.stagger(150),
      easing: 'easeInOutQuad'
    }, 400)
    // Pulse effect showing active collaboration
    .add({
      targets: nodes,
      scale: [1, 1.1, 1],
      duration: 600,
      delay: anime.stagger(100, {from: 'random'}),
      easing: 'easeInOutSine'
    }, 1200)
    // Data flow through connections
    .add({
      targets: '.data-packet',
      translateX: [0, 50, 0],
      translateY: [0, -25, 0],
      opacity: [0, 1, 0],
      scale: [0.5, 1, 0.5],
      duration: 1500,
      delay: anime.stagger(300),
      easing: 'easeInOutQuart'
    }, 1500);

    return () => tl.pause();
  }, []);

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-40 h-40'
  };

  const nodePositions = [
    { x: 50, y: 20, color: 'bg-blue-500', label: 'CS' },
    { x: 20, y: 40, color: 'bg-green-500', label: 'Math' },
    { x: 80, y: 40, color: 'bg-purple-500', label: 'Eng' },
    { x: 35, y: 70, color: 'bg-red-500', label: 'Phy' },
    { x: 65, y: 70, color: 'bg-yellow-500', label: 'Lit' },
    { x: 50, y: 85, color: 'bg-pink-500', label: 'Art' }
  ];

  return (
    <div ref={containerRef} className={cn('relative flex items-center justify-center', sizeClasses[size], className)}>
      {/* Campus nodes (students from different departments) */}
      {nodePositions.map((node, i) => (
        <div
          key={i}
          className={cn('campus-node absolute flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-bold shadow-lg', node.color)}
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {node.label}
        </div>
      ))}
      
      {/* Network connections between students */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <path className="campus-connection" d="M50,20 L20,40" stroke="#3b82f6" strokeWidth="2" fill="none" opacity="0"/>
        <path className="campus-connection" d="M50,20 L80,40" stroke="#10b981" strokeWidth="2" fill="none" opacity="0"/>
        <path className="campus-connection" d="M20,40 L35,70" stroke="#8b5cf6" strokeWidth="2" fill="none" opacity="0"/>
        <path className="campus-connection" d="M80,40 L65,70" stroke="#ef4444" strokeWidth="2" fill="none" opacity="0"/>
        <path className="campus-connection" d="M35,70 L50,85" stroke="#eab308" strokeWidth="2" fill="none" opacity="0"/>
        <path className="campus-connection" d="M65,70 L50,85" stroke="#ec4899" strokeWidth="2" fill="none" opacity="0"/>
        <path className="campus-connection" d="M20,40 L80,40" stroke="#6b7280" strokeWidth="1" fill="none" opacity="0"/>
      </svg>
      
      {/* Data packets flowing through network */}
      <div className="data-packet absolute w-2 h-2 bg-blue-400 rounded-full" style={{left: '35%', top: '30%'}}></div>
      <div className="data-packet absolute w-2 h-2 bg-green-400 rounded-full" style={{left: '65%', top: '30%'}}></div>
      <div className="data-packet absolute w-2 h-2 bg-purple-400 rounded-full" style={{left: '50%', top: '55%'}}></div>
    </div>
  );
};

/**
 * Skill Building Animation - Represents the process of skill development
 * Shows blocks assembling and particles representing knowledge
 */
const SkillBuildingLoadingAnimation = ({ size = 'md', className }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const blocks = containerRef.current.querySelectorAll('.skill-block');
    const particles = containerRef.current.querySelectorAll('.skill-particle');

    const tl = anime.timeline({ loop: true });

    anime.set(blocks, { translateY: 50, opacity: 0, rotateX: 45 });
    anime.set(particles, { scale: 0, opacity: 0 });

    // Blocks building up
    tl.add({
      targets: blocks,
      translateY: [50, 0],
      opacity: [0, 1],
      rotateX: [45, 0],
      duration: 600,
      delay: anime.stagger(200, {from: 'last'}),
      easing: 'easeOutBack(1.7)'
    })
    // Skill particles floating up
    .add({
      targets: particles,
      scale: [0, 1, 0],
      opacity: [0, 1, 0],
      translateY: [0, -30],
      duration: 1500,
      delay: anime.stagger(100),
      easing: 'easeOutQuart'
    }, 800)
    // Tower completion glow
    .add({
      targets: blocks,
      backgroundColor: ['#3b82f6', '#10b981', '#3b82f6'],
      duration: 800,
      easing: 'easeInOutSine'
    }, 1200);

    return () => tl.pause();
  }, []);

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28',
    lg: 'w-36 h-36'
  };

  return (
    <div ref={containerRef} className={cn('relative flex items-center justify-center', sizeClasses[size], className)}>
      {/* Skill blocks */}
      <div className="skill-block absolute w-8 h-4 bg-blue-500 rounded-sm" style={{left: '50%', bottom: '10%', transform: 'translateX(-50%)'}}></div>
      <div className="skill-block absolute w-6 h-4 bg-blue-600 rounded-sm" style={{left: '50%', bottom: '25%', transform: 'translateX(-50%)'}}></div>
      <div className="skill-block absolute w-4 h-4 bg-blue-700 rounded-sm" style={{left: '50%', bottom: '40%', transform: 'translateX(-50%)'}}></div>
      
      {/* Skill particles */}
      <div className="skill-particle absolute w-2 h-2 bg-yellow-400 rounded-full" style={{left: '30%', top: '60%'}}></div>
      <div className="skill-particle absolute w-2 h-2 bg-green-400 rounded-full" style={{left: '70%', top: '50%'}}></div>
      <div className="skill-particle absolute w-2 h-2 bg-purple-400 rounded-full" style={{left: '45%', top: '70%'}}></div>
      <div className="skill-particle absolute w-2 h-2 bg-red-400 rounded-full" style={{left: '55%', top: '40%'}}></div>
    </div>
  );
};

/**
 * Collaboration Sync Animation - Represents real-time collaboration and data sync
 * Shows users connecting, sync rings, and data streams
 */
const CollaborationSyncLoadingAnimation = ({ size = 'md', className }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const users = containerRef.current.querySelectorAll('.collab-user');
    const syncRings = containerRef.current.querySelectorAll('.sync-ring');
    const dataStream = containerRef.current.querySelectorAll('.data-stream');

    const tl = anime.timeline({ loop: true });

    anime.set(users, { scale: 0.8, opacity: 0.5 });
    anime.set(syncRings, { scale: 0, opacity: 0 });
    anime.set(dataStream, { pathLength: 0 });

    // Users connecting
    tl.add({
      targets: users,
      scale: [0.8, 1.1, 1],
      opacity: [0.5, 1],
      duration: 800,
      delay: anime.stagger(200),
      easing: 'easeOutElastic(1, .8)'
    })
    // Sync rings expanding
    .add({
      targets: syncRings,
      scale: [0, 2, 0],
      opacity: [0, 0.6, 0],
      duration: 1200,
      delay: anime.stagger(300),
      easing: 'easeOutQuart'
    }, 400)
    // Data streams flowing
    .add({
      targets: dataStream,
      pathLength: [0, 1],
      duration: 1000,
      delay: anime.stagger(200),
      easing: 'easeInOutQuart'
    }, 800)
    // Synchronized pulse
    .add({
      targets: users,
      scale: [1, 1.2, 1],
      duration: 400,
      easing: 'easeInOutSine'
    }, 1500);

    return () => tl.pause();
  }, []);

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-40 h-40'
  };

  return (
    <div ref={containerRef} className={cn('relative flex items-center justify-center', sizeClasses[size], className)}>
      {/* Collaboration users */}
      <div className="collab-user absolute w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs" style={{left: '20%', top: '30%'}}>
        A
      </div>
      <div className="collab-user absolute w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs" style={{left: '80%', top: '30%'}}>
        B
      </div>
      <div className="collab-user absolute w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs" style={{left: '50%', top: '70%'}}>
        C
      </div>
      
      {/* Sync rings */}
      <div className="sync-ring absolute border-2 border-blue-400 rounded-full w-16 h-16" style={{left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}></div>
      <div className="sync-ring absolute border-2 border-green-400 rounded-full w-20 h-20" style={{left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}></div>
      
      {/* Data streams */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <path className="data-stream" d="M30,35 Q50,20 70,35" stroke="#3b82f6" strokeWidth="2" fill="none" strokeDasharray="5,5"/>
        <path className="data-stream" d="M25,40 Q50,85 75,40" stroke="#10b981" strokeWidth="2" fill="none" strokeDasharray="5,5"/>
        <path className="data-stream" d="M45,65 Q35,45 25,35" stroke="#8b5cf6" strokeWidth="2" fill="none" strokeDasharray="5,5"/>
      </svg>
    </div>
  );
};

/**
 * Anonymous Mode Animation - Represents the privacy protection in SkillLance
 * Shows masks, shields, and particles indicating anonymous interactions
 */
const AnonymousModeLoadingAnimation = ({ size = 'md', className }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const masks = containerRef.current.querySelectorAll('.privacy-mask');
    const shields = containerRef.current.querySelectorAll('.privacy-shield');
    const particles = containerRef.current.querySelectorAll('.privacy-particle');

    const tl = anime.timeline({ loop: true });

    anime.set(masks, { scale: 0, rotateY: 90, opacity: 0 });
    anime.set(shields, { scale: 0, rotateZ: 180, opacity: 0 });
    anime.set(particles, { scale: 0, opacity: 0 });

    // Masks appearing
    tl.add({
      targets: masks,
      scale: [0, 1.2, 1],
      rotateY: [90, 0],
      opacity: [0, 1],
      duration: 800,
      delay: anime.stagger(200),
      easing: 'easeOutBack(1.7)'
    })
    // Privacy shields
    .add({
      targets: shields,
      scale: [0, 1.1, 1],
      rotateZ: [180, 0],
      opacity: [0, 0.8],
      duration: 600,
      delay: anime.stagger(150),
      easing: 'easeOutElastic(1, .8)'
    }, 400)
    // Privacy particles
    .add({
      targets: particles,
      scale: [0, 1, 0],
      opacity: [0, 0.6, 0],
      translateY: [0, -20],
      rotateZ: [0, 360],
      duration: 1500,
      delay: anime.stagger(100),
      easing: 'easeOutQuart'
    }, 600)
    // Pulse effect
    .add({
      targets: [masks, shields],
      scale: [1, 1.1, 1],
      opacity: [1, 0.7, 1],
      duration: 600,
      easing: 'easeInOutSine'
    }, 1200);

    return () => tl.pause();
  }, []);

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28',
    lg: 'w-36 h-36'
  };

  return (
    <div ref={containerRef} className={cn('relative flex items-center justify-center', sizeClasses[size], className)}>
      {/* Privacy masks */}
      <div className="privacy-mask absolute w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white" style={{left: '30%', top: '30%'}}>
        👤
      </div>
      <div className="privacy-mask absolute w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white" style={{left: '70%', top: '30%'}}>
        👤
      </div>
      <div className="privacy-mask absolute w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white" style={{left: '50%', top: '70%'}}>
        👤
      </div>
      
      {/* Privacy shields */}
      <div className="privacy-shield absolute w-6 h-6 text-blue-500" style={{left: '25%', top: '45%'}}>🛡️</div>
      <div className="privacy-shield absolute w-6 h-6 text-green-500" style={{left: '75%', top: '45%'}}>🛡️</div>
      <div className="privacy-shield absolute w-6 h-6 text-purple-500" style={{left: '50%', top: '25%'}}>🛡️</div>
      
      {/* Privacy particles */}
      <div className="privacy-particle absolute w-2 h-2 bg-blue-400 rounded-full" style={{left: '40%', top: '20%'}}></div>
      <div className="privacy-particle absolute w-2 h-2 bg-green-400 rounded-full" style={{left: '60%', top: '80%'}}></div>
      <div className="privacy-particle absolute w-2 h-2 bg-purple-400 rounded-full" style={{left: '20%', top: '60%'}}></div>
      <div className="privacy-particle absolute w-2 h-2 bg-red-400 rounded-full" style={{left: '80%', top: '60%'}}></div>
    </div>
  );
};

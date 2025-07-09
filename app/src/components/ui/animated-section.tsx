'use client'

import { ReactNode } from 'react'
import { useScrollAnimation, useParallax } from '@/hooks/use-scroll-animation'
import { cn } from '@/lib/utils'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  animation?: 'fade' | 'slide-up' | 'slide-left' | 'slide-right' | 'parallax'
  delay?: number
  duration?: number
  parallaxSpeed?: number
}

export const AnimatedSection = ({ 
  children, 
  className,
  animation = 'fade',
  delay = 0,
  duration = 0.8,
  parallaxSpeed = 0.5
}: AnimatedSectionProps) => {
  const { ref: animationRef, isVisible, scrollProgress } = useScrollAnimation({
    threshold: 0.1,
    once: true
  })

  const { ref: parallaxRef, offset } = useParallax(parallaxSpeed)

  // Styles d'animation basés sur le type
  const getAnimationStyles = () => {
    const baseStyles = {
      transition: `all ${duration}s cubic-bezier(0.4, 0, 0.2, 1)`,
      transitionDelay: `${delay}s`
    }

    if (animation === 'parallax') {
      return {
        ...baseStyles,
        transform: `translateY(${offset * -1}px)`
      }
    }

    if (!isVisible) {
      switch (animation) {
        case 'fade':
          return {
            ...baseStyles,
            opacity: 0
          }
        case 'slide-up':
          return {
            ...baseStyles,
            opacity: 0,
            transform: 'translateY(50px)'
          }
        case 'slide-left':
          return {
            ...baseStyles,
            opacity: 0,
            transform: 'translateX(50px)'
          }
        case 'slide-right':
          return {
            ...baseStyles,
            opacity: 0,
            transform: 'translateX(-50px)'
          }
        default:
          return baseStyles
      }
    }

    return {
      ...baseStyles,
      opacity: 1,
      transform: 'translateY(0) translateX(0)'
    }
  }

  const ref = animation === 'parallax' ? parallaxRef : animationRef

  return (
    <div
      ref={ref as any}
      className={cn(className)}
      style={getAnimationStyles()}
    >
      {children}
    </div>
  )
}

// Composant spécialisé pour les animations de progrès
export const ProgressBar = ({ className }: { className?: string }) => {
  const { ref, scrollProgress } = useScrollAnimation({
    threshold: 0,
    once: false
  })

  return (
    <div 
      ref={ref as any}
      className={cn("w-full h-1 bg-gray-200 rounded-full overflow-hidden", className)}
    >
      <div 
        className="h-full bg-primary transition-all duration-300 ease-out"
        style={{ width: `${scrollProgress * 100}%` }}
      />
    </div>
  )
} 
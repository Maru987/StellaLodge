'use client'

import { useEffect, useRef, useState } from 'react'
import { useLenisContext } from '@/components/providers/lenis-provider'

interface ScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export const useScrollAnimation = (options: ScrollAnimationOptions = {}) => {
  const { threshold = 0.1, rootMargin = '0px', once = true } = options
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const elementRef = useRef<HTMLElement>(null)
  const { lenis } = useLenisContext()

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // Observer pour détecter quand l'élément entre dans la vue
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) {
            observer.unobserve(element)
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)

    // Écouter les événements de scroll de Lenis pour calculer le progrès
    const handleScroll = () => {
      if (!element || !lenis) return

      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementHeight = rect.height
      const elementTop = rect.top

      // Calculer le progrès de scroll pour cet élément
      const start = windowHeight
      const end = -elementHeight
      const progress = Math.max(0, Math.min(1, (start - elementTop) / (start - end)))
      
      setScrollProgress(progress)
    }

    if (lenis) {
      lenis.on('scroll', handleScroll)
    }

    return () => {
      observer.disconnect()
      if (lenis) {
        lenis.off('scroll', handleScroll)
      }
    }
  }, [lenis, threshold, rootMargin, once])

  return {
    ref: elementRef,
    isVisible,
    scrollProgress
  }
}

// Hook pour créer des animations de parallaxe
export const useParallax = (speed: number = 0.5) => {
  const [offset, setOffset] = useState(0)
  const elementRef = useRef<HTMLElement>(null)
  const { lenis } = useLenisContext()

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current || !lenis) return

      const rect = elementRef.current.getBoundingClientRect()
      const scrolled = window.scrollY
      const rate = scrolled * speed
      
      setOffset(rate)
    }

    if (lenis) {
      lenis.on('scroll', handleScroll)
    }

    return () => {
      if (lenis) {
        lenis.off('scroll', handleScroll)
      }
    }
  }, [lenis, speed])

  return {
    ref: elementRef,
    offset
  }
} 
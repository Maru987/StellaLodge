'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

interface LenisOptions {
  duration?: number
  easing?: (t: number) => number
  direction?: 'vertical' | 'horizontal'
  gestureDirection?: 'vertical' | 'horizontal' | 'both'
  smooth?: boolean
  mouseMultiplier?: number
  smoothTouch?: boolean
  touchMultiplier?: number
  infinite?: boolean
}

export const useLenis = (options?: LenisOptions) => {
  const lenisRef = useRef<Lenis | null>(null)
  const rafRef = useRef<number>()

  useEffect(() => {
    // Configuration par défaut avec les paramètres que vous avez fournis
    const defaultOptions: LenisOptions = {
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
      ...options
    }

    // Initialiser Lenis
    lenisRef.current = new Lenis(defaultOptions)

    // Écouter les événements de scroll
    lenisRef.current.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
      // Vous pouvez décommenter cette ligne pour déboguer
      // console.log({ scroll, limit, velocity, direction, progress })
    })

    // Fonction d'animation
    const raf = (time: number) => {
      lenisRef.current?.raf(time)
      rafRef.current = requestAnimationFrame(raf)
    }

    // Démarrer l'animation
    rafRef.current = requestAnimationFrame(raf)

    // Nettoyage
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      if (lenisRef.current) {
        lenisRef.current.destroy()
      }
    }
  }, [])

  return lenisRef.current
} 
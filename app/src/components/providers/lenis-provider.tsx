'use client'

import { createContext, useContext, useEffect, useRef, ReactNode } from 'react'
import Lenis from 'lenis'

interface LenisContextType {
  lenis: Lenis | null
  scrollTo: (target: string | number | HTMLElement, options?: any) => void
}

const LenisContext = createContext<LenisContextType | null>(null)

export const useLenisContext = () => {
  const context = useContext(LenisContext)
  if (!context) {
    throw new Error('useLenisContext must be used within a LenisProvider')
  }
  return context
}

interface LenisProviderProps {
  children: ReactNode
}

export const LenisProvider = ({ children }: LenisProviderProps) => {
  const lenisRef = useRef<Lenis | null>(null)
  const rafRef = useRef<number>()

  useEffect(() => {
    // Configuration Lenis avec vos paramètres et les bonnes options
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical', // Utiliser 'orientation' au lieu de 'direction'
      gestureOrientation: 'vertical', // Utiliser 'gestureOrientation' au lieu de 'gestureDirection'
      smoothWheel: true, // Équivalent à 'smooth'
      wheelMultiplier: 1, // Équivalent à 'mouseMultiplier'
      touchMultiplier: 2,
      infinite: false,
    })

    // Écouter les événements de scroll
    lenisRef.current.on('scroll', (e) => {
      // Vous pouvez décommenter cette ligne pour déboguer
      // console.log(e)
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

  const scrollTo = (target: string | number | HTMLElement, options?: any) => {
    lenisRef.current?.scrollTo(target, options)
  }

  const contextValue: LenisContextType = {
    lenis: lenisRef.current,
    scrollTo
  }

  return (
    <LenisContext.Provider value={contextValue}>
      {children}
    </LenisContext.Provider>
  )
} 
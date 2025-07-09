'use client'

import { useEffect, useState } from 'react'
import { Button } from './button'
import { ChevronUp } from 'lucide-react'
import { useLenisContext } from '@/components/providers/lenis-provider'
import { cn } from '@/lib/utils'

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)
  const { scrollTo } = useLenisContext()

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const handleScrollToTop = () => {
    scrollTo(0, {
      duration: 1.5,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    })
  }

  return (
    <Button
      onClick={handleScrollToTop}
      className={cn(
        "fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full shadow-lg transition-all duration-300 transform",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
      )}
      size="icon"
      variant="default"
    >
      <ChevronUp className="w-5 h-5" />
    </Button>
  )
} 
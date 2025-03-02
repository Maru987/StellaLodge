// components/sections/hero-section.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage: string;
  backgroundOpacity?: number;
  ctaText?: string;
  ctaAction?: () => void;
  scrollToNextSection?: () => void;
  logoImage?: string;
  overlayColor?: string;
  className?: string;
}

export function HeroSection({
  title,
  subtitle,
  backgroundImage,
  backgroundOpacity = 0.5,
  ctaText = "Book Now",
  ctaAction,
  scrollToNextSection,
  logoImage,
  overlayColor = "rgba(0, 0, 0, 0.4)",
  className,
}: HeroSectionProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className={cn("relative h-screen w-full flex flex-col items-center justify-center overflow-hidden", className)}>
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src={backgroundImage}
          alt={title}
          fill
          priority
          className={cn(
            "object-cover transition-opacity duration-1000", 
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setIsLoaded(true)}
        />
        {/* Overlay Color */}
        <div 
          className="absolute inset-0 z-10" 
          style={{ backgroundColor: overlayColor, opacity: backgroundOpacity }}
        />
      </div>

      {/* Content Container */}
      <div className="container relative z-20 mx-auto px-4 text-center text-white">
        {/* Logo (if provided) */}
        {logoImage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <Image
              src={logoImage}
              alt="Logo"
              width={180}
              height={80}
              className="mx-auto"
            />
          </motion.div>
        )}

        {/* Title with animation */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl md:text-5xl lg:text-6xl font-heading font-light mb-4 md:mb-6"
        >
          {title}
        </motion.h1>

        {/* Subtitle with animation */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl font-body mb-8 md:mb-10 max-w-3xl mx-auto"
          >
            {subtitle}
          </motion.p>
        )}

        {/* CTA Button with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Button 
            size="lg" 
            onClick={ctaAction}
            className="bg-primary hover:bg-primary-600 text-white px-8 py-6 rounded-md text-lg transition-all duration-200 hover:shadow-lg"
          >
            {ctaText}
          </Button>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      {scrollToNextSection && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer"
          onClick={scrollToNextSection}
        >
          <div className="flex flex-col items-center text-white">
            <span className="text-sm mb-2">Scroll Down</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronDown size={30} />
            </motion.div>
          </div>
        </motion.div>
      )}
    </section>
  );
}

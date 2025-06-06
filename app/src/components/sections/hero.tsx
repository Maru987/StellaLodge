'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Property } from '@/types/property';
import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { AnimatedText } from '@/components/ui/animated-underline-text-one';
import { motion } from 'framer-motion';

interface HeroProps {
  property: Property;
  className?: string;
}

export function Hero({ property, className }: HeroProps) {
  const { name, tagline } = property;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Détecter si l'appareil est mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Vérifier au chargement
    checkIfMobile();
    
    // Vérifier au redimensionnement
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Effet pour gérer la lecture automatique de la vidéo
  useEffect(() => {
    if (!videoRef.current) return;
    // Appliquer uniquement sur desktop
    if (isMobile) return;

    const video = videoRef.current;
    // Essayer de lancer la lecture automatiquement
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        // La lecture a démarré automatiquement
      }).catch((error) => {
        // La lecture automatique a échoué (restriction navigateur)
        // On ne fait rien, le poster reste affiché
      });
    }
  }, [isMobile]);

  return (
    <section 
      className={cn(
        'relative min-h-screen flex items-center justify-center overflow-hidden',
        className
      )}
    >
      {/* Vidéo d'arrière-plan */}
      <div className="absolute inset-0 z-0">
        {/* Image de secours si la vidéo ne se charge pas ou sur mobile */}
        {(!isVideoLoaded || isMobile) && (
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ 
              backgroundImage: 'url(/images/Terrasse.jpg)',
              backgroundPosition: 'center center',
              backgroundSize: 'cover'
            }} 
          />
        )}
        
        {/* Vidéo uniquement sur desktop */}
        {!isMobile && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            controls={false}
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'none' }}
            poster="/images/Terrasse.jpg"
          >
            <source src="/IMG_E0320_converted_v3.mp4" type="video/mp4" />
            <source src="/IMG_E0320_converted_v3.mp4" type="video/mp4" />
            Votre navigateur ne prend pas en charge la lecture de vidéos.
          </video>
        )}
      </div>

      {/* Contenu */}
      <div className="container relative z-10 px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto text-white">
          {/* Titre animé */}
          <AnimatedText 
            text={name}
            textClassName="text-4xl md:text-6xl font-heading font-bold drop-shadow-lg text-white"
            subtitle={tagline}
            subtitleClassName="text-xl md:text-2xl font-light drop-shadow-md text-white"
            className="mb-10"
          />
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link
              href="#pricing"
              className="bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white px-8 py-3 rounded-md font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Réserver maintenant
            </Link>
            <Link
              href="#gallery"
              className="bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white px-8 py-3 rounded-md font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Découvrir
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 
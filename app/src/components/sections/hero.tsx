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

  // Effet pour gérer la lecture automatique de la vidéo
  useEffect(() => {
    if (videoRef.current) {
      // Événement pour détecter quand la vidéo est chargée
      const handleLoadedData = () => {
        console.log("Vidéo chargée avec succès");
        setIsVideoLoaded(true);
      };

      // Événement pour gérer les erreurs de lecture
      const handleError = (error: any) => {
        console.error("Erreur de lecture de la vidéo:", error);
        setIsVideoLoaded(false);
      };

      // Ajouter les écouteurs d'événements
      videoRef.current.addEventListener('loadeddata', handleLoadedData);
      videoRef.current.addEventListener('error', handleError);

      // Tenter de lire la vidéo
      videoRef.current.play().catch(handleError);

      // Nettoyage des écouteurs d'événements
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('loadeddata', handleLoadedData);
          videoRef.current.removeEventListener('error', handleError);
        }
      };
    }
  }, []);

  return (
    <section 
      className={cn(
        'relative min-h-screen flex items-center justify-center overflow-hidden',
        className
      )}
    >
      {/* Vidéo d'arrière-plan */}
      <div className="absolute inset-0 z-0">
        {/* Image de secours si la vidéo ne se charge pas */}
        {!isVideoLoaded && (
          <div className="absolute inset-0 bg-primary-900/50" />
        )}
        
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          src="/IMG_E0320.MP4"
        >
          Votre navigateur ne prend pas en charge la lecture de vidéos.
        </video>
        <div className="absolute inset-0 bg-black/40" />
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
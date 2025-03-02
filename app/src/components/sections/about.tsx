'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Property } from '@/types/property';
import { Bed, Bath, Users, Home } from 'lucide-react';
import { BounceCards } from '@/components/ui/bounce-cards';
import { useMediaQuery } from '@/components/hooks/use-media-query';

interface AboutProps {
  property: Property;
  className?: string;
}

export function About({ property, className }: AboutProps) {
  const { name, description, bedrooms, bathrooms, maxGuests, squareMeters } = property;
  const boxRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Créer un tableau d'images pour l'animation
  const galleryImages = property.gallery 
    ? property.gallery.slice(0, 5).map(img => img.url) 
    : [];

  // Styles de transformation personnalisés pour les cartes avec plus d'espacement
  const transformStyles = [
    "rotate(3deg) translate(-340px, -15px)",
    "rotate(-2deg) translate(-170px, 15px)",
    "rotate(0deg) translate(0px, 0px)",
    "rotate(2deg) translate(170px, 15px)",
    "rotate(-3deg) translate(340px, -15px)"
  ];

  // Gérer le clic sur une carte
  const handleCardClick = (index: number) => {
    // Au lieu d'afficher l'image en modal, on dirige vers la section galerie
    const gallerySection = document.getElementById('gallery');
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="intro" 
      className={cn(
        'py-8 md:py-12 bg-white text-black flex items-center justify-center',
        className
      )}
    >
      <div className="container px-4 mx-auto flex flex-col py-0">
        {/* Titre */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          variants={fadeIn}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 text-primary">
            Bienvenue à {name}
          </h2>
        </motion.div>

        {/* Description complète */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          variants={fadeIn}
          className="mb-8"
        >
          <div className="prose prose-lg max-w-4xl mx-auto text-center">
            <p className="text-lg md:text-xl leading-relaxed text-black">
              {description}
            </p>
          </div>
        </motion.div>
        
        {/* Caractéristiques en ligne - avec espacement équilibré */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          variants={fadeIn}
          className="flex justify-center mb-6"
        >
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2">
              <Bed className="h-6 w-6 text-primary" />
              <span className="font-medium text-black">{bedrooms} Chambres</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Bath className="h-6 w-6 text-primary" />
              <span className="font-medium text-black">{bathrooms} Salles de bain</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              <span className="font-medium text-black">{maxGuests} personnes</span>
            </div>
            
            {squareMeters && (
              <div className="flex items-center gap-2">
                <Home className="h-6 w-6 text-primary" />
                <span className="font-medium text-black">{squareMeters} m²</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Grande boîte avec animation de cartes - visible uniquement sur desktop */}
        {isDesktop && (
          <motion.div
            ref={boxRef}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            variants={fadeIn}
            className="bg-white p-4 flex justify-center items-center relative overflow-hidden mb-0"
          >
            {/* Animation de cartes rebondissantes */}
            <div className="relative z-10 flex justify-center items-center w-full h-full">
              <BounceCards
                images={galleryImages}
                containerWidth={1000}
                containerHeight={350}
                transformStyles={transformStyles}
                hoverText="Voir la galerie"
                onCardClick={handleCardClick}
                className="mx-auto"
              />
            </div>
          </motion.div>
        )}
        
        {/* Lien vers la galerie pour mobile */}
        {!isDesktop && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            variants={fadeIn}
            className="mt-4 mb-8 text-center"
          >
            <button
              onClick={() => {
                const gallerySection = document.getElementById('gallery');
                if (gallerySection) {
                  gallerySection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-6 py-3 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              Voir notre galerie
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
} 
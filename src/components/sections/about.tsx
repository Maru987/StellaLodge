'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Property } from '@/types/property';
import { Bed, Bath, Users, Home } from 'lucide-react';
import { useMediaQuery } from '@/components/hooks/use-media-query';

interface AboutProps {
  property: Property;
  className?: string;
}

export function About({ property, className }: AboutProps) {
  const { name, description, bedrooms, bathrooms, maxGuests, squareMeters } = property;
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Créer un tableau d'images pour la galerie verticale
  const galleryImages = property.gallery 
    ? property.gallery.slice(0, 5).map(img => img.url) 
    : [];

  return (
    <section 
      id="intro" 
      className={cn(
        'py-12 md:py-16 bg-white text-black',
        className
      )}
    >
      <div className="container px-4 mx-auto">
        {/* Titre pour mobile uniquement */}
        {!isDesktop && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            variants={fadeIn}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-heading font-bold mb-4 text-primary">
              Bienvenue à {name}
            </h2>
          </motion.div>
        )}

        {/* Contenu principal avec disposition flex */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
          {/* Colonne de gauche - Texte */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            variants={fadeIn}
            className="w-full md:w-1/2 order-2 md:order-1"
          >
            {/* Titre pour desktop uniquement */}
            {isDesktop && (
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-primary">
                Bienvenue à {name}
              </h2>
            )}
            
            {/* Description avec paragraphes mieux formatés */}
            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-lg leading-relaxed text-black mb-4">
                Bienvenue dans notre maison simple et confortable, idéalement située au cœur de Papeete. Notre Fare Tahitien vous offre un havre de paix où règnent tranquillité et sérénité, tout en bénéficiant d'une localisation privilégiée au centre-ville.
              </p>
              <p className="text-lg leading-relaxed text-black mb-4">
                Vous apprécierez la proximité immédiate des commerces, restaurants et attractions culturelles, tout en profitant d'un environnement calme et reposant.
              </p>
              <p className="text-lg leading-relaxed text-black">
                Notre équipe vous accueillera chaleureusement et sera à votre disposition pour rendre votre séjour inoubliable. Que vous soyez en voyage d'affaires ou en quête de découverte de l'île, Stella Lodge est le point de départ idéal pour toutes vos aventures tahitiennes.
              </p>
            </div>
            
            {/* Caractéristiques en grille 2x2 */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="flex items-center gap-3">
                <Bed className="h-6 w-6 text-primary" />
                <span className="font-medium text-black">{bedrooms} Chambres</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Bath className="h-6 w-6 text-primary" />
                <span className="font-medium text-black">{bathrooms} Salles de bain</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-primary" />
                <span className="font-medium text-black">{maxGuests} personnes</span>
              </div>
              
              {squareMeters && (
                <div className="flex items-center gap-3">
                  <Home className="h-6 w-6 text-primary" />
                  <span className="font-medium text-black">{squareMeters} m²</span>
                </div>
              )}
            </div>
            
            {/* Bouton pour voir la galerie */}
            <button
              onClick={() => {
                const gallerySection = document.getElementById('gallery');
                if (gallerySection) {
                  gallerySection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-6 py-3 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              Voir notre galerie complète
            </button>
          </motion.div>
          
          {/* Colonne de droite - Images verticales */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            variants={fadeIn}
            className="w-full md:w-1/2 order-1 md:order-2 flex justify-center"
          >
            <div className="relative h-[700px] w-full max-w-[450px]">
              {/* Images principales */}
              {galleryImages.slice(0, 3).map((src, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.2 + (idx * 0.15)
                  }}
                  className={cn(
                    "absolute rounded-2xl overflow-hidden shadow-xl border-4 border-white",
                    "w-[280px] h-[200px]",
                    idx === 0 && "top-0 left-0 z-10 rotate-[-4deg]",
                    idx === 1 && "top-[180px] right-0 z-20 rotate-[3deg]",
                    idx === 2 && "bottom-[140px] left-[40px] z-30 rotate-[-2deg]"
                  )}
                >
                  <Image
                    src={src}
                    alt={`Image de ${name} ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover hover:scale-110 transition-transform duration-500"
                  />
                </motion.div>
              ))}
              
              {/* Images supplémentaires */}
              {galleryImages.slice(3, 5).map((src, idx) => (
                <motion.div
                  key={idx + 3}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.5 + (idx * 0.15)
                  }}
                  className={cn(
                    "absolute rounded-2xl overflow-hidden shadow-xl border-4 border-white",
                    "w-[220px] h-[160px]",
                    idx === 0 && "bottom-0 left-[10px] z-20 rotate-[4deg]",
                    idx === 1 && "bottom-[60px] right-[20px] z-10 rotate-[-5deg]"
                  )}
                >
                  <Image
                    src={src}
                    alt={`Image de ${name} ${idx + 4}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover hover:scale-110 transition-transform duration-500"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 
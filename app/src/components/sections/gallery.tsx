'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Property, GalleryImage } from '@/types/property';
import { X } from 'lucide-react';

interface GalleryProps {
  property: Property;
  className?: string;
}

export function Gallery({ property, className }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const { gallery } = property;
  
  // Définir toutes les catégories possibles
  const allCategories = ['interior', 'bedroom', 'bathroom', 'kitchen', 'exterior', 'outdoor'];
  
  // Filtrer pour n'inclure que les catégories qui ont des images
  const availableCategories = allCategories.filter(category => 
    gallery.some(img => img.category === category)
  );
  
  // Filtrer les images par catégorie
  const filteredImages = activeCategory === 'all' 
    ? gallery 
    : gallery.filter(img => img.category === activeCategory);

  // Ouvrir l'image en plein écran
  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  // Fermer l'image en plein écran
  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  // Traduire les catégories en français
  const getCategoryLabel = (category: string) => {
    const translations: Record<string, string> = {
      'all': 'Toutes',
      'exterior': 'Extérieur',
      'interior': 'Intérieur',
      'bedroom': 'Chambre',
      'bathroom': 'Salle de bain',
      'kitchen': 'Cuisine',
      'outdoor': 'Extérieur',
      'other': 'Autre'
    };
    return translations[category] || category;
  };

  return (
    <section 
      id="gallery" 
      className={cn(
        'py-16 md:py-24 bg-white text-black',
        className
      )}
    >
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-primary">
            Galerie
          </h2>
          <p className="text-lg text-black max-w-2xl mx-auto">
            Découvrez notre propriété à travers cette sélection d'images
          </p>
        </motion.div>

        {/* Filtres de catégories */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {/* Bouton "Toutes" */}
          <button
            onClick={() => setActiveCategory('all')}
            className={
              activeCategory === 'all'
                ? "px-4 py-2 rounded-full text-sm font-medium bg-primary text-white border border-primary shadow-sm"
                : "px-4 py-2 rounded-full text-sm font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:text-gray-900"
            }
          >
            Toutes
          </button>
          
          {/* Boutons pour chaque catégorie disponible */}
          {availableCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={
                activeCategory === category
                  ? "px-4 py-2 rounded-full text-sm font-medium bg-primary text-white border border-primary shadow-sm"
                  : "px-4 py-2 rounded-full text-sm font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:text-gray-900"
              }
            >
              {getCategoryLabel(category)}
            </button>
          ))}
        </div>

        {/* Grille d'images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => openLightbox(image)}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-4 w-full text-white">
                  <p className="font-medium">{image.alt}</p>
                  <p className="text-sm opacity-80">{getCategoryLabel(image.category)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button 
            className="absolute top-4 right-4 text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
            onClick={closeLightbox}
          >
            <X size={24} />
          </button>
          <div 
            className="relative max-w-5xl max-h-[90vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage.url}
              alt={selectedImage.alt}
              fill
              className="object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 text-white">
              <p className="font-medium">{selectedImage.alt}</p>
              <p className="text-sm opacity-80">{getCategoryLabel(selectedImage.category)}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
} 
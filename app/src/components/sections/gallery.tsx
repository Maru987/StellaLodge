'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Property, GalleryImage as PropertyGalleryImage } from '@/types/property';
import { X } from 'lucide-react';
import { fetchGalleryImages, GalleryImage as SupabaseGalleryImage } from '@/lib/supabase';

interface GalleryProps {
  property: Property;
  className?: string;
}

export function Gallery({ property, className }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<PropertyGalleryImage | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [galleryImages, setGalleryImages] = useState<SupabaseGalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Charger les images depuis Supabase au chargement du composant
  useEffect(() => {
    const loadGalleryImages = async () => {
      try {
        setIsLoading(true);
        const result = await fetchGalleryImages();
        
        if (result.success && result.data) {
          // Filtrer pour ne garder que les images mises en avant (featured)
          const featuredImages = result.data.filter(img => img.featured);
          setGalleryImages(featuredImages);
        } else {
          console.error('Erreur lors du chargement des images:', result.error);
          setError('Impossible de charger les images de la galerie');
          // Utiliser les images statiques comme fallback
          setGalleryImages([]);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des images:', err);
        setError('Impossible de charger les images de la galerie');
        setGalleryImages([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadGalleryImages();
  }, []);
  
  // Utiliser les images de Supabase si disponibles, sinon utiliser les images statiques
  const gallery = galleryImages.length > 0 
    ? galleryImages.map(img => ({
        id: img.id || '',
        url: img.url,
        alt: img.alt_text || img.title,
        category: img.category as any,
        featured: img.featured
      }))
    : property.gallery;
  
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
  const openLightbox = (image: PropertyGalleryImage) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  // Fermer l'image en plein écran
  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  // Gérer les touches du clavier pour fermer l'image avec Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedImage) {
        closeLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImage]);

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

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 mb-8">
            {error}
          </div>
        ) : (
          <>
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
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
          </>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Bouton de fermeture plus grand et plus visible */}
          <button 
            className="absolute top-4 right-4 text-white p-3 rounded-full bg-black/70 hover:bg-primary transition-colors z-[60] border-2 border-white/30 hover:border-white"
            onClick={closeLightbox}
            aria-label="Fermer l'image"
          >
            <X size={28} strokeWidth={2.5} />
          </button>
          
          {/* Message d'aide pour fermer */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-black/70 px-4 py-2 rounded-full text-white text-sm opacity-70">
            Cliquez n'importe où pour fermer
          </div>
          
          <div 
            className="relative max-w-5xl max-h-[90vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage.url}
              alt={selectedImage.alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
            
            {/* Bouton de fermeture supplémentaire en bas */}
            <button 
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white px-6 py-2 rounded-full bg-primary hover:bg-primary/80 transition-colors mt-4"
              onClick={closeLightbox}
            >
              Fermer
            </button>
            
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
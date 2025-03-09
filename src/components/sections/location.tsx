'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Property, NearbyAttraction } from '@/types/property';
import { MapPin, Navigation, Clock, ExternalLink } from 'lucide-react';

interface LocationProps {
  property: Property;
  className?: string;
}

export function Location({ property, className }: LocationProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const { location, nearbyAttractions = [] } = property;
  
  // Extraire les catégories uniques des attractions
  const categories = nearbyAttractions.length > 0 
    ? ['all', ...new Set(nearbyAttractions.map(item => item.category))]
    : [];
  
  // Filtrer les attractions par catégorie
  const filteredAttractions = activeCategory === 'all' 
    ? nearbyAttractions 
    : nearbyAttractions.filter(item => item.category === activeCategory);

  // Traduire les catégories en français
  const getCategoryLabel = (category: string) => {
    const translations: Record<string, string> = {
      'all': 'Toutes',
      'beach': 'Plages',
      'restaurant': 'Restaurants',
      'shopping': 'Shopping',
      'attraction': 'Attractions',
      'transport': 'Transport',
      'essential': 'Essentiels'
    };
    return translations[category] || category;
  };

  // Coordonnées de l'emplacement
  const actualLatitude = -17.527361;
  const actualLongitude = -149.559583;

  // URL pour l'iframe Google Maps
  const getGoogleMapsEmbedUrl = () => {
    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.0!2d${actualLongitude}!3d${actualLatitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDMxJzM4LjUiUyAxNDnCsDMzJzM0LjUiVw!5e0!3m2!1sfr!2sfr!4v1615129123456!5m2!1sfr!2sfr`;
  };

  // URL pour voir sur Google Maps
  const getGoogleMapsViewUrl = () => {
    return `https://www.google.com/maps?q=${actualLatitude},${actualLongitude}&z=15&hl=fr`;
  };

  return (
    <section 
      id="location" 
      className={cn(
        'py-16 md:py-24 bg-white',
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
            Emplacement
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            {location.address}, {location.city}, {location.region}, {location.postalCode}, {location.country}
          </p>
        </motion.div>

        {/* Carte sur toute la largeur */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative h-[500px] w-full rounded-lg overflow-hidden shadow-md mb-16"
        >
          <iframe 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            style={{ border: 0 }}
            src={getGoogleMapsEmbedUrl()} 
            allowFullScreen
            title="Carte de l'emplacement"
            className="absolute inset-0"
          />
          <div className="absolute bottom-4 right-4 z-10">
            <a 
              href={getGoogleMapsViewUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-md"
            >
              <ExternalLink size={16} />
              Voir sur Google Maps
            </a>
          </div>
        </motion.div>

        {/* Attractions à proximité */}
        {nearbyAttractions.length > 0 && (
          <>
            <h3 className="text-2xl font-heading font-semibold text-center mb-8 text-black">
              À proximité
            </h3>

            {/* Filtres de catégories */}
            {categories.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                      activeCategory === category
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-primary/10'
                    )}
                  >
                    {getCategoryLabel(category)}
                  </button>
                ))}
              </div>
            )}

            {/* Liste des attractions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredAttractions.map((attraction, index) => (
                <motion.div
                  key={attraction.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
                  <h4 className="font-medium text-lg mb-2 text-gray-800">{attraction.name}</h4>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Navigation className="w-4 h-4 mr-2 text-primary" />
                    <span className="font-medium">{attraction.distance}</span>
                    {attraction.travelTime && (
                      <span className="ml-1">{attraction.travelTime}</span>
                    )}
                  </div>
                  
                  {attraction.url && (
                    <a 
                      href={attraction.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block mt-4 text-sm text-primary hover:underline"
                    >
                      En savoir plus
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
} 
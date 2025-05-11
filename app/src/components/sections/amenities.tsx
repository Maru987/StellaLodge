'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Property, Amenity } from '@/types/property';
import { LucideIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import React from 'react';
import { BorderTrail } from '@/components/ui/border-trail';

interface AmenitiesProps {
  property: Property;
  className?: string;
}

// Définition des catégories principales et leurs traductions
const mainCategories = [
  { id: 'entertainment', label: 'Entertainment & Connectivity', icon: 'Tv' },
  { id: 'kitchen', label: 'Kitchen & Appliances', icon: 'UtensilsCrossed' },
  { id: 'comfort', label: 'Comfort & Climate', icon: 'Thermometer' },
  { id: 'parking', label: 'Parking & Storage', icon: 'Car' }
];

// Mapping des catégories d'équipements aux catégories principales
const categoryMapping: Record<string, string> = {
  'general': 'entertainment',
  'bedroom': 'comfort',
  'bathroom': 'comfort',
  'kitchen': 'kitchen',
  'outdoor': 'comfort',
  'parking': 'parking',
  'other': 'entertainment'
};

// Traduction des catégories en français
const categoryTranslations: Record<string, string> = {
  'entertainment': 'Divertissement & Connectivité',
  'kitchen': 'Cuisine & Appareils',
  'comfort': 'Confort & Climat',
  'parking': 'Stationnement & Rangement',
  'general': 'Général',
  'bedroom': 'Chambre',
  'bathroom': 'Salle de bain',
  'outdoor': 'Extérieur',
  'other': 'Autre'
};

export function Amenities({ property, className }: AmenitiesProps) {
  const { amenities } = property;
  
  // Organiser les équipements par catégorie principale
  const amenitiesByMainCategory: Record<string, Amenity[]> = {};
  
  mainCategories.forEach(category => {
    amenitiesByMainCategory[category.id] = [];
  });
  
  // Ajouter manuellement les équipements de divertissement spécifiques
  const entertainmentAmenities: Amenity[] = [
    {
      id: 'smart-tv',
      name: 'TV Smart',
      description: 'Écran plat avec accès Netflix',
      category: 'general',
      icon: 'tv'
    },
    {
      id: 'netflix',
      name: 'Netflix',
      description: 'Films et séries à volonté',
      category: 'general',
      icon: 'play-circle'
    },
    {
      id: 'high-speed-internet',
      name: 'Internet Haut Débit',
      description: 'Connexion fibre optique',
      category: 'general',
      icon: 'router'
    },
    {
      id: 'wifi-coverage',
      name: 'Couverture WiFi',
      description: 'Dans toutes les pièces',
      category: 'general',
      icon: 'wifi'
    }
  ];
  
  // Ajouter manuellement les équipements de cuisine
  const kitchenAmenities: Amenity[] = [
    {
      id: 'oven-microwave',
      name: 'Four & Micro-ondes',
      description: 'Pour préparer vos repas',
      category: 'kitchen',
      icon: 'oven'
    },
    {
      id: 'fridge-utensils',
      name: 'Réfrigérateur & Ustensiles',
      description: 'Tout le nécessaire pour cuisiner',
      category: 'kitchen',
      icon: 'utensils'
    },
    {
      id: 'coffee-kettle',
      name: 'Machine à café & Bouilloire',
      description: 'Pour vos boissons chaudes',
      category: 'kitchen',
      icon: 'coffee'
    },
    {
      id: 'washing-machine',
      name: 'Machine à laver',
      description: 'Pour votre confort',
      category: 'kitchen',
      icon: 'washing-machine'
    }
  ];
  
  // Ajouter manuellement les équipements de confort et climat
  const comfortAmenities: Amenity[] = [
    {
      id: 'air-conditioning',
      name: 'Climatisation',
      description: 'Température idéale en toute saison',
      category: 'bedroom',
      icon: 'air-conditioning'
    },
    {
      id: 'private-garden',
      name: 'Jardin Privé',
      description: 'Espace extérieur paisible',
      category: 'outdoor',
      icon: 'palm-tree'
    },
    {
      id: 'terrace',
      name: 'Terrasse',
      description: 'Pour profiter du plein air',
      category: 'outdoor',
      icon: 'umbrella'
    }
  ];
  
  // Ajouter manuellement les équipements de parking et rangement
  const parkingAmenities: Amenity[] = [
    {
      id: 'private-garage',
      name: 'Garage Privé',
      description: 'Stationnement sécurisé',
      category: 'other',
      icon: 'garage'
    },
    {
      id: 'additional-parking',
      name: 'Parking Supplémentaire',
      description: 'Places additionnelles',
      category: 'other',
      icon: 'parking'
    },
    {
      id: 'electric-gate',
      name: 'Portail Électrique',
      description: 'Accès sécurisé et pratique',
      category: 'other',
      icon: 'gate'
    },
    {
      id: 'maintenance-equipment',
      name: 'Équipement d\'entretien',
      description: 'Outils et produits disponibles',
      category: 'other',
      icon: 'tool'
    }
  ];
  
  // Remplacer les équipements de divertissement par notre liste personnalisée
  amenitiesByMainCategory['entertainment'] = entertainmentAmenities;
  
  // Remplacer les équipements de cuisine par notre liste personnalisée
  amenitiesByMainCategory['kitchen'] = kitchenAmenities;
  
  // Remplacer les équipements de confort par notre liste personnalisée
  amenitiesByMainCategory['comfort'] = comfortAmenities;
  
  // Remplacer les équipements de parking par notre liste personnalisée
  amenitiesByMainCategory['parking'] = parkingAmenities;
  
  // Ajouter les autres équipements normalement
  amenities.forEach(amenity => {
    const mainCategory = categoryMapping[amenity.category] || 'other';
    if (mainCategory !== 'entertainment' && mainCategory !== 'kitchen' && 
        mainCategory !== 'comfort' && mainCategory !== 'parking' && 
        amenitiesByMainCategory[mainCategory]) {
      amenitiesByMainCategory[mainCategory].push(amenity);
    }
  });

  return (
    <section 
      id="amenities" 
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
            Équipement & Services
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Tous les essentiels pour un séjour confortable et agréable
          </p>
        </motion.div>

        {/* Grille des catégories principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {mainCategories.map((category, index) => {
            const categoryAmenities = amenitiesByMainCategory[category.id] || [];
            if (categoryAmenities.length === 0) return null;
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="relative bg-white rounded-lg shadow-md p-6 border border-gray-100 overflow-hidden"
              >
                <BorderTrail 
                  className="bg-gradient-to-l from-zinc-700 via-black to-zinc-700"
                  size={120}
                  style={{
                    boxShadow:
                      "0px 0px 60px 30px rgb(255 255 255 / 50%), 0 0 100px 60px rgb(0 0 0 / 50%), 0 0 140px 90px rgb(0 0 0 / 50%)",
                  }}
                  transition={{
                    ease: [0, 0.5, 0.8, 0.5],
                    duration: 4,
                    repeat: Infinity
                  }}
                />
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  {categoryTranslations[category.id]}
                </h3>
                
                <div className="space-y-4">
                  {categoryAmenities.map((amenity) => (
                    <div key={amenity.id} className="flex items-center gap-3">
                      <div className="">
                        <DynamicIcon name={amenity.icon} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{amenity.name}</p>
                        {amenity.description && (
                          <p className="text-sm text-gray-500">{amenity.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Composant pour charger dynamiquement les icônes Lucide
const DynamicIcon = ({ name }: { name: string }) => {
  // Utiliser un mapping d'icônes plus simple
  const iconMap: Record<string, React.ReactNode> = {
    'wifi': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r=".5"/></svg>,
    'tv': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>,
    'play-circle': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>,
    'router': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6.01 18H6"/><path d="M10.01 18H10"/><path d="M15 10v4"/><path d="M17.84 7.17a4 4 0 0 0-5.66 0"/><path d="M20.66 4.34a8 8 0 0 0-11.31 0"/></svg>,
    'gate': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M3 7v14"/><path d="M21 7v14"/><path d="M4 7h16"/><path d="M8 7v14"/><path d="M16 7v14"/><path d="M12 3v4"/><path d="M12 17v4"/></svg>,
    'wifi-off': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="2" y1="2" x2="22" y2="22"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M2 8.82a15 15 0 0 1 4.17-2.65"/><path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76"/><path d="M16.85 11.25a10 10 0 0 1 2.22 1.68"/><path d="M5 13a10 10 0 0 1 5.24-2.76"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>,
    'bed': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4v16"/><path d="M22 4v16"/><path d="M2 8h20"/><path d="M2 16h20"/><path d="M6 8v8"/><path d="M18 8v8"/></svg>,
    'bath': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" y1="5" x2="8" y2="7"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="7" y1="19" x2="7" y2="21"/><line x1="17" y1="19" x2="17" y2="21"/></svg>,
    'kitchen': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 15V3h-8v12"/><path d="M19 8h-8"/><path d="M3 15h16v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2z"/><path d="M3 10h4"/><path d="M3 6h4"/></svg>,
    'oven': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><rect x="6" y="8" width="12" height="8" rx="1"/><path d="M15 2v2"/><path d="M9 2v2"/><path d="M9 18v2"/><path d="M15 18v2"/></svg>,
    'utensils': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>,
    'coffee': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>,
    'washing-machine': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/><path d="M12 6v2"/><path d="M16 12h2"/><path d="M12 18v-2"/><path d="M8 12H6"/></svg>,
    'air-conditioning': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 7.5V7a2.5 2.5 0 0 1 5 0v.5"/><path d="M5 8h14"/><path d="M4 17h16"/><path d="M6 11h.01"/><path d="M6 14h.01"/><path d="M12 11v6"/><path d="M18 11h.01"/><path d="M18 14h.01"/><path d="M7 21h10"/><path d="M7 3h10"/></svg>,
    'palm-tree': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4"/><path d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3"/><path d="M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7 2.12-2.12 1.41-1.42"/><path d="M13 11.5l1.41-1.41 2.12-2.12.7-.7 4.24-4.25c1.95 1.96 1.8 5.28-.35 7.43"/><path d="M14 22l-4-4"/><path d="M10 18l-2.83-2.83"/><path d="M13.04 10.13l4.01 5.02"/><path d="M17.05 15.15l2.67 3.35"/><path d="M10.93 13.12l4.37 5.47"/><path d="M15.3 18.59l1.4 1.76"/></svg>,
    'umbrella': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 12a6 6 0 0 0-12 0Z"/><path d="M12 12v8a2 2 0 0 0 4 0"/><path d="M12 2v1"/></svg>,
    'garage': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M3 7v14"/><path d="M21 7v14"/><path d="m4 7 8-4 8 4"/><path d="M4 7h16"/><path d="M8 21v-4h8v4"/></svg>,
    'parking': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h4a2 2 0 0 1 2 2v4"/><path d="M9 15v-6"/></svg>,
    'tool': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
    'ac': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18"/><path d="M4 12h16"/><path d="M7 7l10 10"/><path d="M17 7 7 17"/></svg>,
    'pool': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20"/><path d="M2 20h20"/><path d="M2 4h20"/><path d="M12 4v16"/></svg>,
    'default': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
  };
  
  return (
    <div className="w-6 h-6 text-black">
      {iconMap[name] || iconMap['default']}
    </div>
  );
}; 
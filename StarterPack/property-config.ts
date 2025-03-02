// lib/config/property-config.ts

import { Amenity, Location, PricingType, TestimonialType } from '@/types/property';

export type PropertyConfig = {
  // Informations de base
  id: string;
  slug: string;
  name: string;
  themeClass: string;
  tagline: string;
  description: string;
  metaDescription: string;
  
  // Contact et réservation
  email: string;
  phone: string;
  bookingUrl?: string;
  externalBookingPlatforms?: {
    airbnb?: string;
    bookingCom?: string;
    vrbo?: string;
  };
  
  // Caractéristiques principales
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  
  // Médias
  heroImage: string;
  logo?: string;
  gallery: {
    id: string;
    url: string;
    alt: string;
    category: 'exterior' | 'interior' | 'bedroom' | 'kitchen' | 'bathroom' | 'outdoor' | 'other';
    featured?: boolean;
  }[];
  
  // Localisation
  location: Location;
  nearbyAttractions: {
    name: string;
    description?: string;
    distance: string;
    travelTime?: string;
    category: 'beach' | 'restaurant' | 'shopping' | 'attraction' | 'transport' | 'essential';
    url?: string;
  }[];
  
  // Commodités
  amenities: Amenity[];
  
  // Tarifs
  pricing: {
    type: PricingType;
    basePrice: number;
    currency: string;
    cleaningFee?: number;
    serviceFee?: number;
    minimumStay: number;
    seasonalRates?: {
      name: string;
      startDate: string;
      endDate: string;
      priceMultiplier: number;
    }[];
  };
  
  // Témoignages
  testimonials?: TestimonialType[];
  
  // Contenu
  sections: {
    hero: {
      enabled: boolean;
      title?: string;
      subtitle?: string;
      backgroundOpacity?: number;
    };
    intro: {
      enabled: boolean;
      title?: string;
      content?: string;
    };
    gallery: {
      enabled: boolean;
      title?: string;
      subtitle?: string;
    };
    amenities: {
      enabled: boolean;
      title?: string;
      subtitle?: string;
    };
    location: {
      enabled: boolean;
      title?: string;
      subtitle?: string;
      showNearbyAttractions: boolean;
    };
    pricing: {
      enabled: boolean;
      title?: string;
      subtitle?: string;
    };
    testimonials: {
      enabled: boolean;
      title?: string;
      subtitle?: string;
    };
    contact: {
      enabled: boolean;
      title?: string;
      subtitle?: string;
      formEnabled: boolean;
    };
  };
  
  // SEO et partage sur les réseaux sociaux
  socialSharing: {
    image: string;
    title?: string;
    description?: string;
  };
};

// Configuration pour Stella Lodge Tahiti
export const stellaLodgeConfig: PropertyConfig = {
  id: 'stella-lodge-tahiti',
  slug: 'stella-lodge-tahiti',
  name: 'Stella Lodge Tahiti',
  themeClass: 'theme-monochrome',
  tagline: 'Your peaceful retreat in the heart of Tahiti',
  description: 'Stella Lodge Tahiti is a cozy vacation rental offering a peaceful atmosphere and homely amenities, perfect for travelers seeking an authentic Tahitian experience.',
  metaDescription: 'Book your stay at Stella Lodge Tahiti, a cozy vacation rental with peaceful atmosphere and homely amenities for an authentic Tahitian experience.',
  
  email: 'contact@stellalodgetahiti.com',
  phone: '+689 87 123 456',
  
  maxGuests: 6,
  bedrooms: 2,
  beds: 3,
  bathrooms: 2,
  
  heroImage: '/images/stella-lodge/hero.jpg',
  logo: '/images/stella-lodge/logo.png',
  gallery: [
    {
      id: 'exterior-1',
      url: '/images/stella-lodge/exterior-1.jpg',
      alt: 'Front view of Stella Lodge with tropical garden',
      category: 'exterior',
      featured: true
    },
    {
      id: 'living-room-1',
      url: '/images/stella-lodge/living-room-1.jpg',
      alt: 'Bright living room with ocean view',
      category: 'interior',
      featured: true
    },
    // Additional gallery images would be added here
  ],
  
  location: {
    address: '123 Coastal Road, Punaauia',
    city: 'Punaauia',
    region: 'Tahiti',
    country: 'French Polynesia',
    postalCode: '98718',
    latitude: -17.585394,
    longitude: -149.614684,
    mapZoom: 15
  },
  
  nearbyAttractions: [
    {
      name: 'Plage publique PK18',
      description: 'Beautiful white sand beach with calm waters',
      distance: '0.3 km',
      travelTime: '5 min walk',
      category: 'beach'
    },
    {
      name: 'Tahiti Pearl Market',
      description: 'Famous market for local black pearls',
      distance: '5 km',
      travelTime: '10 min drive',
      category: 'shopping'
    },
    // More attractions would be added here
  ],
  
  amenities: [
    {
      id: 'wifi',
      name: 'Free Wi-Fi',
      category: 'general',
      icon: 'wifi'
    },
    {
      id: 'aircon',
      name: 'Air Conditioning',
      category: 'general',
      icon: 'snowflake'
    },
    {
      id: 'kitchen',
      name: 'Full Kitchen',
      category: 'kitchen',
      icon: 'utensils'
    },
    // More amenities would be added here
  ],
  
  pricing: {
    type: 'nightly',
    basePrice: 150,
    currency: 'USD',
    cleaningFee: 50,
    serviceFee: 25,
    minimumStay: 3,
    seasonalRates: [
      {
        name: 'High Season',
        startDate: '2023-05-01',
        endDate: '2023-10-31',
        priceMultiplier: 1.25
      },
      {
        name: 'Holiday Season',
        startDate: '2023-12-15',
        endDate: '2024-01-10',
        priceMultiplier: 1.5
      }
    ]
  },
  
  testimonials: [
    {
      id: '1',
      name: 'Sophie and Mark',
      location: 'Paris, France',
      date: '2023-09-15',
      rating: 5,
      comment: 'Stella Lodge exceeded our expectations. The house was spotless, comfortable, and had everything we needed. The location is perfect - quiet but close to everything. We especially loved the morning views from the terrace!'
    },
    {
      id: '2',
      name: 'John D.',
      location: 'Sydney, Australia',
      date: '2023-08-01',
      rating: 5,
      comment: 'We had an amazing week at Stella Lodge. The house is exactly as pictured, with a homely atmosphere that made us feel welcome instantly. Great base for exploring Tahiti!'
    }
  ],
  
  sections: {
    hero: {
      enabled: true,
      title: 'Your Peaceful Retreat in Paradise',
      subtitle: 'Experience the authentic beauty of Tahiti in our cozy lodge'
    },
    intro: {
      enabled: true,
      title: 'Welcome to Stella Lodge',
      content: 'Nestled in a quiet neighborhood with stunning ocean views, Stella Lodge offers a perfect blend of comfort and tranquility for your Tahitian getaway. Our 2-bedroom house comfortably accommodates up to 6 guests and provides all the amenities you need for a memorable stay.'
    },
    gallery: {
      enabled: true,
      title: 'Explore Our Property',
      subtitle: 'Take a visual tour of our cozy lodge and its surroundings'
    },
    amenities: {
      enabled: true,
      title: 'Amenities & Features',
      subtitle: 'Everything you need for a comfortable stay'
    },
    location: {
      enabled: true,
      title: 'Location',
      subtitle: 'Perfectly situated to explore the best of Tahiti',
      showNearbyAttractions: true
    },
    pricing: {
      enabled: true,
      title: 'Rates & Availability',
      subtitle: 'Affordable luxury for your Tahitian holiday'
    },
    testimonials: {
      enabled: true,
      title: 'Guest Experiences',
      subtitle: 'What our previous guests have to say'
    },
    contact: {
      enabled: true,
      title: 'Contact Us',
      subtitle: 'Have questions? We\'re here to help',
      formEnabled: true
    }
  },
  
  socialSharing: {
    image: '/images/stella-lodge/social-share.jpg',
    title: 'Book Your Stay at Stella Lodge Tahiti - Peaceful Ocean View Retreat',
    description: 'Enjoy an authentic Tahitian experience in our cozy 2-bedroom lodge with stunning ocean views, just steps from the beach.'
  }
};

// Fonction utilitaire pour créer une nouvelle configuration basée sur un template existant
export function createPropertyConfig(
  baseConfig: PropertyConfig, 
  overrides: Partial<PropertyConfig>
): PropertyConfig {
  return {
    ...baseConfig,
    ...overrides,
  };
}

// Configuration par défaut pour le site
export const defaultPropertyConfig = stellaLodgeConfig;

// Exportation des configurations pour chaque propriété
export const propertyConfigs: Record<string, PropertyConfig> = {
  'stella-lodge-tahiti': stellaLodgeConfig,
  // Ajoutez d'autres propriétés ici au fur et à mesure
};

// Fonction utilitaire pour obtenir la configuration d'une propriété spécifique
export function getPropertyConfig(propertySlug: string): PropertyConfig {
  return propertyConfigs[propertySlug] || defaultPropertyConfig;
}

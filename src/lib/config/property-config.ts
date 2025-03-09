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
  tagline: 'Votre retraite paisible au cœur de Tahiti',
  description: 'Stella Lodge Tahiti est une location de vacances confortable offrant une atmosphère paisible et des équipements chaleureux, parfaite pour les voyageurs à la recherche d\'une expérience tahitienne authentique.',
  metaDescription: 'Réservez votre séjour à Stella Lodge Tahiti, une location de vacances confortable avec une atmosphère paisible et des équipements chaleureux pour une expérience tahitienne authentique.',
  
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
      alt: 'Vue avant de Stella Lodge avec jardin tropical',
      category: 'exterior',
      featured: true
    },
    {
      id: 'living-room-1',
      url: '/images/stella-lodge/living-room-1.jpg',
      alt: 'Salon lumineux avec vue sur l\'océan',
      category: 'interior',
      featured: true
    },
    {
      id: 'bedroom-1',
      url: '/images/stella-lodge/bedroom-1.jpg',
      alt: 'Chambre principale avec lit king-size',
      category: 'bedroom',
      featured: false
    },
    {
      id: 'kitchen-1',
      url: '/images/stella-lodge/kitchen-1.jpg',
      alt: 'Cuisine entièrement équipée',
      category: 'kitchen',
      featured: false
    },
    {
      id: 'bathroom-1',
      url: '/images/stella-lodge/bathroom-1.jpg',
      alt: 'Salle de bain moderne avec douche à l\'italienne',
      category: 'bathroom',
      featured: false
    },
    {
      id: 'terrace-1',
      url: '/images/stella-lodge/terrace-1.jpg',
      alt: 'Terrasse avec vue panoramique',
      category: 'outdoor',
      featured: true
    }
  ],
  
  location: {
    address: 'FCFR+353 Papeete',
    city: 'Papeete',
    region: 'Tahiti',
    country: 'Polynésie française',
    postalCode: '98714',
    latitude: -17.527361,
    longitude: -149.559583,
    mapZoom: 15
  },
  
  nearbyAttractions: [
    {
      name: 'Plage publique PK18',
      description: 'Belle plage de sable blanc avec des eaux calmes',
      distance: '0.3 km',
      travelTime: '5 min à pied',
      category: 'beach'
    },
    {
      name: 'Marché de Perles de Tahiti',
      description: 'Marché célèbre pour les perles noires locales',
      distance: '5 km',
      travelTime: '10 min en voiture',
      category: 'shopping'
    },
    {
      name: 'Restaurant Le Lotus',
      description: 'Restaurant gastronomique avec vue sur le lagon',
      distance: '2 km',
      travelTime: '5 min en voiture',
      category: 'restaurant'
    },
    {
      name: 'Musée de Tahiti et ses Îles',
      description: 'Découvrez l\'histoire et la culture polynésienne',
      distance: '8 km',
      travelTime: '15 min en voiture',
      category: 'attraction'
    },
    {
      name: 'Supermarché Carrefour',
      description: 'Grand supermarché pour tous vos besoins',
      distance: '3 km',
      travelTime: '7 min en voiture',
      category: 'essential'
    }
  ],
  
  amenities: [
    {
      id: 'wifi',
      name: 'Wi-Fi Gratuit',
      category: 'general',
      icon: 'wifi'
    },
    {
      id: 'aircon',
      name: 'Climatisation',
      category: 'general',
      icon: 'snowflake'
    },
    {
      id: 'kitchen',
      name: 'Cuisine Complète',
      category: 'kitchen',
      icon: 'utensils'
    },
    {
      id: 'pool',
      name: 'Piscine Privée',
      category: 'outdoor',
      icon: 'swimming-pool'
    },
    {
      id: 'parking',
      name: 'Parking Gratuit',
      category: 'general',
      icon: 'parking'
    },
    {
      id: 'tv',
      name: 'TV à Écran Plat',
      category: 'general',
      icon: 'tv'
    },
    {
      id: 'washer',
      name: 'Lave-linge',
      category: 'general',
      icon: 'washing-machine'
    },
    {
      id: 'beach-access',
      name: 'Accès Plage',
      category: 'outdoor',
      icon: 'umbrella-beach'
    },
    {
      id: 'bbq',
      name: 'Barbecue',
      category: 'outdoor',
      icon: 'fire'
    },
    {
      id: 'king-bed',
      name: 'Lit King-Size',
      category: 'bedroom',
      icon: 'bed'
    }
  ],
  
  pricing: {
    type: 'nightly',
    basePrice: 150,
    currency: 'EUR',
    cleaningFee: 50,
    serviceFee: 25,
    minimumStay: 3,
    seasonalRates: [
      {
        name: 'Haute Saison',
        startDate: '2024-05-01',
        endDate: '2024-10-31',
        priceMultiplier: 1.25
      },
      {
        name: 'Saison des Fêtes',
        startDate: '2024-12-15',
        endDate: '2025-01-10',
        priceMultiplier: 1.5
      }
    ]
  },
  
  testimonials: [
    {
      id: '1',
      name: 'Sophie et Marc',
      location: 'Paris, France',
      date: '2023-09-15',
      rating: 5,
      comment: 'Stella Lodge a dépassé nos attentes. La maison était impeccable, confortable et avait tout ce dont nous avions besoin. L\'emplacement est parfait - calme mais proche de tout. Nous avons particulièrement aimé les vues matinales depuis la terrasse!'
    },
    {
      id: '2',
      name: 'John et Lisa',
      location: 'Sydney, Australie',
      date: '2023-08-02',
      rating: 4,
      comment: 'Un endroit merveilleux pour se détendre. La piscine privée était fantastique et la plage à proximité était magnifique. Seul petit bémol: le WiFi était un peu lent, mais cela nous a permis de vraiment nous déconnecter!'
    },
    {
      id: '3',
      name: 'Famille Dupont',
      location: 'Montréal, Canada',
      date: '2023-07-10',
      rating: 5,
      comment: 'Parfait pour notre famille de 5 personnes. Les enfants ont adoré la piscine et la proximité de la plage. La cuisine était bien équipée et nous avons apprécié de pouvoir préparer nos propres repas. Nous reviendrons certainement!'
    }
  ],
  
  sections: {
    hero: {
      enabled: true,
      title: 'Stella Lodge Tahiti',
      subtitle: 'Votre retraite paisible au cœur de Tahiti',
      backgroundOpacity: 0.4
    },
    intro: {
      enabled: true,
      title: 'Bienvenue à Stella Lodge',
      content: 'Nichée dans un cadre tropical luxuriant, Stella Lodge offre une expérience de séjour authentique à Tahiti. Notre propriété combine le confort moderne avec le charme polynésien traditionnel, créant un havre de paix parfait pour votre escapade.'
    },
    gallery: {
      enabled: true,
      title: 'Découvrez Notre Propriété',
      subtitle: 'Un aperçu de votre prochain séjour paradisiaque'
    },
    amenities: {
      enabled: true,
      title: 'Équipements & Caractéristiques',
      subtitle: 'Tout ce dont vous avez besoin pour un séjour confortable'
    },
    location: {
      enabled: true,
      title: 'Emplacement',
      subtitle: 'Idéalement situé à Punaauia, à proximité des plages et des attractions',
      showNearbyAttractions: true
    },
    pricing: {
      enabled: true,
      title: 'Tarifs & Disponibilités',
      subtitle: 'Des tarifs compétitifs pour une expérience inoubliable'
    },
    testimonials: {
      enabled: true,
      title: 'Expériences de nos Clients',
      subtitle: 'Ce que disent nos invités précédents'
    },
    contact: {
      enabled: true,
      title: 'Contactez-Nous',
      subtitle: 'Des questions? Nous sommes là pour vous aider',
      formEnabled: true
    }
  },
  
  socialSharing: {
    image: '/images/stella-lodge/social-share.jpg',
    title: 'Stella Lodge Tahiti - Votre retraite paisible en Polynésie',
    description: 'Réservez votre séjour dans notre villa confortable avec piscine privée et accès à la plage à Tahiti.'
  }
};

// Fonction pour obtenir la configuration de la propriété
export function getPropertyConfig(slug: string): PropertyConfig {
  // Pour l'instant, nous n'avons qu'une seule propriété
  if (slug === 'stella-lodge-tahiti') {
    return stellaLodgeConfig;
  }
  
  // Par défaut, retourner Stella Lodge
  return stellaLodgeConfig;
} 
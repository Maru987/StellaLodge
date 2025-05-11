import { Property } from '@/types/property';

// Configuration de la propriété avec des données d'exemple
export const propertyData: Property = {
  id: 'stella-lodge-tahiti',
  name: 'Stella Lodge Tahiti',
  tagline: 'Un Lodge chaleureux au cœur de Tahiti',
  description: 'Bienvenue dans notre maison simple et confortable, idéalement située au cœur de Papeete. Notre Fare Tahitien vous offre un havre de paix où règnent tranquillité et sérénité, tout en bénéficiant d\'une localisation privilégiée au centre-ville. Vous apprécierez la proximité immédiate des commerces, restaurants et attractions culturelles, tout en profitant d\'un environnement calme et reposant. Notre équipe vous accueillera chaleureusement et sera à votre disposition pour rendre votre séjour inoubliable. Que vous soyez en voyage d\'affaires ou en quête de découverte de l\'île, Stella Lodge est le point de départ idéal pour toutes vos aventures tahitiennes.',
  heroImage: '/images/Terrasse 2.jpg',
  logo: '/logo.svg',
  
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
  
  amenities: [
    {
      id: 'wifi',
      name: 'Wi-Fi gratuit',
      description: 'Connexion haut débit dans tout l\'établissement',
      category: 'general',
      icon: 'wifi',
      featured: true
    },
    {
      id: 'pool',
      name: 'Piscine à débordement',
      description: 'Vue panoramique sur l\'océan',
      category: 'outdoor',
      icon: 'pool',
      featured: true
    },
    {
      id: 'ac',
      name: 'Climatisation',
      description: 'Contrôle individuel dans chaque chambre',
      category: 'bedroom',
      icon: 'ac',
      featured: true
    },
    {
      id: 'breakfast',
      name: 'Petit-déjeuner tropical',
      description: 'Buffet de fruits frais et spécialités locales',
      category: 'kitchen',
      icon: 'kitchen',
      featured: true
    },
    {
      id: 'parking',
      name: 'Parking gratuit',
      description: 'Sécurisé et surveillé 24/7',
      category: 'general',
      icon: 'parking'
    },
    {
      id: 'tv',
      name: 'TV écran plat',
      description: 'Chaînes internationales et films à la demande',
      category: 'bedroom',
      icon: 'tv'
    }
  ],
  
  gallery: [
    {
      id: 'salon-1',
      url: '/images/Salon.jpg',
      alt: 'Salon spacieux et lumineux',
      category: 'interior',
      featured: true
    },
    {
      id: 'chambre-1',
      url: '/images/Chambre 1.jpg',
      alt: 'Chambre principale avec lit confortable',
      category: 'bedroom',
      featured: true
    },
    {
      id: 'chambre-2',
      url: '/images/Chambre 2.jpg',
      alt: 'Seconde chambre avec vue sur le jardin',
      category: 'bedroom',
      featured: false
    },
    {
      id: 'bathroom-1',
      url: '/images/Bathroom.jpg',
      alt: 'Salle de bain moderne et élégante',
      category: 'bathroom',
      featured: false
    },
    {
      id: 'cuisine-1',
      url: '/images/cuisine-new.jpg',
      alt: 'Cuisine entièrement équipée',
      category: 'kitchen',
      featured: false
    },
    {
      id: 'terrasse-1',
      url: '/images/Terrasse.jpg',
      alt: 'Terrasse avec vue panoramique',
      category: 'outdoor',
      featured: true
    },
    {
      id: 'terrasse-2',
      url: '/images/Terrasse 2.jpg',
      alt: 'Espace extérieur pour se détendre',
      category: 'outdoor',
      featured: true
    }
  ],
  
  pricing: {
    type: 'nightly',
    basePrice: 250,
    currency: 'EUR',
    cleaningFee: 50,
    serviceFee: 30,
    minimumStay: 2,
    seasonalRates: [
      {
        name: 'Haute saison',
        startDate: '2023-06-01',
        endDate: '2023-09-30',
        priceMultiplier: 1.3
      },
      {
        name: 'Saison des fêtes',
        startDate: '2023-12-15',
        endDate: '2024-01-15',
        priceMultiplier: 1.5
      }
    ]
  },
  
  bedrooms: 2,
  bathrooms: 1,
  maxGuests: 6,
  squareMeters: 85,
  
  nearbyAttractions: [
    {
      name: 'Restauration',
      description: 'Restauration à 3 min à pieds',
      distance: '3 min',
      travelTime: 'à pieds',
      category: 'restaurant'
    },
    {
      name: 'Épicerie',
      description: 'Épicerie à 3 min à pieds',
      distance: '3 min',
      travelTime: 'à pieds',
      category: 'essential'
    },
    {
      name: 'Snack Lagon Bleu',
      description: 'Snack Lagon Bleu à 3 min en voiture',
      distance: '3 min',
      travelTime: 'en voiture',
      category: 'restaurant'
    },
    {
      name: 'Super marché Auchan',
      description: 'Super marché Auchan à 3 min en voiture',
      distance: '3 min',
      travelTime: 'en voiture',
      category: 'shopping'
    },
    {
      name: 'Pharmacie',
      description: 'Pharmacie à 3 min en voiture',
      distance: '3 min',
      travelTime: 'en voiture',
      category: 'essential'
    },
    {
      name: 'Cinéma Majestic',
      description: 'Cinéma Majestic à 3 min en voiture',
      distance: '3 min',
      travelTime: 'en voiture',
      category: 'attraction'
    },
    {
      name: 'Centre ville + marché de Papeete + cathédrale',
      description: 'Centre ville + marché de Papeete + cathédrale à 5 min en voiture',
      distance: '5 min',
      travelTime: 'en voiture',
      category: 'attraction'
    },
    {
      name: 'Marché de Pirae',
      description: 'Marché de Pirae à 3 min',
      distance: '3 min',
      travelTime: 'en voiture',
      category: 'shopping'
    },
    {
      name: 'Hôpital',
      description: 'Hôpital à 5 min',
      distance: '5 min',
      travelTime: 'en voiture',
      category: 'essential'
    },
    {
      name: 'Grande surface Carrefour',
      description: 'Grande surface Carrefour à 8 min',
      distance: '8 min',
      travelTime: 'en voiture',
      category: 'shopping'
    },
    {
      name: 'Plages à proximité',
      description: 'Plages à proximité',
      distance: 'à proximité',
      category: 'beach'
    }
  ],
  
  testimonials: [
    {
      id: 'test-1',
      name: 'Sophie et Pierre',
      location: 'France',
      date: '2023-08-15',
      rating: 5,
      comment: 'Un séjour inoubliable dans ce lodge paradisiaque. L\'accueil était chaleureux, la vue à couper le souffle et les prestations impeccables. Nous reviendrons sans hésiter !'
    },
    {
      id: 'test-2',
      name: 'John & Mary',
      location: 'États-Unis',
      date: '2023-07-22',
      rating: 5,
      comment: 'Perfect getaway in paradise. The staff was incredibly helpful and the location is simply stunning. Highly recommended for a romantic escape.'
    }
  ],
  
  sections: {
    hero: {
      enabled: true
    },
    intro: {
      enabled: false,
      title: 'Bienvenue au Stella Lodge',
      subtitle: 'Votre maison confortable au cœur de Papeete'
    },
    gallery: {
      enabled: true,
      title: 'Notre galerie',
      subtitle: 'Découvrez notre lodge en images'
    },
    amenities: {
      enabled: true,
      title: 'Nos équipements',
      subtitle: 'Tout le confort pour un séjour inoubliable'
    },
    location: {
      enabled: true,
      title: 'Notre emplacement',
      subtitle: 'Idéalement situé sur l\'île de Tahiti',
      showNearbyAttractions: true
    },
    pricing: {
      enabled: true,
      title: 'Nos tarifs',
      subtitle: 'Des prix compétitifs pour un séjour d\'exception'
    },
    testimonials: {
      enabled: true,
      title: 'Témoignages',
      subtitle: 'Ce que nos clients disent de nous'
    },
    contact: {
      enabled: true,
      title: 'Contactez-nous',
      subtitle: 'Nous sommes à votre disposition pour toute question',
      formEnabled: true
    }
  },
  
  externalBookingPlatforms: {
    airbnb: 'https://airbnb.com/example',
    bookingCom: 'https://booking.com/example'
  },
  
  socialLinks: {
    facebook: 'https://www.facebook.com/profile.php?id=61571972866642',
    instagram: 'https://instagram.com/stellalodgetahiti'
  },
  
  socialSharing: {
    image: '/images/Salon.jpg',
    title: 'Stella Lodge Tahiti - Votre paradis tropical',
    description: 'Découvrez notre lodge de luxe au cœur de la Polynésie française'
  },
  
  contactEmail: 'contact@stellalodgetahiti.com',
  contactPhone: '+689 87 123 456',
  checkInTime: '14:00',
  checkOutTime: '11:00'
}; 
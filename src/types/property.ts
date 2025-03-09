// types/property.ts

// Type pour la localisation de la propriété
export interface Location {
  address: string;
  city: string;
  region: string;
  country: string;
  postalCode?: string;
  latitude: number;
  longitude: number;
  mapZoom?: number;
}

// Type pour les amenités/équipements
export interface Amenity {
  id: string;
  name: string;
  description?: string;
  category: 'general' | 'bedroom' | 'bathroom' | 'kitchen' | 'outdoor' | 'other';
  icon: string;
  featured?: boolean;
}

// Type pour les témoignages
export interface TestimonialType {
  id: string;
  name: string;
  location?: string;
  date: string;
  rating: number;
  comment: string;
  avatar?: string;
}

// Type pour les tarifs
export type PricingType = 'nightly' | 'weekly' | 'monthly';

// Type pour les images de la galerie
export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  category: 'exterior' | 'interior' | 'bedroom' | 'kitchen' | 'bathroom' | 'outdoor' | 'other';
  featured?: boolean;
}

// Type pour les attractions à proximité
export interface NearbyAttraction {
  name: string;
  description?: string;
  distance: string;
  travelTime?: string;
  category: 'beach' | 'restaurant' | 'shopping' | 'attraction' | 'transport' | 'essential';
  url?: string;
  icon?: string;
}

// Type pour les données de réservation
export interface BookingData {
  checkInDate: Date;
  checkOutDate: Date;
  guests: number;
  nights: number;
  basePrice: number;
  totalPrice: number;
  cleaningFee?: number;
  serviceFee?: number;
  specialRequests?: string;
  name?: string;
  email?: string;
  phone?: string;
}

// Type pour les saisons tarifaires
export interface SeasonalRate {
  name: string;
  startDate: string;
  endDate: string;
  priceMultiplier: number;
}

// Type pour la section de la page
export interface Section {
  enabled: boolean;
  title?: string;
  subtitle?: string;
  [key: string]: any;
}

// Type pour les sections de la landing page
export interface PageSections {
  hero: Section;
  intro: Section;
  gallery: Section;
  amenities: Section;
  location: Section & { showNearbyAttractions: boolean };
  pricing: Section;
  testimonials: Section;
  contact: Section & { formEnabled: boolean };
}

// Type pour les plateformes de réservation externes
export interface ExternalBookingPlatforms {
  airbnb?: string;
  bookingCom?: string;
  vrbo?: string;
  [key: string]: string | undefined;
}

// Type pour les réseaux sociaux
export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  pinterest?: string;
  youtube?: string;
  [key: string]: string | undefined;
}

// Type pour le partage sur les réseaux sociaux
export interface SocialSharing {
  image: string;
  title?: string;
  description?: string;
}

// Type pour la tarification
export interface Pricing {
  type: PricingType;
  basePrice: number;
  currency: string;
  cleaningFee?: number;
  serviceFee?: number;
  minimumStay: number;
  seasonalRates?: SeasonalRate[];
}

// Type principal pour la propriété
export interface Property {
  id: string;
  name: string;
  tagline?: string;
  description: string;
  heroImage: string;
  logo?: string;
  location: Location;
  amenities: Amenity[];
  gallery: GalleryImage[];
  pricing: Pricing;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  squareMeters?: number;
  nearbyAttractions?: NearbyAttraction[];
  testimonials?: TestimonialType[];
  sections: PageSections;
  externalBookingPlatforms?: ExternalBookingPlatforms;
  socialLinks?: SocialLinks;
  socialSharing?: SocialSharing;
  contactEmail: string;
  contactPhone?: string;
  checkInTime?: string;
  checkOutTime?: string;
} 
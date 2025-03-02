// lib/utils/index.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, differenceInDays, addDays, isWithinInterval } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { SeasonalRate } from "@/types/property";

// Utilitaire pour fusionner les classes Tailwind et éviter les conflits
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formater une date selon la locale
export function formatDate(date: Date, formatStr: string = "PP", locale: string = "en") {
  return format(date, formatStr, { locale: locale === "fr" ? fr : enUS });
}

// Calculer le nombre de nuits entre deux dates
export function calculateNights(checkIn: Date, checkOut: Date): number {
  return differenceInDays(checkOut, checkIn);
}

// Générer un tableau de dates entre deux dates
export function generateDateRange(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }

  return dates;
}

// Calculer le prix total du séjour en tenant compte des tarifs saisonniers
export function calculateTotalPrice(
  checkIn: Date,
  checkOut: Date,
  basePrice: number,
  seasonalRates: SeasonalRate[] = [],
  cleaningFee: number = 0,
  serviceFee: number = 0
): {
  nightlyRates: { date: Date; price: number }[];
  subtotal: number;
  cleaningFee: number;
  serviceFee: number;
  total: number;
} {
  const nights = calculateNights(checkIn, checkOut);
  const dateRange = generateDateRange(checkIn, checkOut);
  
  // Calculer le prix pour chaque nuit
  const nightlyRates = dateRange.slice(0, -1).map(date => {
    let price = basePrice;
    
    // Vérifier si cette date tombe dans une période de tarif saisonnier
    for (const rate of seasonalRates) {
      const seasonStart = new Date(rate.startDate);
      const seasonEnd = new Date(rate.endDate);
      
      if (isWithinInterval(date, { start: seasonStart, end: seasonEnd })) {
        price = basePrice * rate.priceMultiplier;
        break;
      }
    }
    
    return { date, price };
  });
  
  // Calculer le sous-total (somme des tarifs de chaque nuit)
  const subtotal = nightlyRates.reduce((sum, { price }) => sum + price, 0);
  
  // Calculer le total
  const total = subtotal + cleaningFee + serviceFee;
  
  return {
    nightlyRates,
    subtotal,
    cleaningFee,
    serviceFee,
    total
  };
}

// Déterminer si une date est disponible (à utiliser avec les données de disponibilité réelles)
export function isDateAvailable(date: Date, bookedDates: { start: Date; end: Date }[]): boolean {
  return !bookedDates.some(booking => 
    isWithinInterval(date, { start: booking.start, end: booking.end })
  );
}

// Convertir une devise
export function formatCurrency(amount: number, currency: string, locale: string = "fr-FR"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
}

// Générer un slug à partir d'une chaîne
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Supprimer les caractères spéciaux
    .replace(/\s+/g, "-") // Remplacer les espaces par des tirets
    .replace(/--+/g, "-") // Remplacer les tirets multiples par un seul
    .trim();
}

// Valider une adresse email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Trouver le tarif applicable pour une date donnée
export function getApplicableRate(
  date: Date,
  basePrice: number,
  seasonalRates: SeasonalRate[] = []
): { price: number; season?: string } {
  for (const rate of seasonalRates) {
    const seasonStart = new Date(rate.startDate);
    const seasonEnd = new Date(rate.endDate);
    
    if (isWithinInterval(date, { start: seasonStart, end: seasonEnd })) {
      return {
        price: basePrice * rate.priceMultiplier,
        season: rate.name
      };
    }
  }
  
  return { price: basePrice };
}

// Tronquer un texte à une longueur maximale
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

// Obtenir l'URL de l'icône pour une catégorie d'amenité
export function getAmenityIcon(iconName: string): string {
  // Cette fonction pourrait être étendue pour utiliser une bibliothèque d'icônes
  return `/icons/${iconName}.svg`;
}

// Extraire l'extension d'un fichier à partir de son URL
export function getFileExtension(url: string): string {
  return url.split(".").pop() || "";
}

// Vérifier si une URL est valide
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
} 
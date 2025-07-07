'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Property } from '@/types/property';
import { Pricing as PricingComponent } from '@/components/blocks/pricing';
import { PublicCalendar } from '@/components/ui/public-calendar';

interface PricingProps {
  property: Property;
  className?: string;
}

export function Pricing({ property, className }: PricingProps) {
  const { pricing } = property;
  
  // Formater le prix avec la devise
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'XPF',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Définir les plans de tarification
  const pricingPlans = [
    {
      name: "NUITÉ",
      price: "15000",
      yearlyPrice: "12000",
      period: "par nuit",
      features: [
        "Accès à toutes les commodités",
        "Support 24/7",
        "Check-in à 14h",
        "Check-out à 11h",
      ],
      description: "Parfait pour des courts séjours",
      buttonText: "Réserver maintenant",
      href: "#contact",
      isPopular: false,
    },
    {
      name: "2 À 5 NUITS",
      price: "13500",
      yearlyPrice: "10800",
      period: "par nuit",
      features: [
        "Accès à toutes les commodités",
        "Support 24/7",
        "Check-in à 14h",
        "Économisez 10% par rapport à la nuitée",
        "Check-out à 11h",
      ],
      description: "Économisez 3 000 XPF pour un séjour de 2 nuits par rapport au tarif journalier (15 000 XPF/nuit)",
      buttonText: "Réserver maintenant",
      href: "#contact",
      isPopular: false,
    },
    {
      name: "LA SEMAINE",
      price: "12000",
      yearlyPrice: "9600",
      period: "par nuit",
      features: [
        "Accès à toutes les commodités",
        "Support 24/7",
        "Check-in à 14h",
        "Économisez 20% par rapport à la nuitée",
        "Check-out à 11h",
      ],
      description: "Économisez 21 000 XPF par semaine par rapport au tarif journalier (15 000 XPF/nuit)",
      buttonText: "Réserver maintenant",
      href: "#contact",
      isPopular: true,
    },
    {
      name: "AU MOIS",
      price: "Sur demande",
      yearlyPrice: "Sur demande",
      period: "par mois",
      features: [
        "Accès à toutes les commodités",
        "Support 24/7",
        "Check-in à 14h",
        "Tarifs négociables selon durée",
        "Check-out à 11h",
        "Contact direct pour réservation",
      ],
      description: "Pour des séjours prolongés, contactez-nous directement pour discuter des tarifs et conditions",
      buttonText: "Nous contacter",
      href: "#contact",
      isPopular: false,
    }
  ];

  return (
    <section 
      id="pricing" 
      className={cn(
        'py-10 md:py-16 bg-white',
        className
      )}
    >
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-primary">
            Nos tarifs
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Choisissez la durée qui vous convient le mieux. Tous nos tarifs incluent l'accès à toutes les commodités.
          </p>
        </motion.div>

        <PricingComponent 
          plans={pricingPlans}
          title=""
          description=""
        />

        {/* Calendrier des disponibilités */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-heading font-bold mb-4 text-primary">
              Calendrier des disponibilités
            </h3>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Consultez notre calendrier pour voir les dates déjà réservées et planifier votre séjour en conséquence.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <PublicCalendar />
          </div>
        </motion.div>
      </div>
    </section>
  );
} 
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Property } from '@/types/property';
import { Pricing as PricingComponent } from '@/components/blocks/pricing';

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
      name: "JOURNALIER",
      price: "13500",
      yearlyPrice: "10800",
      period: "par nuit",
      features: [
        "Accès à toutes les commodités",
        "Support 24/7",
        "Check-in flexible",
      ],
      description: "Parfait pour des courts séjours",
      buttonText: "Réserver maintenant",
      href: "#contact",
      isPopular: false,
    },
    {
      name: "HEBDOMADAIRE",
      price: "10000",
      yearlyPrice: "8000",
      period: "par nuit",
      features: [
        "Tous les avantages du plan journalier",
        "Tarif préférentiel (-26%)",
        "Service de ménage inclus",
      ],
      description: "Économisez 24 500 XPF par semaine par rapport au tarif journalier (13 500 XPF/nuit)",
      buttonText: "Réserver maintenant",
      href: "#contact",
      isPopular: true,
    },
    {
      name: "MENSUEL",
      price: "7000",
      yearlyPrice: "5600",
      period: "par nuit",
      features: [
        "Tous les avantages du plan journalier",
        "Tarif préférentiel (-48%)",
        "Services de ménage hebdomadaire",
        "Accès prioritaire aux réservations",
      ],
      description: `Économisez 195 000 XPF par mois par rapport au tarif journalier (13 500 XPF/nuit)`,
      buttonText: "Réserver maintenant",
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
      </div>
    </section>
  );
} 
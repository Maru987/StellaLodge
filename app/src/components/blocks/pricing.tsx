"use client";

import { buttonVariants } from "@/components/ui/button";
import { useMediaQuery } from "@/components/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Star, Info, Clock, Calendar, CalendarIcon } from "lucide-react";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import NumberFlow from "@number-flow/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { saveReservation, Reservation } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";

// Fonction pour faire défiler la page vers une section
const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

interface PricingPlan {
  name: string;
  price: string;
  yearlyPrice: string;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  href: string;
  isPopular: boolean;
}

interface PricingProps {
  plans: PricingPlan[];
  title?: string;
  description?: string;
}

export function Pricing({
  plans,
  title = "Simple, Transparent Pricing",
  description = "Choisissez la durée qui vous convient le mieux. Tous nos tarifs incluent l'accès à toutes les commodités.",
}: PricingProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '',
    message: ''
  });
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);

  // Fonction pour valider les dates en fonction du forfait
  const validateDateRange = (range: DateRange | undefined): boolean => {
    if (!range || !range.from || !range.to || !selectedPlan) return false;
    
    const from = new Date(range.from);
    const to = new Date(range.to);
    
    // Calculer la différence en jours
    const diffTime = Math.abs(to.getTime() - from.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Validation selon le forfait
    switch (selectedPlan.name) {
      case "JOURNALIER":
        // Pour le forfait journalier, on peut réserver une seule nuit
        if (diffDays !== 1) {
          setDateError("Le forfait journalier permet de réserver une seule nuit.");
          return false;
        }
        // Vérifier que la date de départ est le lendemain de la date d'arrivée
        const nextDay = new Date(from);
        nextDay.setDate(nextDay.getDate() + 1);
        if (to.getTime() !== nextDay.getTime()) {
          setDateError("Pour le forfait journalier, la date de départ doit être le lendemain de la date d'arrivée.");
          return false;
        }
        break;
      case "2 NUITS":
        // Pour le forfait 2 nuits, on peut réserver entre 2 et 6 nuits
        if (diffDays < 2 || diffDays > 6) {
          setDateError("Le forfait 2 nuits permet de réserver entre 2 et 6 nuits.");
          return false;
        }
        break;
      case "HEBDOMADAIRE":
        // Pour le forfait hebdomadaire, on peut réserver 7 nuits ou plus
        if (diffDays < 7) {
          setDateError("Le forfait hebdomadaire permet de réserver 7 nuits ou plus.");
          return false;
        }
        break;
      default:
        return true;
    }
    
    setDateError(null);
    return true;
  };

  // Fonction pour gérer la sélection de dates
  const handleDateSelect = (range: DateRange | undefined) => {
    if (!range || !range.from || !selectedPlan) {
      setDateRange(range);
      setDateError(null);
      return;
    }

    // Si l'utilisateur clique sur la même date que la sélection actuelle, on réinitialise
    if (dateRange && dateRange.from && range.from.getTime() === dateRange.from.getTime()) {
      setDateRange(undefined);
      setDateError(null);
      return;
    }

    let nights = 1;
    if (selectedPlan.name === "2 NUITS") nights = 2;
    if (selectedPlan.name === "HEBDOMADAIRE") nights = 7;

    const from = new Date(range.from);
    const to = new Date(from);
    to.setDate(from.getDate() + nights);
    setDateRange({ from, to });
    validateDateRange({ from, to });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Validation du plan sélectionné
    if (!selectedPlan) {
      setSubmitError("Veuillez sélectionner un plan");
      return;
    }
    
    // Validation des dates
    if (!dateRange?.from || !dateRange?.to) {
      setSubmitError("Veuillez sélectionner les dates de séjour");
      return;
    }

    // Validation des dates selon le forfait
    const from = new Date(dateRange.from);
    const to = new Date(dateRange.to);
    const diffTime = Math.abs(to.getTime() - from.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    switch (selectedPlan.name) {
      case "JOURNALIER":
        if (diffDays !== 1) {
          setSubmitError("Le forfait journalier permet de réserver une seule nuit");
          return;
        }
        break;
      case "2 NUITS":
        if (diffDays < 2 || diffDays > 6) {
          setSubmitError("Le forfait 2 nuits permet de réserver entre 2 et 6 nuits");
          return;
        }
        break;
      case "HEBDOMADAIRE":
        if (diffDays < 7) {
          setSubmitError("Le forfait hebdomadaire permet de réserver 7 nuits ou plus");
          return;
        }
        break;
    }
    
    // Validation des champs obligatoires
    if (!formData.name || !formData.email || !formData.phone || !formData.guests) {
      setSubmitError("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Préparation des dates au format ISO
      const checkInDate = format(dateRange.from, 'yyyy-MM-dd');
      const checkOutDate = format(dateRange.to, 'yyyy-MM-dd');
      
      // Préparation des données pour Supabase
      const reservationData: Reservation = {
        plan_name: selectedPlan.name,
        price: parseFloat(selectedPlan.price.replace(/\s/g, '')),
        period: selectedPlan.period,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        check_in: checkInDate,
        check_out: checkOutDate,
        guests: parseInt(formData.guests, 10),
        message: formData.message,
        status: 'pending'
      };
      
      // Envoi des données à Supabase
      const result = await saveReservation(reservationData);
      
      if (result.success) {
        setSubmitSuccess(true);
        // Réinitialisation du formulaire
        setFormData({
          name: '',
          email: '',
          phone: '',
          guests: '',
          message: ''
        });
        setDateRange(undefined);
        
        // Fermeture du dialogue après 2 secondes
        setTimeout(() => {
          setOpen(false);
          setSubmitSuccess(false);
        }, 2000);
      } else {
        setSubmitError("Une erreur est survenue lors de l'enregistrement de votre réservation. Veuillez réessayer.");
      }
    } catch (error) {
      setSubmitError("Une erreur inattendue est survenue. Veuillez réessayer plus tard.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openReservationDialog = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setOpen(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    setDateRange(undefined);
    setDateError(null);
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      guests: '',
      message: ''
    });
  };

  // Fonction pour suggérer une plage de dates valide en fonction du forfait
  const suggestDateRange = () => {
    if (!selectedPlan) return;
    
    // Nous ne suggérons plus de dates automatiquement
    // L'utilisateur choisira lui-même ses dates
  };

  // Ajouter un effet pour suggérer des dates lorsque le forfait change
  useEffect(() => {
    // Nous ne suggérons plus de dates automatiquement
    // Nous laissons simplement le champ vide pour que l'utilisateur puisse choisir
  }, [selectedPlan, open]);

  return (
    <div className="container py-8">
      <div className="text-center space-y-2 mb-6">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold tracking-tight text-black sm:text-5xl"
        >
          {title}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-gray-700 text-lg whitespace-pre-line"
        >
          {description}
        </motion.p>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px] max-w-[95vw] p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-bold text-center">
              {selectedPlan && (
                <span className="block text-blue-600 mb-1 text-base sm:text-lg">
                  {selectedPlan.name} - {Number(selectedPlan.price).toLocaleString('fr-FR')} XPF {selectedPlan.period}
                </span>
              )}
              Demande de réservation
            </DialogTitle>
            <DialogDescription className="text-center text-sm">
              Remplissez ce formulaire pour effectuer une demande de réservation.
            </DialogDescription>
          </DialogHeader>
          
          {submitSuccess ? (
            <div className="p-4 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Réservation envoyée avec succès!</h3>
              <p className="text-gray-600 text-sm">Nous vous contacterons bientôt pour confirmer votre réservation.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 mt-2">
              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-xs sm:text-sm">
                  {submitError}
                  <div className="mt-1 text-xs font-medium">
                    Solutions possibles:
                    <ol className="list-decimal pl-4 mt-1 space-y-1">
                      <li>Vérifiez que la variable d'environnement <code className="bg-red-100 px-1">SUPABASE_SERVICE_ROLE_KEY</code> est configurée</li>
                      <li>Ou créez une politique RLS qui permet les insertions publiques</li>
                    </ol>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-sm">Nom complet</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="Votre nom" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    className="h-9 text-sm"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-sm">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="votre@email.com" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    className="h-9 text-sm"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="phone" className="text-sm">Téléphone</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    placeholder="Votre numéro de téléphone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    required 
                    className="h-9 text-sm"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="dateRange" className="text-sm">Dates du séjour</Label>
                  <DatePickerWithRange
                    date={dateRange}
                    onSelect={handleDateSelect}
                  />
                  {dateError && (
                    <div className="flex flex-col space-y-2">
                      <p className="text-xs text-red-600 mt-1">{dateError}</p>
                      <button 
                        type="button" 
                        onClick={suggestDateRange}
                        className="text-xs text-blue-600 underline self-start"
                      >
                        Suggérer des dates valides
                      </button>
                    </div>
                  )}
                  {selectedPlan && !dateError && (
                    <p className="text-xs text-blue-600 mt-1">
                      {selectedPlan.name === "JOURNALIER" && "Sélectionnez 1 nuit"}
                      {selectedPlan.name === "2 NUITS" && "Sélectionnez entre 2 et 6 nuits"}
                      {selectedPlan.name === "HEBDOMADAIRE" && "Sélectionnez entre 7 et 29 nuits"}
                      {selectedPlan.name === "MENSUEL" && "Sélectionnez 30 nuits ou plus"}
                    </p>
                  )}
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="guests" className="text-sm">Nombre de personnes</Label>
                  <Input 
                    id="guests" 
                    name="guests" 
                    type="number" 
                    min="1" 
                    placeholder="Nombre de voyageurs" 
                    value={formData.guests} 
                    onChange={handleChange} 
                    required 
                    className="h-9 text-sm"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="message" className="text-sm">Autre chose à savoir ?</Label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    placeholder="Informations complémentaires..." 
                    value={formData.message} 
                    onChange={handleChange} 
                    className="min-h-[80px] text-sm"
                  />
                </div>
              </div>
              
              <DialogFooter className="mt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 h-9 text-sm"
                  disabled={!dateRange || isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi en cours...
                    </span>
                  ) : "Envoyer ma demande"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 0 }}
            whileInView={{
              y: 0,
              opacity: 1,
              scale: 1,
            }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              type: "spring",
              stiffness: 100,
              damping: 30,
              delay: index * 0.1,
            }}
            className={cn(
              `rounded-2xl border-[1px] p-6 bg-white shadow-md hover:shadow-lg text-center flex flex-col h-full relative transition-all duration-300`,
              plan.isPopular 
                ? "border-blue-600 border-2 z-10 hover:shadow-blue-100" 
                : "border-gray-200 hover:border-blue-200",
              "flex flex-col",
              "mb-6 md:mb-0"
            )}
          >
            {plan.isPopular && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3, type: "spring" }}
                className="absolute -top-3 right-4 bg-blue-600 py-1 px-3 rounded-full flex items-center shadow-md"
              >
                <Star className="text-white h-3 w-3 fill-current mr-1" />
                <span className="text-white text-xs font-sans font-semibold">
                  Populaire
                </span>
              </motion.div>
            )}
            <div className="flex-1 flex flex-col">
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                className="text-xl font-bold text-gray-800 mb-1"
              >
                {plan.name}
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.4, type: "spring" }}
                className="mt-3 mb-3 flex items-center justify-center"
              >
                <span className="text-4xl font-bold tracking-tight text-black flex items-baseline">
                  {Number(plan.price).toLocaleString('fr-FR')}
                  <span className="text-xl ml-1 text-gray-700">XPF</span>
                </span>
                {plan.period !== "Next 3 months" && (
                  <span className="text-sm font-semibold leading-6 tracking-wide text-gray-700 ml-2">
                    / {plan.period}
                  </span>
                )}
              </motion.div>

              <ul className="mt-2 gap-2 flex flex-col">
                {plan.features.map((feature, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 + 0.3 + (index * 0.1), duration: 0.4 }}
                    className="flex items-start gap-2"
                  >
                    <Check className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-left text-gray-800 text-sm">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-auto pt-4">
                <hr className="w-full mb-4 border-gray-200" />

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.5, duration: 0.4 }}
                >
                  <button
                    onClick={() => openReservationDialog(plan)}
                    className={cn(
                      buttonVariants({
                        variant: "outline",
                        size: "lg",
                      }),
                      "w-full py-2 text-base font-semibold",
                      "transform-gpu transition-all duration-300 ease-out hover:ring-2 hover:ring-blue-600 hover:ring-offset-1",
                      plan.isPopular
                        ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                        : "bg-white text-gray-900 border-gray-300 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                    )}
                  >
                    {plan.buttonText}
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Informations supplémentaires */}
      <div className="max-w-5xl mx-auto mt-24 md:mt-10 space-y-6 relative z-20">
        {/* Frais de ménage */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-blue-50 rounded-lg p-5 flex items-start gap-3 shadow-sm"
        >
          <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-blue-800 text-sm">Frais de ménage : 3 500 XPF par séjour</p>
        </motion.div>

        {/* Conditions importantes */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="bg-amber-50 rounded-lg p-5 border border-amber-100 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-5 w-5 text-amber-600" />
            <h3 className="font-semibold text-amber-800">Conditions Importantes</h3>
          </div>
          <ul className="space-y-2 ml-6">
            <li className="flex items-start gap-2">
              <span className="text-amber-800 font-bold">•</span>
              <span className="text-amber-800 text-sm">Dépôt de garantie en fonction du séjour (remboursable à la fin du séjour en l'absence de dégradation ou perte) </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-800 font-bold">•</span>
              <span className="text-amber-800 text-sm">La réservation est confirmée uniquement après réception de l'acompte</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-800 font-bold">•</span>
              <span className="text-amber-800 text-sm">Le logement est strictement non-fumeur</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-800 font-bold">•</span>
              <span className="text-amber-800 text-sm">Les animaux ne sont pas acceptés</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-800 font-bold">•</span>
              <span className="text-amber-800 text-sm">Le logement ne convient pas aux personnes à mobilité réduite</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
} 
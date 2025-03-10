"use client"

import * as React from "react"
import { format, isWithinInterval, isSameDay, isBefore, startOfToday } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useMediaQuery } from "@/components/hooks/use-media-query"
import { fetchConfirmedReservations } from "@/lib/supabase"

interface DatePickerWithRangeProps {
  date: DateRange | undefined
  onSelect: (date: DateRange | undefined) => void
}

export function DatePickerWithRange({
  date,
  onSelect,
}: DatePickerWithRangeProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [reservedDates, setReservedDates] = React.useState<DateRange[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const today = startOfToday();
  
  // Charger les réservations confirmées
  React.useEffect(() => {
    const loadReservations = async () => {
      setIsLoading(true);
      try {
        const result = await fetchConfirmedReservations();
        if (result.success && result.data) {
          setReservedDates(result.data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des réservations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadReservations();
  }, []);
  
  // Fonction pour vérifier si une date est réservée
  const isDateReserved = (date: Date) => {
    return reservedDates.some(range => {
      // Vérifier si la date est dans une plage réservée
      if (range.from && range.to) {
        return isWithinInterval(date, { start: range.from, end: range.to }) ||
               isSameDay(date, range.from) || 
               isSameDay(date, range.to);
      }
      return false;
    });
  };
  
  // Fonction pour personnaliser l'apparence des jours dans le calendrier
  const modifiersStyles = {
    reserved: {
      backgroundColor: 'rgba(239, 68, 68, 0.2)', // Rouge clair
      color: '#b91c1c', // Rouge foncé
      fontWeight: 'bold',
      cursor: 'not-allowed'
    },
    past: {
      textDecoration: 'line-through',
      color: '#4b5563', // Gris foncé
      cursor: 'not-allowed',
      backgroundColor: 'transparent' // Pas de fond coloré
    }
  };
  
  // Fonction pour désactiver les dates réservées et les dates passées
  const disabledDays = [
    // Dates réservées
    ...reservedDates.flatMap(range => {
      if (range.from && range.to) {
        // Créer un tableau de toutes les dates dans la plage
        const days = [];
        let currentDate = new Date(range.from);
        while (currentDate <= range.to) {
          days.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
        return days;
      }
      return [];
    }),
    // Dates passées (avant aujourd'hui)
    { before: today }
  ];
  
  // Dates passées pour le style (séparées des dates réservées)
  const pastDays = { before: today };

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd/MM/yyyy", { locale: fr })} -{" "}
                  {format(date.to, "dd/MM/yyyy", { locale: fr })}
                </>
              ) : (
                format(date.from, "dd/MM/yyyy", { locale: fr })
              )
            ) : (
              <span>Sélectionnez les dates</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0 max-h-[90vh] overflow-y-auto" 
          align="start"
          side="bottom"
          alignOffset={-10}
          sideOffset={8}
          avoidCollisions={true}
          collisionPadding={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {isLoading ? (
            <div className="p-4 flex items-center justify-center">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
              <span className="ml-2">Chargement des disponibilités...</span>
            </div>
          ) : (
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from || today}
              selected={date}
              onSelect={onSelect}
              numberOfMonths={isDesktop ? 2 : 1}
              locale={fr}
              className="max-w-[100vw] md:max-w-none"
              disabled={disabledDays}
              modifiers={{ reserved: disabledDays, past: pastDays }}
              modifiersStyles={modifiersStyles}
              fromDate={today}
            />
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
} 
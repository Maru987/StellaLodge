"use client"

import * as React from "react"
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
} from "date-fns"
import { fr } from "date-fns/locale"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useMediaQuery } from "@/components/hooks/use-media-query"
import { fetchConfirmedReservations } from "@/lib/supabase"

interface PublicCalendarProps {
  className?: string
}

const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
]

export function PublicCalendar({ className }: PublicCalendarProps) {
  const today = startOfToday()
  const [selectedDay, setSelectedDay] = React.useState(today)
  const [currentMonth, setCurrentMonth] = React.useState(
    format(today, "MMM-yyyy"),
  )
  const [reservedDates, setReservedDates] = React.useState<Date[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date())
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  })

  // Charger les réservations confirmées
  React.useEffect(() => {
    const loadReservations = async () => {
      try {
        setIsLoading(true)
        const result = await fetchConfirmedReservations()
        
        if (result.success && result.data) {
          // Créer un tableau de toutes les dates réservées
          const allReservedDates: Date[] = []
          
          result.data.forEach((dateRange: { from: Date; to: Date }) => {
            const start = new Date(dateRange.from)
            const end = new Date(dateRange.to)
            
            // Ajouter toutes les dates entre check-in et check-out (exclus)
            let currentDate = new Date(start)
            while (currentDate < end) {
              allReservedDates.push(new Date(currentDate))
              currentDate.setDate(currentDate.getDate() + 1)
            }
          })
          
          setReservedDates(allReservedDates)
        }
      } catch (error) {
        console.error("Erreur lors du chargement des réservations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadReservations()
  }, [])

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"))
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"))
  }

  function goToToday() {
    setCurrentMonth(format(today, "MMM-yyyy"))
  }

  const handleDaySelect = (day: Date) => {
    setSelectedDay(day)
  }

  // Vérifier si une date est réservée
  const isDateReserved = (date: Date) => {
    return reservedDates.some(reservedDate => 
      isSameDay(reservedDate, date)
    )
  }

  // Obtenir le nombre de réservations pour une date donnée
  const getReservationCount = (date: Date) => {
    return reservedDates.filter(reservedDate => 
      isSameDay(reservedDate, date)
    ).length
  }

  return (
    <div className={cn("flex flex-1 flex-col", className)}>
      {/* Calendar Header */}
      <div className="flex flex-col space-y-4 p-4 md:flex-row md:items-center md:justify-between md:space-y-0 lg:flex-none">
        <div className="flex flex-auto">
          <div className="flex items-center gap-4">
            <div className="hidden w-20 flex-col items-center justify-center rounded-lg border bg-muted p-0.5 md:flex">
              <h1 className="p-1 text-xs uppercase text-muted-foreground">
                {format(today, "MMM", { locale: fr })}
              </h1>
              <div className="flex w-full items-center justify-center rounded-lg border bg-background p-0.5 text-lg font-bold">
                <span>{format(today, "d")}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-foreground">
                {format(firstDayCurrentMonth, "MMMM yyyy", { locale: fr })}
              </h2>
              <p className="text-sm text-muted-foreground">
                {format(firstDayCurrentMonth, "d MMM yyyy", { locale: fr })} -{" "}
                {format(endOfMonth(firstDayCurrentMonth), "d MMM yyyy", { locale: fr })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
          <Separator orientation="vertical" className="hidden h-6 lg:block" />

          <div className="inline-flex w-full -space-x-px rounded-lg shadow-sm shadow-black/5 md:w-auto rtl:space-x-reverse">
            <Button
              onClick={previousMonth}
              className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
              variant="outline"
              size="icon"
              aria-label="Mois précédent"
            >
              <ChevronLeftIcon size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
            <Button
              onClick={goToToday}
              className="w-full rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10 md:w-auto"
              variant="outline"
            >
              Aujourd'hui
            </Button>
            <Button
              onClick={nextMonth}
              className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
              variant="outline"
              size="icon"
              aria-label="Mois suivant"
            >
              <ChevronRightIcon size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
          </div>

          <Separator orientation="vertical" className="hidden h-6 md:block" />
          <Separator
            orientation="horizontal"
            className="block w-full md:hidden"
          />
        </div>
      </div>

      {/* Légende */}
      <div className="px-4 pb-2">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-100 border border-green-300"></div>
            <span className="text-muted-foreground">Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-100 border border-red-300"></div>
            <span className="text-muted-foreground">Réservé</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="lg:flex lg:flex-auto lg:flex-col">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 border text-center text-xs font-semibold leading-6 lg:flex-none">
          <div className="border-r py-2.5">Dim</div>
          <div className="border-r py-2.5">Lun</div>
          <div className="border-r py-2.5">Mar</div>
          <div className="border-r py-2.5">Mer</div>
          <div className="border-r py-2.5">Jeu</div>
          <div className="border-r py-2.5">Ven</div>
          <div className="py-2.5">Sam</div>
        </div>

        {/* Calendar Days */}
        <div className="flex text-xs leading-6 lg:flex-auto">
          <div className="hidden w-full border-x lg:grid lg:grid-cols-7 lg:grid-rows-5">
            {days.map((day, dayIdx) =>
              !isDesktop ? (
                <button
                  onClick={() => handleDaySelect(day)}
                  key={dayIdx}
                  type="button"
                  className={cn(
                    isEqual(day, selectedDay) && "text-primary-foreground",
                    !isEqual(day, selectedDay) &&
                      !isToday(day) &&
                      isSameMonth(day, firstDayCurrentMonth) &&
                      "text-foreground",
                    !isEqual(day, selectedDay) &&
                      !isToday(day) &&
                      !isSameMonth(day, firstDayCurrentMonth) &&
                      "text-muted-foreground",
                    (isEqual(day, selectedDay) || isToday(day)) &&
                      "font-semibold",
                    "flex h-14 flex-col border-b border-r px-3 py-2 hover:bg-muted focus:z-10",
                    // Couleur de fond pour les jours réservés
                    isDateReserved(day) && "bg-red-50",
                  )}
                >
                  <time
                    dateTime={format(day, "yyyy-MM-dd")}
                    className={cn(
                      "ml-auto flex size-6 items-center justify-center rounded-full",
                      isEqual(day, selectedDay) &&
                        isToday(day) &&
                        "bg-primary text-primary-foreground",
                      isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        "bg-primary text-primary-foreground",
                    )}
                  >
                    {format(day, "d")}
                  </time>
                  {isDateReserved(day) && (
                    <div className="-mx-0.5 mt-auto flex flex-wrap-reverse">
                      <span className="mx-0.5 mt-1 h-1.5 w-1.5 rounded-full bg-red-500" />
                    </div>
                  )}
                </button>
              ) : (
                <div
                  key={dayIdx}
                  onClick={() => handleDaySelect(day)}
                  className={cn(
                    dayIdx === 0 && colStartClasses[getDay(day)],
                    !isEqual(day, selectedDay) &&
                      !isToday(day) &&
                      !isSameMonth(day, firstDayCurrentMonth) &&
                      "bg-accent/50 text-muted-foreground",
                    "relative flex flex-col border-b border-r hover:bg-muted focus:z-10 cursor-pointer",
                    !isEqual(day, selectedDay) && "hover:bg-accent/75",
                    // Couleur de fond pour les jours réservés
                    isDateReserved(day) && "bg-red-50",
                  )}
                >
                  <header className="flex items-center justify-between p-2.5">
                    <button
                      type="button"
                      className={cn(
                        isEqual(day, selectedDay) && "text-primary-foreground",
                        !isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          isSameMonth(day, firstDayCurrentMonth) &&
                          "text-foreground",
                        !isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          !isSameMonth(day, firstDayCurrentMonth) &&
                          "text-muted-foreground",
                        isEqual(day, selectedDay) &&
                          isToday(day) &&
                          "border-none bg-primary",
                        isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          "bg-foreground",
                        (isEqual(day, selectedDay) || isToday(day)) &&
                          "font-semibold",
                        "flex h-7 w-7 items-center justify-center rounded-full text-xs hover:border",
                      )}
                    >
                      <time dateTime={format(day, "yyyy-MM-dd")}>
                        {format(day, "d")}
                      </time>
                    </button>
                  </header>
                  <div className="flex-1 p-2.5">
                    {isDateReserved(day) && (
                      <div className="space-y-1.5">
                        <div className="flex flex-col items-start gap-1 rounded-lg border p-2 text-xs leading-tight bg-red-100 text-red-800">
                          <p className="font-medium leading-none">
                            Réservé
                          </p>
                          <p className="leading-none text-red-600">
                            Non disponible
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>

          <div className="isolate grid w-full grid-cols-7 grid-rows-5 border-x lg:hidden">
            {days.map((day, dayIdx) => (
              <button
                onClick={() => handleDaySelect(day)}
                key={dayIdx}
                type="button"
                className={cn(
                  isEqual(day, selectedDay) && "text-primary-foreground",
                  !isEqual(day, selectedDay) &&
                    !isToday(day) &&
                    isSameMonth(day, firstDayCurrentMonth) &&
                    "text-foreground",
                  !isEqual(day, selectedDay) &&
                    !isToday(day) &&
                    !isSameMonth(day, firstDayCurrentMonth) &&
                    "text-muted-foreground",
                  (isEqual(day, selectedDay) || isToday(day)) &&
                    "font-semibold",
                  "flex h-14 flex-col border-b border-r px-3 py-2 hover:bg-muted focus:z-10",
                  // Couleur de fond pour les jours réservés
                  isDateReserved(day) && "bg-red-50",
                )}
              >
                <time
                  dateTime={format(day, "yyyy-MM-dd")}
                  className={cn(
                    "ml-auto flex size-6 items-center justify-center rounded-full",
                    isEqual(day, selectedDay) &&
                      isToday(day) &&
                      "bg-primary text-primary-foreground",
                    isEqual(day, selectedDay) &&
                      !isToday(day) &&
                      "bg-primary text-primary-foreground",
                  )}
                >
                  {format(day, "d")}
                </time>
                {isDateReserved(day) && (
                  <div className="-mx-0.5 mt-auto flex flex-wrap-reverse">
                    <span className="mx-0.5 mt-1 h-1.5 w-1.5 rounded-full bg-red-500" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-sm text-muted-foreground">Chargement des disponibilités...</span>
        </div>
      )}

      {/* Information */}
      <div className="p-4 border-t bg-muted/30">
        <p className="text-xs text-muted-foreground text-center">
          Ce calendrier affiche les dates déjà réservées. Les dates en rouge ne sont pas disponibles.
        </p>
      </div>
    </div>
  )
} 
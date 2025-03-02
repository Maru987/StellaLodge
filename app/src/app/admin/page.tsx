"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { format, isSameDay } from "date-fns"
import { fr } from "date-fns/locale"
import { FullScreenCalendar } from "@/components/ui/fullscreen-calendar"
import { Calendar, ListFilter, BarChart3 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface Reservation {
  id: string
  name: string
  email: string
  phone: string
  check_in: string
  check_out: string
  guests: number
  message: string
  status: "pending" | "confirmed" | "cancelled"
  created_at: string
  plan_id: string
  plan_name: string
  price: number
}

interface CalendarEvent {
  id: number
  name: string
  time: string
  datetime: string
  status: "pending" | "confirmed" | "cancelled"
}

interface CalendarData {
  day: Date
  events: CalendarEvent[]
}

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [calendarData, setCalendarData] = useState<CalendarData[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [activeTab, setActiveTab] = useState<string>("calendar")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const pathname = usePathname()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error || !data.session) {
          console.log("Aucune session trouvée, redirection vers /auth")
          window.location.href = "/auth"
          return
        }
        
        setUser(data.session.user)
        fetchReservations()
      } catch (error) {
        console.error("Erreur lors de la vérification de la session:", error)
        window.location.href = "/auth"
      } finally {
        setLoading(false)
      }
    }
    
    checkSession()
  }, [])

  const fetchReservations = async () => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('check_in', { ascending: true })
      
      if (error) throw error
      
      setReservations(data || [])
      
      // Mettre à jour les données du calendrier
      updateCalendarData(data || [])
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations:", error)
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      window.location.href = "/auth"
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    }
  }

  const updateReservationStatus = async (id: string, status: "pending" | "confirmed" | "cancelled") => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', id)
      
      if (error) throw error
      
      // Mettre à jour l'état local
      const updatedReservations = reservations.map(res => 
        res.id === id ? { ...res, status } : res
      );
      
      setReservations(updatedReservations);
      
      if (selectedReservation?.id === id) {
        setSelectedReservation({ ...selectedReservation, status });
      }
      
      // Mettre à jour les données du calendrier
      updateCalendarData(updatedReservations);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error)
    }
  }
  
  // Fonction pour mettre à jour les données du calendrier
  const updateCalendarData = (reservationsData: Reservation[]) => {
    const calendarEvents: { [key: string]: CalendarData } = {}
    
    reservationsData.forEach((reservation: Reservation) => {
      const checkInDate = new Date(reservation.check_in)
      const checkOutDate = new Date(reservation.check_out)
      
      // Créer un événement pour chaque jour entre check-in et check-out (inclus)
      let currentDate = new Date(checkInDate)
      
      while (currentDate <= checkOutDate) {
        const dateKey = format(currentDate, 'yyyy-MM-dd')
        
        // Déterminer le type d'événement (arrivée, séjour ou départ)
        let eventName = `Séjour: ${reservation.name}`
        if (isSameDay(currentDate, checkInDate)) {
          eventName = `Arrivée: ${reservation.name}`
        } else if (isSameDay(currentDate, checkOutDate)) {
          eventName = `Départ: ${reservation.name}`
        }
        
        // Créer ou mettre à jour l'entrée pour cette date
        if (!calendarEvents[dateKey]) {
          calendarEvents[dateKey] = {
            day: new Date(currentDate),
            events: []
          }
        }
        
        // Ajouter l'événement
        calendarEvents[dateKey].events.push({
          id: parseInt(reservation.id) * 100 + currentDate.getDate(), // ID unique pour chaque jour
          name: eventName,
          time: `${reservation.guests} invités`,
          datetime: currentDate.toISOString(),
          status: reservation.status
        })
        
        // Passer au jour suivant
        currentDate.setDate(currentDate.getDate() + 1)
      }
    })
    
    // Convertir l'objet en tableau pour le state
    setCalendarData(Object.values(calendarEvents))
  }

  // Filtrer les réservations par statut
  const filteredByStatusReservations = statusFilter === "all" 
    ? reservations 
    : reservations.filter(res => res.status === statusFilter);

  // Filtrer les réservations pour la date sélectionnée
  const filteredReservations = selectedDate 
    ? reservations.filter(res => {
        const checkIn = new Date(res.check_in)
        const checkOut = new Date(res.check_out)
        const selected = new Date(selectedDate)
        
        // Réinitialiser les heures pour comparer uniquement les dates
        selected.setHours(0, 0, 0, 0)
        checkIn.setHours(0, 0, 0, 0)
        checkOut.setHours(0, 0, 0, 0)
        
        return checkIn <= selected && selected <= checkOut
      })
    : []

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Navigation */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-2 sm:px-4">
          <nav className="flex flex-wrap justify-center sm:justify-start gap-2 sm:space-x-4 py-4 overflow-x-hidden">
            <button
              onClick={() => setActiveTab("calendar")}
              className={cn(
                "flex items-center px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors",
                activeTab === "calendar" 
                  ? "bg-blue-100 text-blue-700" 
                  : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
              )}
            >
              <Calendar className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Calendrier
            </button>
            <button
              onClick={() => setActiveTab("reservations")}
              className={cn(
                "flex items-center px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors",
                activeTab === "reservations" 
                  ? "bg-blue-100 text-blue-700" 
                  : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
              )}
            >
              <ListFilter className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Réservations
            </button>
            <button
              onClick={() => setActiveTab("finances")}
              className={cn(
                "flex items-center px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors",
                activeTab === "finances" 
                  ? "bg-blue-100 text-blue-700" 
                  : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
              )}
            >
              <BarChart3 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Finances
            </button>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 overflow-x-hidden">
        {activeTab === "calendar" && (
          <>
            {/* Existing calendar content */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Gestion des réservations</h1>
              {user && (
                <Button
                  variant="outline"
                  onClick={async () => {
                    await supabase.auth.signOut()
                    window.location.href = "/"
                  }}
                >
                  Déconnexion
                </Button>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <FullScreenCalendar
                    data={calendarData}
                    onDateSelect={setSelectedDate}
                  />
                </div>
                <div className="lg:col-span-1 overflow-y-auto p-4">
                  <h2 className="text-xl font-semibold mb-4">
                    Réservations du {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
                  </h2>
                  
                  {filteredReservations.length === 0 ? (
                    <p className="text-muted-foreground">Aucune réservation pour cette date.</p>
                  ) : (
                    <div className="space-y-4">
                      {filteredReservations.map((reservation) => (
                        <div 
                          key={reservation.id} 
                          className={`p-4 border rounded-md cursor-pointer transition-colors ${
                            selectedReservation?.id === reservation.id 
                              ? 'border-primary bg-primary/5' 
                              : 'hover:bg-accent'
                          }`}
                          onClick={() => setSelectedReservation(reservation)}
                        >
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium">{reservation.name}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              reservation.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {reservation.status === 'confirmed' ? 'Confirmée' :
                               reservation.status === 'cancelled' ? 'Annulée' : 'En attente'}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{reservation.email}</p>
                          <p className="text-sm text-muted-foreground">{reservation.phone}</p>
                          
                          <div className="mt-2 flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateReservationStatus(reservation.id, 'confirmed');
                              }}
                              disabled={reservation.status === 'confirmed'}
                              className="text-xs h-8"
                            >
                              Confirmer
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateReservationStatus(reservation.id, 'cancelled');
                              }}
                              disabled={reservation.status === 'cancelled'}
                              className="text-xs h-8 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                            >
                              Annuler
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {selectedReservation && (
                    <div className="mt-4 sm:mt-6 border-t pt-4 sm:pt-6">
                      <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Détails de la réservation</h3>
                      <div className="space-y-2 sm:space-y-3 text-sm">
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-gray-500">Nom</p>
                          <p>{selectedReservation.name}</p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-gray-500">Email</p>
                          <p className="break-words">{selectedReservation.email}</p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-gray-500">Téléphone</p>
                          <p>{selectedReservation.phone}</p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-gray-500">Dates</p>
                          <p>Du {format(new Date(selectedReservation.check_in), 'dd/MM/yyyy')} au {format(new Date(selectedReservation.check_out), 'dd/MM/yyyy')}</p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-gray-500">Nombre de personnes</p>
                          <p>{selectedReservation.guests}</p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-gray-500">Plan tarifaire</p>
                          <p>{selectedReservation.plan_name} - {selectedReservation.price.toLocaleString()} FCFA</p>
                        </div>
                        {selectedReservation.message && (
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-500">Message</p>
                            <p className="whitespace-pre-wrap text-xs sm:text-sm">{selectedReservation.message}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-gray-500">Statut</p>
                          <p className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            selectedReservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            selectedReservation.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {selectedReservation.status === 'confirmed' ? 'Confirmée' :
                             selectedReservation.status === 'cancelled' ? 'Annulée' : 'En attente'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "reservations" && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h1 className="text-xl sm:text-2xl font-bold">Liste des réservations</h1>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <Button 
                  variant={statusFilter === "all" ? "default" : "outline"}
                  onClick={() => setStatusFilter("all")}
                  className="text-xs sm:text-sm px-2 py-1 h-auto"
                >
                  Toutes
                </Button>
                <Button 
                  variant={statusFilter === "pending" ? "default" : "outline"}
                  onClick={() => setStatusFilter("pending")}
                  className="text-xs sm:text-sm px-2 py-1 h-auto bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200 hover:text-yellow-900"
                >
                  En attente
                </Button>
                <Button 
                  variant={statusFilter === "confirmed" ? "default" : "outline"}
                  onClick={() => setStatusFilter("confirmed")}
                  className="text-xs sm:text-sm px-2 py-1 h-auto bg-green-100 text-green-800 border-green-200 hover:bg-green-200 hover:text-green-900"
                >
                  Confirmées
                </Button>
                <Button 
                  variant={statusFilter === "cancelled" ? "default" : "outline"}
                  onClick={() => setStatusFilter("cancelled")}
                  className="text-xs sm:text-sm px-2 py-1 h-auto bg-red-100 text-red-800 border-red-200 hover:bg-red-200 hover:text-red-900"
                >
                  Annulées
                </Button>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-lg shadow">
                  <div className="overflow-x-auto max-w-full">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Client
                          </th>
                          <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Dates
                          </th>
                          <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Pers.
                          </th>
                          <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Statut
                          </th>
                          <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredByStatusReservations.map((reservation) => (
                          <tr 
                            key={reservation.id} 
                            className={`hover:bg-gray-50 cursor-pointer ${selectedReservation?.id === reservation.id ? 'bg-blue-50' : ''}`}
                            onClick={() => setSelectedReservation(reservation)}
                          >
                            <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                              <div className="flex flex-col">
                                <div className="text-xs sm:text-sm font-medium text-gray-900">{reservation.name}</div>
                                <div className="text-xs sm:text-sm text-gray-500">{reservation.email}</div>
                                <div className="text-xs sm:text-sm text-gray-500">{reservation.phone}</div>
                              </div>
                            </td>
                            <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                              <div className="text-xs sm:text-sm text-gray-900">
                                {format(new Date(reservation.check_in), 'dd/MM/yyyy')} - {format(new Date(reservation.check_out), 'dd/MM/yyyy')}
                              </div>
                            </td>
                            <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                              {reservation.guests}
                            </td>
                            <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                reservation.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {reservation.status === 'confirmed' ? 'Confirmée' :
                                 reservation.status === 'cancelled' ? 'Annulée' : 'En attente'}
                              </span>
                            </td>
                            <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex flex-col sm:flex-row gap-1 sm:space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateReservationStatus(reservation.id, 'confirmed');
                                  }}
                                  disabled={reservation.status === 'confirmed'}
                                  className="text-xs h-6 sm:h-8 px-1 sm:px-2 py-0"
                                >
                                  Confirmer
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateReservationStatus(reservation.id, 'cancelled');
                                  }}
                                  disabled={reservation.status === 'cancelled'}
                                  className="text-xs h-6 sm:h-8 px-1 sm:px-2 py-0 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                >
                                  Annuler
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Panneau de détails de réservation */}
                <div className="lg:col-span-1">
                  {selectedReservation ? (
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-semibold">Détails de la réservation</h2>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedReservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          selectedReservation.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedReservation.status === 'confirmed' ? 'Confirmée' :
                           selectedReservation.status === 'cancelled' ? 'Annulée' : 'En attente'}
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Référence</p>
                            <p className="font-mono text-sm">{selectedReservation.id.substring(0, 8)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Date de création</p>
                            <p>{format(new Date(selectedReservation.created_at), 'dd/MM/yyyy')}</p>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500">Client</p>
                          <p className="font-medium text-lg">{selectedReservation.name}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Email</p>
                            <p>{selectedReservation.email}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Téléphone</p>
                            <p>{selectedReservation.phone}</p>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Arrivée</p>
                            <p>{format(new Date(selectedReservation.check_in), 'dd MMMM yyyy', { locale: fr })}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Départ</p>
                            <p>{format(new Date(selectedReservation.check_out), 'dd MMMM yyyy', { locale: fr })}</p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500">Durée</p>
                          <p>{Math.ceil((new Date(selectedReservation.check_out).getTime() - new Date(selectedReservation.check_in).getTime()) / (1000 * 60 * 60 * 24))} nuits</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500">Nombre de personnes</p>
                          <p>{selectedReservation.guests} {selectedReservation.guests > 1 ? 'personnes' : 'personne'}</p>
                        </div>
                        
                        <Separator />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Plan tarifaire</p>
                            <p className="font-medium">{selectedReservation.plan_name}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Prix</p>
                            <p className="font-medium">{selectedReservation.price.toLocaleString()} FCFA</p>
                          </div>
                        </div>
                        
                        {selectedReservation.message && (
                          <>
                            <Separator />
                            <div>
                              <p className="text-sm font-medium text-gray-500">Message</p>
                              <p className="whitespace-pre-wrap text-sm mt-1 bg-gray-50 p-3 rounded-md">{selectedReservation.message}</p>
                            </div>
                          </>
                        )}
                        
                        <Separator />
                        
                        <div className="flex justify-between space-x-2 pt-2">
                          <Button 
                            onClick={() => updateReservationStatus(selectedReservation.id, 'confirmed')}
                            disabled={selectedReservation.status === 'confirmed'}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            Confirmer
                          </Button>
                          <Button 
                            onClick={() => updateReservationStatus(selectedReservation.id, 'cancelled')}
                            disabled={selectedReservation.status === 'cancelled'}
                            className="flex-1 bg-red-600 hover:bg-red-700"
                          >
                            Annuler
                          </Button>
                        </div>
                        
                        {(selectedReservation.status === 'confirmed' || selectedReservation.status === 'cancelled') && (
                          <Button 
                            onClick={() => updateReservationStatus(selectedReservation.id, 'pending')}
                            variant="outline"
                            className="w-full mt-2"
                          >
                            Remettre en attente
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center h-full">
                      <div className="text-center text-gray-500">
                        <p>Sélectionnez une réservation pour voir les détails</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "finances" && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h1 className="text-xl sm:text-2xl font-bold">Finances</h1>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <Button 
                  variant="outline"
                  className="text-xs sm:text-sm px-2 py-1 h-auto flex-1 sm:flex-auto"
                >
                  Ce mois
                </Button>
                <Button 
                  variant="outline"
                  className="text-xs sm:text-sm px-2 py-1 h-auto flex-1 sm:flex-auto"
                >
                  Trimestre
                </Button>
                <Button 
                  variant="outline"
                  className="text-xs sm:text-sm px-2 py-1 h-auto flex-1 sm:flex-auto"
                >
                  Année
                </Button>
                <Button 
                  variant="outline"
                  className="text-xs sm:text-sm px-2 py-1 h-auto flex-1 sm:flex-auto"
                >
                  Personnalisé
                </Button>
              </div>
            </div>
            
            {/* Cartes de résumé */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-gray-500 mb-1">Revenus totaux</p>
                <p className="text-xl sm:text-2xl font-bold">{(reservations.reduce((sum, res) => {
                  if (res.status === 'cancelled') return sum;
                  const checkIn = new Date(res.check_in);
                  const checkOut = new Date(res.check_out);
                  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
                  return sum + (res.price * nights);
                }, 0)).toLocaleString()} FCFA</p>
                <p className="text-xs text-green-600 mt-1 sm:mt-2">+15% par rapport au mois dernier</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-gray-500 mb-1">Réservations confirmées</p>
                <p className="text-xl sm:text-2xl font-bold">{reservations.filter(res => res.status === 'confirmed').length}</p>
                <p className="text-xs text-green-600 mt-1 sm:mt-2">+3 par rapport au mois dernier</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-gray-500 mb-1">Taux d'occupation</p>
                <p className="text-xl sm:text-2xl font-bold">78%</p>
                <p className="text-xs text-yellow-600 mt-1 sm:mt-2">-2% par rapport au mois dernier</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-gray-500 mb-1">Revenu moyen par réservation</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {reservations.length > 0 
                    ? Math.round(reservations.reduce((sum, res) => {
                        if (res.status === 'cancelled') return sum;
                        const checkIn = new Date(res.check_in);
                        const checkOut = new Date(res.check_out);
                        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
                        return sum + (res.price * nights);
                      }, 0) / 
                        reservations.filter(res => res.status !== 'cancelled').length).toLocaleString() 
                    : 0} FCFA
                </p>
                <p className="text-xs text-yellow-600 mt-1 sm:mt-2">+5% par rapport au mois dernier</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Tableau des revenus par réservation */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
                <div className="p-3 sm:p-4 border-b">
                  <h2 className="font-semibold text-sm sm:text-base">Revenus par réservation</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dates
                        </th>
                        <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Plan
                        </th>
                        <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Durée
                        </th>
                        <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Montant
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reservations
                        .filter(res => res.status !== 'cancelled')
                        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                        .slice(0, 5)
                        .map((reservation) => {
                          const checkIn = new Date(reservation.check_in);
                          const checkOut = new Date(reservation.check_out);
                          const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
                          const totalAmount = reservation.price * nights;
                          
                          return (
                            <tr key={reservation.id} className="hover:bg-gray-50">
                              <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                                <div className="text-xs sm:text-sm font-medium text-gray-900">{reservation.name}</div>
                              </td>
                              <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                                <div className="text-xs sm:text-sm text-gray-900">
                                  {format(checkIn, 'dd/MM/yyyy')} - {format(checkOut, 'dd/MM/yyyy')}
                                </div>
                              </td>
                              <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                                {reservation.plan_name}
                              </td>
                              <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                                {nights} nuit{nights > 1 ? 's' : ''}
                              </td>
                              <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                                {totalAmount.toLocaleString()} FCFA
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
                <div className="p-3 sm:p-4 border-t">
                  <Button variant="outline" size="sm" className="text-xs">
                    Voir toutes les réservations
                  </Button>
                </div>
              </div>
              
              {/* Statistiques et graphiques */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow p-3 sm:p-6 mb-4 sm:mb-6">
                  <h2 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4">Répartition par plan</h2>
                  <div className="space-y-3 sm:space-y-4">
                    {Array.from(new Set(reservations.map(r => r.plan_name))).map(planName => {
                      const planReservations = reservations.filter(r => r.plan_name === planName && r.status !== 'cancelled');
                      const totalAmount = planReservations.reduce((sum, res) => {
                        const checkIn = new Date(res.check_in);
                        const checkOut = new Date(res.check_out);
                        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
                        return sum + (res.price * nights);
                      }, 0);
                      const percentage = reservations.filter(r => r.status !== 'cancelled').length > 0 
                        ? Math.round((planReservations.length / reservations.filter(r => r.status !== 'cancelled').length) * 100) 
                        : 0;
                      
                      return (
                        <div key={planName}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs sm:text-sm font-medium">{planName}</span>
                            <span className="text-xs sm:text-sm text-gray-500">{percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                            <div 
                              className="bg-blue-600 h-1.5 sm:h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {planReservations.length} réservation{planReservations.length > 1 ? 's' : ''} - {totalAmount.toLocaleString()} FCFA
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-3 sm:p-6">
                  <h2 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4">Taux d'annulation</h2>
                  <div className="flex items-center justify-center">
                    <div className="relative inline-flex items-center justify-center">
                      <svg className="w-24 h-24 sm:w-32 sm:h-32">
                        <circle 
                          className="text-gray-200" 
                          strokeWidth="8" 
                          stroke="currentColor" 
                          fill="transparent" 
                          r="42" 
                          cx="48" 
                          cy="48"
                        />
                        <circle 
                          className="text-red-500" 
                          strokeWidth="8" 
                          strokeDasharray={`${Math.round((reservations.filter(r => r.status === 'cancelled').length / (reservations.length || 1)) * 264)} 264`}
                          strokeLinecap="round" 
                          stroke="currentColor" 
                          fill="transparent" 
                          r="42" 
                          cx="48" 
                          cy="48"
                        />
                        <text 
                          x="48" 
                          y="48" 
                          textAnchor="middle" 
                          dominantBaseline="middle" 
                          className="text-lg sm:text-xl font-bold"
                        >
                          {Math.round((reservations.filter(r => r.status === 'cancelled').length / (reservations.length || 1)) * 100)}%
                        </text>
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-center mt-3 sm:mt-4">
                    {reservations.filter(r => r.status === 'cancelled').length} réservation{reservations.filter(r => r.status === 'cancelled').length > 1 ? 's' : ''} annulée{reservations.filter(r => r.status === 'cancelled').length > 1 ? 's' : ''} sur {reservations.length}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
} 
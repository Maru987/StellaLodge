"use client"

import { useEffect, useState, useRef } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { format, isSameDay } from "date-fns"
import { fr } from "date-fns/locale"
import { FullScreenCalendar } from "@/components/ui/fullscreen-calendar"
import { Calendar, ListFilter, BarChart3, Plus, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { addDays } from "date-fns"
import { DateRange } from "react-day-picker"
import { 
  fetchGalleryImages, 
  uploadGalleryImage, 
  addGalleryImage, 
  updateGalleryImage, 
  deleteGalleryImage,
  GalleryImage 
} from "@/lib/supabase"
import { createClient } from "@supabase/supabase-js"

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
  const [isAddReservationOpen, setIsAddReservationOpen] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 1),
  })
  const [reservationStep, setReservationStep] = useState<'info' | 'dates'>('info')
  const [newReservation, setNewReservation] = useState({
    name: "",
    email: "",
    phone: "",
    guests: 1,
    message: "",
    plan_name: "1 nuit",
    price: 25000,
    period: "1 nuit"
  })
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [isAddImageOpen, setIsAddImageOpen] = useState(false)
  const [isEditImageOpen, setIsEditImageOpen] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [newImage, setNewImage] = useState({
    title: "",
    alt_text: "",
    category: "interior",
    featured: false
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          window.location.href = "/auth"
          return
        }
        
        setUser(session.user)
        setLoading(false)
        
        // Vérifier si les politiques de stockage sont correctement configurées
        const checkStoragePolicies = async () => {
          try {
            // Tester l'accès au bucket gallery en essayant de lister les fichiers
            const { data, error } = await supabase.storage.from('gallery').list();
            
            if (error) {
              console.warn("Problème d'accès au bucket gallery:", error);
              
              // Si l'erreur est liée aux politiques de sécurité, proposer de les configurer
              if (error.message && (
                  error.message.includes('policy') || 
                  error.message.includes('permission') || 
                  error.message.includes('access')
                )) {
                const shouldSetup = confirm(
                  "Les politiques de sécurité pour le stockage des images ne semblent pas être correctement configurées. " +
                  "Voulez-vous les configurer automatiquement maintenant?"
                );
                
                if (shouldSetup) {
                  await setupStoragePolicies();
                }
              }
            } else {
              console.log("Accès au bucket gallery vérifié avec succès");
            }
          } catch (err) {
            console.warn("Erreur lors de la vérification des politiques de stockage:", err);
          }
        };
        
        // Exécuter la vérification des politiques
        checkStoragePolicies();
      } catch (error) {
        console.error("Erreur lors de la vérification de la session:", error)
        window.location.href = "/auth"
      }
    }

    checkSession()
    fetchReservations()
    fetchImages()
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

  const fetchImages = async () => {
    try {
      const { data, error } = await fetchGalleryImages();
      
      if (error) throw error;
      
      setGalleryImages(data || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des images:", error);
    }
  };

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
    
    // Filtrer les réservations annulées
    const activeReservations = reservationsData.filter(res => res.status !== 'cancelled')
    
    activeReservations.forEach((reservation: Reservation) => {
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

  const handleAddReservation = async () => {
    try {
      if (!dateRange?.from || !dateRange?.to) {
        alert("Veuillez sélectionner les dates de séjour");
        return;
      }
      
      if (!newReservation.name || !newReservation.email || !newReservation.phone) {
        alert("Veuillez remplir tous les champs obligatoires");
        return;
      }
      
      if (newReservation.price <= 0) {
        alert("Veuillez saisir un prix valide");
        return;
      }

      const { data, error } = await supabase
        .from('reservations')
        .insert([
          {
            name: newReservation.name,
            email: newReservation.email,
            phone: newReservation.phone,
            check_in: dateRange.from.toISOString().split('T')[0],
            check_out: dateRange.to.toISOString().split('T')[0],
            guests: newReservation.guests,
            message: newReservation.message,
            status: "confirmed",
            plan_name: newReservation.plan_name,
            price: newReservation.price,
            period: newReservation.period
          }
        ])
        .select()

      if (error) throw error

      // Mettre à jour l'état local
      fetchReservations()
      
      // Afficher un message de succès
      alert(`Réservation créée avec succès pour ${newReservation.name} - ${newReservation.price.toLocaleString()} XPF`)
      
      // Réinitialiser le formulaire
      setNewReservation({
        name: "",
        email: "",
        phone: "",
        guests: 1,
        message: "",
        plan_name: "1 nuit",
        price: 25000,
        period: "1 nuit"
      })
      setDateRange({
        from: new Date(),
        to: addDays(new Date(), 1),
      })
      
      // Réinitialiser l'étape et fermer le dialogue
      setReservationStep('info')
      setIsAddReservationOpen(false)
    } catch (error) {
      console.error("Erreur lors de l'ajout de la réservation:", error)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImageFile(file);
    
    // Créer une URL pour la prévisualisation
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleAddImage = async () => {
    try {
      if (!imageFile) {
        alert("Veuillez sélectionner une image");
        return;
      }
      
      console.log("Début de l'ajout d'image");
      console.log("Fichier sélectionné:", imageFile.name, imageFile.type, imageFile.size);
      
      // Vérifier si l'utilisateur est authentifié
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData?.session) {
        console.error("Utilisateur non authentifié pour l'ajout d'image");
        alert("Vous devez être connecté pour ajouter des images");
        window.location.href = "/auth";
        return;
      }
      
      // Générer un nom de fichier unique
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `images/${fileName}`;
      
      console.log("Chemin du fichier:", filePath);
      
      // Télécharger l'image
      const { success, data: uploadData, error: uploadError } = await uploadGalleryImage(imageFile, filePath);
      
      if (!success || !uploadData) {
        console.error("Erreur lors du téléchargement:", uploadError);
        
        // Vérifier si l'erreur est liée aux politiques de sécurité
        const errorMessage = uploadError instanceof Error ? uploadError.message : String(uploadError);
        if (errorMessage.includes("politiques")) {
          if (confirm("Erreur de permissions. Voulez-vous configurer automatiquement les politiques de sécurité?")) {
            await setupStoragePolicies();
          }
        } else {
          alert(errorMessage || "Erreur lors du téléchargement de l'image");
        }
        return;
      }
      
      console.log("Image téléchargée avec succès:", uploadData);
      
      // Ajouter les métadonnées de l'image à la base de données
      const imageData = {
        title: newImage.title || imageFile.name,
        alt_text: newImage.alt_text || '',
        url: uploadData.publicUrl,
        storage_path: filePath,
        category: newImage.category || 'interior',
        featured: newImage.featured || false,
        sort_order: galleryImages.length + 1
      };
      
      const { success: addSuccess, error: addError } = await addGalleryImage(imageData);
      
      if (!addSuccess) {
        console.error("Erreur lors de l'ajout des métadonnées:", addError);
        const errorMessage = addError instanceof Error ? addError.message : String(addError);
        alert(errorMessage || "Erreur lors de l'ajout des métadonnées de l'image");
        return;
      }
      
      console.log("Métadonnées ajoutées avec succès");
      
      // Réinitialiser le formulaire et rafraîchir les images
      setNewImage({
        title: '',
        alt_text: '',
        category: 'interior',
        featured: false
      });
      setImageFile(null);
      setImagePreview('');
      setIsAddImageOpen(false);
      
      // Rafraîchir la liste des images
      fetchImages();
      
      alert("Image ajoutée avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout d'image:", error);
      alert(`Erreur lors de l'ajout d'image: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const handleUpdateImage = async () => {
    try {
      if (!selectedImage) return;
      
      console.log("Début de la mise à jour de l'image:", selectedImage.id);
      
      let updatedImageData: Partial<GalleryImage> = {
        title: selectedImage.title,
        alt_text: selectedImage.alt_text,
        category: selectedImage.category,
        featured: selectedImage.featured
      };
      
      console.log("Données de mise à jour initiales:", updatedImageData);
      
      // Si une nouvelle image a été sélectionnée
      if (imageFile) {
        console.log("Nouvelle image sélectionnée:", imageFile.name, imageFile.type, imageFile.size);
        
        // Télécharger la nouvelle image
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `images/${fileName}`;
        
        console.log("Nouveau chemin de fichier:", filePath);
        
        // Télécharger la nouvelle image
        console.log("Début du téléchargement de la nouvelle image...");
        const uploadResult = await uploadGalleryImage(imageFile, filePath);
        console.log("Résultat du téléchargement:", uploadResult);
        
        if (!uploadResult.success) {
          console.error("Erreur lors du téléchargement de la nouvelle image:", uploadResult.error);
          throw new Error(`Erreur lors du téléchargement: ${uploadResult.error ? (uploadResult.error as any).message || 'Erreur inconnue' : 'Erreur inconnue'}`);
        }
        
        const uploadData = uploadResult.data;
        
        // Vérifier que l'URL publique est disponible
        if (!uploadData?.publicUrl) {
          console.error("URL publique non disponible après téléchargement");
          throw new Error("URL publique non disponible après téléchargement");
        }
        
        console.log("Nouvelle URL publique:", uploadData.publicUrl);
        
        // Supprimer l'ancienne image du stockage
        console.log("Suppression de l'ancienne image:", selectedImage.storage_path);
        try {
          const { error: removeError } = await supabase.storage
            .from('gallery')
            .remove([selectedImage.storage_path]);
            
          if (removeError) {
            console.warn("Erreur lors de la suppression de l'ancienne image:", removeError);
            // On continue malgré l'erreur
          }
        } catch (removeErr) {
          console.warn("Exception lors de la suppression de l'ancienne image:", removeErr);
          // On continue malgré l'erreur
        }
        
        // Mettre à jour les données avec la nouvelle URL
        updatedImageData = {
          ...updatedImageData,
          url: uploadData.publicUrl,
          storage_path: filePath
        };
        
        console.log("Données de mise à jour avec nouvelle image:", updatedImageData);
      }
      
      // Mettre à jour l'entrée dans la base de données
      console.log("Mise à jour des métadonnées dans la base de données...");
      const updateResult = await updateGalleryImage(selectedImage.id!, updatedImageData);
      console.log("Résultat de la mise à jour:", updateResult);
      
      if (!updateResult.success) {
        console.error("Erreur lors de la mise à jour des métadonnées:", updateResult.error);
        throw new Error(`Erreur lors de la mise à jour: ${updateResult.error ? (updateResult.error as any).message || 'Erreur inconnue' : 'Erreur inconnue'}`);
      }
      
      // Mettre à jour l'état local
      console.log("Mise à jour de la liste des images...");
      fetchImages();
      
      // Réinitialiser le formulaire
      setSelectedImage(null);
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      // Fermer le dialogue
      setIsEditImageOpen(false);
      console.log("Image mise à jour avec succès");
    } catch (error) {
      console.error("Erreur détaillée lors de la mise à jour de l'image:", error);
      alert(`Erreur lors de la mise à jour de l'image: ${error instanceof Error ? error.message : 'Veuillez réessayer.'}`);
    }
  };

  const handleDeleteImage = async (image: GalleryImage) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'image "${image.title}" ?`)) {
      return;
    }
    
    try {
      const { error } = await deleteGalleryImage(image.id!, image.storage_path);
      
      if (error) throw error;
      
      // Mettre à jour l'état local
      fetchImages();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'image:", error);
      alert("Erreur lors de la suppression de l'image. Veuillez réessayer.");
    }
  };

  // Fonction pour exécuter les commandes SQL pour configurer les politiques de sécurité
  // Fonction pour calculer les revenus par période
  const calculateRevenueByPeriod = (period: 'month' | 'quarter' | 'year') => {
    const now = new Date();
    const confirmedReservations = reservations.filter(r => r.status === 'confirmed');
    
    return confirmedReservations.reduce((sum, res) => {
      const reservationDate = new Date(res.created_at);
      
      let isInPeriod = false;
      if (period === 'month') {
        isInPeriod = reservationDate.getMonth() === now.getMonth() && 
                    reservationDate.getFullYear() === now.getFullYear();
      } else if (period === 'quarter') {
        const quarter = Math.floor(now.getMonth() / 3);
        const reservationQuarter = Math.floor(reservationDate.getMonth() / 3);
        isInPeriod = reservationQuarter === quarter && 
                    reservationDate.getFullYear() === now.getFullYear();
      } else if (period === 'year') {
        isInPeriod = reservationDate.getFullYear() === now.getFullYear();
      }
      
      return isInPeriod ? sum + res.price : sum;
    }, 0);
  };

  const setupStoragePolicies = async () => {
    try {
      console.log("Configuration des politiques de sécurité pour le stockage...");
      
      // Vérifier si l'utilisateur est authentifié
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData?.session) {
        alert("Vous devez être connecté pour configurer les politiques de sécurité");
        return;
      }
      
      // Créer un client Supabase avec les informations de session explicites
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      
      const authClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: {
            Authorization: `Bearer ${sessionData.session.access_token}`
          }
        }
      });
      
      // Étape 1: Vérifier si le bucket gallery existe, sinon le créer
      console.log("Vérification de l'existence du bucket gallery...");
      try {
        const { data: buckets } = await authClient.storage.listBuckets();
        const galleryBucketExists = buckets?.some(bucket => bucket.name === 'gallery');
        
        if (!galleryBucketExists) {
          console.log("Création du bucket gallery...");
          await authClient.storage.createBucket('gallery', {
            public: true,
            fileSizeLimit: 10485760, // 10MB
          });
          console.log("Bucket gallery créé avec succès");
        } else {
          console.log("Le bucket gallery existe déjà");
        }
      } catch (err) {
        console.warn("Erreur lors de la vérification/création du bucket:", err);
        // Continuer malgré l'erreur, car le bucket pourrait déjà exister
      }
      
      // Étape 2: Activer RLS sur la table storage.objects
      console.log("Activation de RLS sur la table storage.objects...");
      try {
        await authClient.rpc('alter_table_enable_rls', { table_name: 'objects', schema_name: 'storage' });
      } catch (err) {
        console.warn("Erreur lors de l'activation de RLS (peut-être déjà activé):", err);
        // Continuer malgré l'erreur, car RLS pourrait déjà être activé
      }
      
      // Étape 3: Supprimer les politiques existantes pour éviter les doublons
      console.log("Suppression des politiques existantes...");
      const policies = [
        "Allow public read access for gallery files",
        "Allow authenticated users to upload files to gallery",
        "Allow authenticated users to update gallery files",
        "Allow authenticated users to delete gallery files",
        "Allow authenticated users full access to gallery files"
      ];
      
      for (const policy of policies) {
        try {
          await authClient.rpc('drop_policy_if_exists', { 
            policy_name: policy,
            table_name: 'objects',
            schema_name: 'storage'
          });
        } catch (err) {
          console.warn(`Erreur lors de la suppression de la politique ${policy}:`, err);
          // Continuer malgré l'erreur
        }
      }
      
      // Étape 4: Créer uniquement les deux politiques essentielles
      console.log("Création des nouvelles politiques...");
      
      // Politique pour la lecture publique
      try {
        await authClient.rpc('create_storage_policy', {
          name: "Allow public read access for gallery files",
          definition: "bucket_id = 'gallery'",
          operation: 'SELECT',
          role_name: 'public'
        });
        console.log("Politique de lecture publique créée avec succès");
      } catch (err) {
        console.error("Erreur lors de la création de la politique de lecture:", err);
      }
      
      // Politique pour l'accès complet des utilisateurs authentifiés
      try {
        await authClient.rpc('create_storage_policy', {
          name: "Allow authenticated users full access to gallery files",
          definition: "bucket_id = 'gallery'",
          operation: 'ALL',
          role_name: 'authenticated'
        });
        console.log("Politique d'accès complet créée avec succès");
      } catch (err) {
        console.error("Erreur lors de la création de la politique d'accès complet:", err);
      }
      
      console.log("Politiques de sécurité configurées avec succès");
      alert("Les politiques de sécurité ont été configurées avec succès. Veuillez essayer à nouveau d'ajouter une image.");
    } catch (error) {
      console.error("Erreur lors de la configuration des politiques de sécurité:", error);
      alert(`Erreur lors de la configuration des politiques de sécurité: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
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
          <nav className="flex flex-wrap justify-between sm:justify-start gap-2 sm:space-x-4 py-4 overflow-x-hidden">
            <div className="flex flex-wrap justify-center gap-2">
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
              <button
                onClick={() => setActiveTab("gallery")}
                className={cn(
                  "flex items-center px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors",
                  activeTab === "gallery" 
                    ? "bg-blue-100 text-blue-700" 
                    : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
                )}
              >
                <ImageIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Galerie
              </button>
            </div>
            {user && (
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="text-xs sm:text-sm px-2 py-1 h-auto"
              >
                Déconnexion
              </Button>
            )}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 overflow-x-hidden">
        {activeTab === "calendar" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Gestion des réservations</h1>
              <div className="flex items-center gap-2">
                <Dialog open={isAddReservationOpen} onOpenChange={setIsAddReservationOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base whitespace-nowrap">
                      <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="hidden sm:inline">Ajouter une réservation</span>
                      <span className="sm:hidden">Ajouter</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Ajouter une réservation</DialogTitle>
                      <DialogDescription>
                        {reservationStep === 'info' 
                          ? "Remplissez les informations du client."
                          : "Sélectionnez les dates du séjour."}
                      </DialogDescription>
                    </DialogHeader>
                    
                    {reservationStep === 'info' ? (
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Nom complet</Label>
                          <Input
                            id="name"
                            value={newReservation.name}
                            onChange={(e) => setNewReservation({...newReservation, name: e.target.value})}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newReservation.email}
                            onChange={(e) => setNewReservation({...newReservation, email: e.target.value})}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="phone">Téléphone</Label>
                          <Input
                            id="phone"
                            value={newReservation.phone}
                            onChange={(e) => setNewReservation({...newReservation, phone: e.target.value})}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="guests">Nombre d'invités</Label>
                          <Input
                            id="guests"
                            type="number"
                            min="1"
                            value={newReservation.guests}
                            onChange={(e) => setNewReservation({...newReservation, guests: parseInt(e.target.value)})}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="message">Message (optionnel)</Label>
                          <Textarea
                            id="message"
                            value={newReservation.message}
                            onChange={(e) => setNewReservation({...newReservation, message: e.target.value})}
                          />
                        </div>
                        <div className="flex justify-end gap-3">
                          <Button variant="outline" onClick={() => setIsAddReservationOpen(false)}>
                            Annuler
                          </Button>
                          <Button onClick={() => setReservationStep('dates')}>
                            Suivant
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="dates">Dates du séjour</Label>
                          <DatePickerWithRange 
                            date={dateRange}
                            onSelect={(range: DateRange | undefined) => {
                              if (range && range.from && range.to) {
                                setDateRange(range);
                                // Calculer la durée du séjour
                                const nights = Math.ceil((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24));
                                
                                // Déterminer le plan tarifaire suggéré en fonction de la durée
                                let suggestedPlanName, suggestedPrice;
                                if (nights === 1) {
                                  suggestedPlanName = "1 nuit";
                                  suggestedPrice = 15000;
                                } else if (nights >= 2 && nights <= 5) {
                                  suggestedPlanName = "2-5 nuits";
                                  suggestedPrice = 13500 * nights;
                                } else if (nights >= 7 && nights < 30) {
                                  suggestedPlanName = "1 semaine";
                                  suggestedPrice = 12000 * nights;
                                } else {
                                  suggestedPlanName = "Séjour prolongé";
                                  suggestedPrice = 10000 * nights;
                                }
                                
                                // Mettre à jour avec les suggestions (l'admin peut les modifier)
                                setNewReservation({
                                  ...newReservation,
                                  plan_name: suggestedPlanName,
                                  price: suggestedPrice,
                                  period: `${nights} nuit${nights > 1 ? 's' : ''}`
                                });
                              }
                            }}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Plan tarifaire suggéré</Label>
                          <div className="p-3 bg-gray-50 rounded-md">
                            <p className="font-medium">{newReservation.plan_name}</p>
                            <p className="text-sm text-gray-600">{newReservation.price.toLocaleString()} XPF</p>
                            {dateRange?.from && dateRange?.to && (
                              <p className="text-xs text-gray-500 mt-1">
                                Durée: {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))} nuit{Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) > 1 ? 's' : ''}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="custom-price">Prix personnalisé (XPF)</Label>
                          <Input
                            id="custom-price"
                            type="number"
                            min="0"
                            step="1000"
                            value={newReservation.price}
                            onChange={(e) => setNewReservation({
                              ...newReservation,
                              price: parseInt(e.target.value) || 0
                            })}
                            placeholder="Entrez le prix souhaité"
                          />
                          <p className="text-xs text-gray-500">
                            Vous pouvez modifier le prix suggéré selon vos besoins
                          </p>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="custom-plan">Nom du plan personnalisé</Label>
                          <Input
                            id="custom-plan"
                            value={newReservation.plan_name}
                            onChange={(e) => setNewReservation({
                              ...newReservation,
                              plan_name: e.target.value
                            })}
                            placeholder="ex: Séjour spécial, Réservation directe, etc."
                          />
                        </div>
                        <div className="flex justify-end gap-3">
                          <Button variant="outline" onClick={() => setReservationStep('info')}>
                            Retour
                          </Button>
                          <Button onClick={handleAddReservation}>
                            Confirmer la réservation
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
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
                          <p>{selectedReservation.plan_name} - {selectedReservation.price.toLocaleString()} XPF</p>
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
                            <p className="font-medium">{selectedReservation.price.toLocaleString()} XPF</p>
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
                  return sum + res.price;
                }, 0)).toLocaleString()} XPF</p>
                <p className="text-xs text-green-600 mt-1 sm:mt-2">
                  {calculateRevenueByPeriod('month').toLocaleString()} XPF ce mois
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-gray-500 mb-1">Réservations confirmées</p>
                <p className="text-xl sm:text-2xl font-bold">{reservations.filter(res => res.status === 'confirmed').length}</p>
                <p className="text-xs text-green-600 mt-1 sm:mt-2">
                  {reservations.filter(res => res.status === 'confirmed').length > 0 ? 
                    `${Math.round((reservations.filter(res => res.status === 'confirmed').length / reservations.length) * 100)}% du total` : 
                    'Aucune réservation confirmée'
                  }
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-gray-500 mb-1">Taux d'occupation</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {(() => {
                    const totalNights = reservations.reduce((sum, res) => {
                      if (res.status === 'cancelled') return sum;
                      const checkIn = new Date(res.check_in);
                      const checkOut = new Date(res.check_out);
                      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
                      return sum + nights;
                    }, 0);
                    
                    // Calculer le taux d'occupation (supposons 30 jours par mois)
                    const daysInMonth = 30;
                    const occupancyRate = Math.round((totalNights / daysInMonth) * 100);
                    return Math.min(occupancyRate, 100);
                  })()}%
                </p>
                <p className="text-xs text-yellow-600 mt-1 sm:mt-2">-2% par rapport au mois dernier</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-gray-500 mb-1">Revenu moyen par réservation</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {reservations.filter(res => res.status !== 'cancelled').length > 0 
                    ? Math.round(reservations.reduce((sum, res) => {
                        if (res.status === 'cancelled') return sum;
                        return sum + res.price;
                      }, 0) / 
                        reservations.filter(res => res.status !== 'cancelled').length).toLocaleString() 
                    : 0} XPF
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
                          const totalAmount = reservation.price; // Le prix est déjà le total
                          
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
                                {totalAmount.toLocaleString()} XPF
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
                        return sum + res.price; // Le prix est déjà le total
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
                            {planReservations.length} réservation{planReservations.length > 1 ? 's' : ''} - {totalAmount.toLocaleString()} XPF
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

        {activeTab === "gallery" && (
          <div className="container mx-auto px-4 py-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Gestion de la galerie d'images</h2>
              <p className="text-gray-600">Ajoutez, modifiez ou supprimez les images de votre galerie</p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Filtrer par catégorie:</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="text-sm border rounded-md px-3 py-2 bg-white"
                >
                  <option value="all">Toutes les catégories</option>
                  <option value="interior">Intérieur</option>
                  <option value="bedroom">Chambres</option>
                  <option value="bathroom">Salles de bain</option>
                  <option value="kitchen">Cuisine</option>
                  <option value="outdoor">Extérieur</option>
                </select>
              </div>
              <Button
                onClick={() => setIsAddImageOpen(true)}
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                <Plus className="h-4 w-4" />
                Ajouter une image
              </Button>
            </div>

            {/* Grille d'images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {galleryImages
                .filter(img => categoryFilter === "all" || img.category === categoryFilter)
                .map((image) => (
                  <div 
                    key={image.id} 
                    className="border rounded-lg overflow-hidden bg-white shadow hover:shadow-md transition-shadow"
                  >
                    <div className="relative aspect-square">
                      <img 
                        src={image.url} 
                        alt={image.alt_text || image.title} 
                        className="w-full h-full object-cover"
                      />
                      {image.featured && (
                        <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                          Mis en avant
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 truncate">{image.title}</h3>
                      <p className="text-xs text-gray-500 mb-3">Catégorie: {image.category}</p>
                      <div className="flex justify-between gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-xs"
                          onClick={() => {
                            setSelectedImage(image);
                            setImagePreview(image.url);
                            setIsEditImageOpen(true);
                          }}
                        >
                          Modifier
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="flex-1 text-xs text-white font-medium"
                          onClick={() => handleDeleteImage(image)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {galleryImages.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg border">
                <p className="text-gray-500 mb-2">Aucune image dans la galerie</p>
                <p className="text-gray-400 text-sm mb-4">Ajoutez des images pour les afficher sur votre site</p>
                <Button 
                  onClick={() => setIsAddImageOpen(true)}
                  className="mt-2"
                >
                  Ajouter votre première image
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dialogue d'ajout d'image */}
      <Dialog open={isAddImageOpen} onOpenChange={setIsAddImageOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ajouter une nouvelle image</DialogTitle>
            <DialogDescription>
              Téléchargez une image et renseignez ses informations
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="image-upload">Image</Label>
              <div className="flex items-center gap-4">
                <Input
                  ref={fileInputRef}
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="flex-1"
                />
              </div>
              {imagePreview && (
                <div className="mt-2 relative aspect-video w-full max-w-sm mx-auto border rounded-md overflow-hidden">
                  <img 
                    src={imagePreview} 
                    alt="Prévisualisation" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={newImage.title}
                onChange={(e) => setNewImage({...newImage, title: e.target.value})}
                placeholder="Titre de l'image"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="alt-text">Texte alternatif</Label>
              <Input
                id="alt-text"
                value={newImage.alt_text}
                onChange={(e) => setNewImage({...newImage, alt_text: e.target.value})}
                placeholder="Description pour l'accessibilité"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <select
                id="category"
                value={newImage.category}
                onChange={(e) => setNewImage({...newImage, category: e.target.value})}
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                <option value="interior">Intérieur</option>
                <option value="bedroom">Chambres</option>
                <option value="bathroom">Salles de bain</option>
                <option value="kitchen">Cuisine</option>
                <option value="outdoor">Extérieur</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={newImage.featured}
                onChange={(e) => setNewImage({...newImage, featured: e.target.checked})}
                className="rounded border-gray-300"
              />
              <Label htmlFor="featured">Mettre en avant sur la page d'accueil</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddImageOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddImage}>
              Ajouter l'image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogue de modification d'image */}
      <Dialog open={isEditImageOpen} onOpenChange={setIsEditImageOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier l'image</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'image
            </DialogDescription>
          </DialogHeader>
          
          {selectedImage && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-image-upload">Image (optionnel)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    ref={fileInputRef}
                    id="edit-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                </div>
                {imagePreview && (
                  <div className="mt-2 relative aspect-video w-full max-w-sm mx-auto border rounded-md overflow-hidden">
                    <img 
                      src={imagePreview} 
                      alt="Prévisualisation" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-title">Titre</Label>
                <Input
                  id="edit-title"
                  value={selectedImage.title}
                  onChange={(e) => setSelectedImage({...selectedImage, title: e.target.value})}
                  placeholder="Titre de l'image"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-alt-text">Texte alternatif</Label>
                <Input
                  id="edit-alt-text"
                  value={selectedImage.alt_text || ''}
                  onChange={(e) => setSelectedImage({...selectedImage, alt_text: e.target.value})}
                  placeholder="Description pour l'accessibilité"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-category">Catégorie</Label>
                <select
                  id="edit-category"
                  value={selectedImage.category}
                  onChange={(e) => setSelectedImage({...selectedImage, category: e.target.value})}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="interior">Intérieur</option>
                  <option value="bedroom">Chambres</option>
                  <option value="bathroom">Salles de bain</option>
                  <option value="kitchen">Cuisine</option>
                  <option value="outdoor">Extérieur</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-featured"
                  checked={selectedImage.featured}
                  onChange={(e) => setSelectedImage({...selectedImage, featured: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="edit-featured">Mettre en avant sur la page d'accueil</Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditImageOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdateImage}>
              Enregistrer les modifications
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 
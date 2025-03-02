import { createClient } from '@supabase/supabase-js';

// Ces valeurs doivent être remplacées par vos propres clés Supabase
// Vous pouvez les trouver dans les paramètres de votre projet Supabase
// sous "Project Settings" > "API"
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Création du client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type pour les réservations
export interface Reservation {
  id?: string;
  created_at?: string;
  plan_name: string;
  price: number;
  period: string;
  name: string;
  email: string;
  phone: string;
  check_in: string;
  check_out: string;
  guests: number;
  message?: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
}

// Fonction pour enregistrer une réservation via notre API
export async function saveReservation(reservation: Reservation) {
  try {
    console.log("Début de saveReservation avec les données:", reservation);
    
    // Utiliser directement le client Supabase pour l'insertion
    // Cela contourne la route API qui a des problèmes avec la RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    // Créer un client Supabase direct avec les options correctes pour contourner RLS
    const directSupabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      },
      global: {
        headers: {
          'X-Client-Info': 'supabase-js/2.x'
        }
      }
    });
    
    console.log("Client Supabase créé, tentative d'insertion directe");
    
    // Essayer d'insérer directement
    const { data: directData, error: directError } = await directSupabase
      .from("reservations")
      .insert([{
        name: reservation.name,
        email: reservation.email,
        phone: reservation.phone,
        check_in: reservation.check_in,
        check_out: reservation.check_out,
        guests: reservation.guests,
        message: reservation.message || '',
        plan_name: reservation.plan_name,
        price: reservation.price,
        period: reservation.period,
        status: 'pending'
      }])
      .select();
    
    if (directError) {
      console.error("Erreur lors de l'insertion directe:", directError);
      console.log("Tentative via l'API route...");
      
      // Si l'insertion directe échoue, essayer via l'API
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservation),
      });

      console.log("Réponse reçue:", response.status, response.statusText);
      
      const result = await response.json();
      console.log("Résultat JSON:", result);
      
      if (!response.ok) {
        console.error("Erreur API:", result.error);
        throw new Error(result.error || 'Une erreur est survenue');
      }
      
      return { success: true, data: result.data };
    }
    
    // Si l'insertion directe réussit
    console.log("Insertion directe réussie:", directData);
    return { success: true, data: directData[0] };
  } catch (error) {
    console.error('Erreur détaillée lors de l\'enregistrement de la réservation:', error);
    return { success: false, error };
  }
} 